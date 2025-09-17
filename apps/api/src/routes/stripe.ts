import { FastifyInstance } from 'fastify'
import Stripe from 'stripe'
import { prisma } from '../lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function stripeRoutes(fastify: FastifyInstance) {
  // Create checkout session
  fastify.post<{
    Body: { priceId: string }
  }>('/create-checkout-session', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  }, async (request, reply) => {
    const user = request.user as { userId: string; email: string }
    const { priceId } = request.body

    try {
      // Get or create Stripe customer
      let customer
      const userData = await prisma.user.findUnique({
        where: { id: user.userId },
      })

      if (userData?.stripeCustomerId) {
        customer = await stripe.customers.retrieve(userData.stripeCustomerId)
      } else {
        customer = await stripe.customers.create({
          email: user.email,
        })

        await prisma.user.update({
          where: { id: user.userId },
          data: { stripeCustomerId: customer.id },
        })
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      })

      return { sessionId: session.id }
    } catch (error) {
      console.error('Stripe error:', error)
      return reply.code(500).send({ error: 'Failed to create checkout session' })
    }
  })

  // Webhook endpoint for Stripe events
  fastify.post('/webhook', async (request, reply) => {
    const sig = request.headers['stripe-signature'] as string

    try {
      const event = stripe.webhooks.constructEvent(
        request.rawBody as Buffer,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object as Stripe.Subscription
          
          await prisma.subscription.upsert({
            where: { stripeCustomerId: subscription.customer as string },
            update: {
              status: subscription.status.toUpperCase() as any,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
            create: {
              stripeCustomerId: subscription.customer as string,
              stripePriceId: subscription.items.data[0].price.id,
              status: subscription.status.toUpperCase() as any,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              user: {
                connect: {
                  stripeCustomerId: subscription.customer as string,
                },
              },
            },
          })
          break

        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object as Stripe.Subscription
          
          await prisma.subscription.updateMany({
            where: { stripeCustomerId: deletedSubscription.customer as string },
            data: { status: 'CANCELED' },
          })
          break
      }

      return { received: true }
    } catch (error) {
      console.error('Webhook error:', error)
      return reply.code(400).send({ error: 'Webhook signature verification failed' })
    }
  })
}
