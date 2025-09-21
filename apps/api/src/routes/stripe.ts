import { FastifyInstance } from "fastify";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Webhook handler functions
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("Checkout completed:", session.id);

  if (session.mode === "subscription" && session.subscription) {
    // Handle subscription creation
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Find user by stripe customer ID and update subscription status
    if (session.customer) {
      await prisma.user.updateMany({
        where: { stripeCustomerId: session.customer as string },
        data: {
          subscriptionStatus: "active",
          subscriptionId: subscription.id,
        },
      });
    }
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Payment succeeded:", invoice.id);

  // Save payment record
  if (invoice.customer) {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer as string },
    });

    if (user) {
      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentId: invoice.id,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: "succeeded",
          description: invoice.description || "Subscription payment",
        },
      });
    }
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Payment failed:", invoice.id);

  // Handle failed payment
  if (invoice.customer) {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer as string },
    });

    if (user) {
      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentId: invoice.id,
          amount: invoice.amount_due / 100,
          currency: invoice.currency,
          status: "failed",
          description: invoice.description || "Subscription payment failed",
        },
      });

      // Update subscription status if needed
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: "past_due" },
      });
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Subscription updated:", subscription.id);

  // Update subscription in database
  if (subscription.customer) {
    await prisma.user.updateMany({
      where: { stripeCustomerId: subscription.customer as string },
      data: {
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id,
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Subscription deleted:", subscription.id);

  // Update subscription status in database
  if (subscription.customer) {
    await prisma.user.updateMany({
      where: { stripeCustomerId: subscription.customer as string },
      data: {
        subscriptionStatus: "cancelled",
        subscriptionId: null,
      },
    });
  }
}

export async function stripeRoutes(fastify: FastifyInstance) {
  // Create checkout session
  fastify.post<{
    Body: {
      productId: string;
    };
  }>(
    "/create-checkout-session",
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    },
    async (request, reply) => {
      const user = request.user as { userId: string; email: string };
      const { productId } = request.body;

      try {
        // Get or create Stripe customer
        let customer;
        const userData = await prisma.user.findUnique({
          where: { id: user.userId },
        });

        if (userData?.stripeCustomerId) {
          try {
            customer = await stripe.customers.retrieve(
              userData.stripeCustomerId
            );
          } catch (error) {
            // If customer doesn't exist in Stripe, create a new one
            console.log("Customer not found in Stripe, creating new one");
            customer = await stripe.customers.create({
              email: user.email,
            });

            await prisma.user.update({
              where: { id: user.userId },
              data: { stripeCustomerId: customer.id },
            });
          }
        } else {
          customer = await stripe.customers.create({
            email: user.email,
          });

          await prisma.user.update({
            where: { id: user.userId },
            data: { stripeCustomerId: customer.id },
          });
        }

        // Get the first price for this product
        const prices = await stripe.prices.list({
          product: productId,
          active: true,
        });

        if (prices.data.length === 0) {
          throw new Error(`No active prices found for product ${productId}`);
        }

        const price = prices.data[0];

        // Create checkout session
        const session: Stripe.Checkout.Session =
          await stripe.checkout.sessions.create({
            customer: customer.id,
            payment_method_types: ["card"],
            line_items: [
              {
                price: price.id,
                quantity: 1,
              },
            ],
            mode: "subscription",
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment`,
          });

        return { sessionId: session.id };
      } catch (error) {
        console.error("Stripe error:", error);
        return reply
          .code(500)
          .send({ error: "Failed to create checkout session" });
      }
    }
  );

  // Create checkout session for cart products
  fastify.post<{
    Body: {
      items: Array<{
        title: string;
        subtitle: string;
        price: number;
        quantity: number;
      }>;
    };
  }>(
    "/create-cart-checkout-session",
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    },
    async (request, reply) => {
      const user = request.user as { userId: string; email: string };
      const { items } = request.body;

      try {
        // Get or create Stripe customer
        let customer;
        const userData = await prisma.user.findUnique({
          where: { id: user.userId },
        });

        if (userData?.stripeCustomerId) {
          try {
            customer = await stripe.customers.retrieve(
              userData.stripeCustomerId
            );
          } catch (error) {
            // If customer doesn't exist in Stripe, create a new one
            console.log("Customer not found in Stripe, creating new one");
            customer = await stripe.customers.create({
              email: user.email,
            });

            await prisma.user.update({
              where: { id: user.userId },
              data: { stripeCustomerId: customer.id },
            });
          }
        } else {
          customer = await stripe.customers.create({
            email: user.email,
          });

          await prisma.user.update({
            where: { id: user.userId },
            data: { stripeCustomerId: customer.id },
          });
        }

        // Transform cart items to Stripe line items
        const lineItems = items.map((item) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.title,
              description: item.subtitle,
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        }));

        // Create checkout session for one-time payment
        const session: Stripe.Checkout.Session =
          await stripe.checkout.sessions.create({
            customer: customer.id,
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment", // One-time payment instead of subscription
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
          });

        return { sessionId: session.id };
      } catch (error) {
        console.error("Stripe cart checkout error:", error);
        return reply
          .code(500)
          .send({ error: "Failed to create cart checkout session" });
      }
    }
  );

  // Webhook endpoint for Stripe events
  fastify.post(
    "/webhook",
    {
      config: {
        rawBody: true,
      },
    },
    async (request, reply) => {
      const sig = request.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("Webhook secret not configured");
        return reply.code(400).send({ error: "Webhook secret not configured" });
      }

      let event: Stripe.Event;

      try {
        // Get raw body as buffer
        const rawBody = request.body as Buffer;
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return reply.code(400).send({ error: "Invalid signature" });
      }

      try {
        switch (event.type) {
          case "checkout.session.completed":
            await handleCheckoutCompleted(
              event.data.object as Stripe.Checkout.Session
            );
            break;

          case "invoice.payment_succeeded":
            await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
            break;

          case "invoice.payment_failed":
            await handlePaymentFailed(event.data.object as Stripe.Invoice);
            break;

          case "customer.subscription.updated":
            await handleSubscriptionUpdated(
              event.data.object as Stripe.Subscription
            );
            break;

          case "customer.subscription.deleted":
            await handleSubscriptionDeleted(
              event.data.object as Stripe.Subscription
            );
            break;

          default:
            console.log(`Unhandled event type ${event.type}`);
        }

        return { received: true };
      } catch (error) {
        console.error("Error processing webhook:", error);
        return reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  // Get user subscription status
  fastify.get(
    "/subscription-status",
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    },
    async (request, reply) => {
      const user = request.user as { userId: string; email: string };

      try {
        const userData = await prisma.user.findUnique({
          where: { id: user.userId },
          include: {
            subscriptions: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });

        if (!userData || !userData.stripeCustomerId) {
          return { hasSubscription: false, subscription: null };
        }

        // Get active subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
          customer: userData.stripeCustomerId,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          return { hasSubscription: false, subscription: null };
        }

        const subscription = subscriptions.data[0];
        return {
          hasSubscription: true,
          subscription: {
            id: subscription.id,
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            priceId: subscription.items.data[0]?.price.id,
            productId: subscription.items.data[0]?.price.product,
          },
        };
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        return reply
          .code(500)
          .send({ error: "Failed to fetch subscription status" });
      }
    }
  );

  // Cancel subscription
  fastify.post(
    "/cancel-subscription",
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    },
    async (request, reply) => {
      const user = request.user as { userId: string; email: string };

      try {
        const userData = await prisma.user.findUnique({
          where: { id: user.userId },
        });

        if (!userData?.stripeCustomerId) {
          return reply.code(404).send({ error: "No customer found" });
        }

        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: userData.stripeCustomerId,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          return reply
            .code(404)
            .send({ error: "No active subscription found" });
        }

        const subscription = subscriptions.data[0];

        // Cancel at period end
        await stripe.subscriptions.update(subscription.id, {
          cancel_at_period_end: true,
        });

        return {
          success: true,
          message:
            "Subscription will be cancelled at the end of the current period",
        };
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        return reply.code(500).send({ error: "Failed to cancel subscription" });
      }
    }
  );

  // Get payment history
  fastify.get(
    "/payment-history",
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    },
    async (request, reply) => {
      const user = request.user as { userId: string; email: string };

      try {
        const userData = await prisma.user.findUnique({
          where: { id: user.userId },
        });

        if (!userData?.stripeCustomerId) {
          return { payments: [] };
        }

        // Get charges from Stripe
        const charges = await stripe.charges.list({
          customer: userData.stripeCustomerId,
          limit: 50,
        });

        const payments = charges.data.map((charge) => ({
          id: charge.id,
          amount: charge.amount / 100, // Convert from cents
          currency: charge.currency,
          status: charge.status,
          description: charge.description,
          created: charge.created,
          receiptUrl: charge.receipt_url,
        }));

        return { payments };
      } catch (error) {
        console.error("Error fetching payment history:", error);
        return reply
          .code(500)
          .send({ error: "Failed to fetch payment history" });
      }
    }
  );

  // Change subscription plan
  fastify.post<{
    Body: { newProductId: string };
  }>(
    "/change-subscription",
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    },
    async (request, reply) => {
      const user = request.user as { userId: string; email: string };
      const { newProductId } = request.body;

      try {
        const userData = await prisma.user.findUnique({
          where: { id: user.userId },
        });

        if (!userData?.stripeCustomerId) {
          return reply.code(404).send({ error: "No customer found" });
        }

        // Get active subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: userData.stripeCustomerId,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          return reply
            .code(404)
            .send({ error: "No active subscription found" });
        }

        const subscription = subscriptions.data[0];

        // Get new price
        const prices = await stripe.prices.list({
          product: newProductId,
          active: true,
        });

        if (prices.data.length === 0) {
          return reply
            .code(400)
            .send({ error: "No active prices found for the new product" });
        }

        const newPrice = prices.data[0];

        // Update subscription
        await stripe.subscriptions.update(subscription.id, {
          items: [
            {
              id: subscription.items.data[0].id,
              price: newPrice.id,
            },
          ],
          proration_behavior: "create_prorations",
        });

        return { success: true, message: "Subscription updated successfully" };
      } catch (error) {
        console.error("Error changing subscription:", error);
        return reply.code(500).send({ error: "Failed to change subscription" });
      }
    }
  );
}
