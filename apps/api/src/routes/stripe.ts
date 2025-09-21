import { FastifyInstance } from 'fastify'
import Stripe from 'stripe'
import { prisma } from '../lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function stripeRoutes(fastify: FastifyInstance) {
  // Create checkout session
  fastify.post<{
    Body: {
      productId: string
    }
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
    const { productId } = request.body

    try {
      // Get or create Stripe customer
      let customer
      const userData = await prisma.user.findUnique({
        where: { id: user.userId },
      })

      if (userData?.stripeCustomerId) {
        try {
          customer = await stripe.customers.retrieve(userData.stripeCustomerId)
        } catch (error) {
          // If customer doesn't exist in Stripe, create a new one
          console.log('Customer not found in Stripe, creating new one')
          customer = await stripe.customers.create({
            email: user.email,
          })

          await prisma.user.update({
            where: { id: user.userId },
            data: { stripeCustomerId: customer.id },
          })
        }
      } else {
        customer = await stripe.customers.create({
          email: user.email,
        })

        await prisma.user.update({
          where: { id: user.userId },
          data: { stripeCustomerId: customer.id },
        })
      }

      // Get the first price for this product
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
      })

      if (prices.data.length === 0) {
        throw new Error(`No active prices found for product ${productId}`)
      }

      const price = prices.data[0]

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment`,
      })

      return { sessionId: session.id }
    } catch (error) {
      console.error('Stripe error:', error)
      return reply.code(500).send({ error: 'Failed to create checkout session' })
    }
  })

  // Create checkout session for cart products
  fastify.post<{
    Body: {
      items: Array<{
        title: string
        subtitle: string
        price: number
        quantity: number
      }>
    }
  }>('/create-cart-checkout-session', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  }, async (request, reply) => {
    const user = request.user as { userId: string; email: string }
    const { items } = request.body

    try {
      // Get or create Stripe customer
      let customer
      const userData = await prisma.user.findUnique({
        where: { id: user.userId },
      })

      if (userData?.stripeCustomerId) {
        try {
          customer = await stripe.customers.retrieve(userData.stripeCustomerId)
        } catch (error) {
          // If customer doesn't exist in Stripe, create a new one
          console.log('Customer not found in Stripe, creating new one')
          customer = await stripe.customers.create({
            email: user.email,
          })

          await prisma.user.update({
            where: { id: user.userId },
            data: { stripeCustomerId: customer.id },
          })
        }
      } else {
        customer = await stripe.customers.create({
          email: user.email,
        })

        await prisma.user.update({
          where: { id: user.userId },
          data: { stripeCustomerId: customer.id },
        })
      }

      // Transform cart items to Stripe line items
      const lineItems = items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.title,
            description: item.subtitle,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }))

      // Create checkout session for one-time payment
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment', // One-time payment instead of subscription
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
      })

      return { sessionId: session.id }
    } catch (error) {
      console.error('Stripe cart checkout error:', error)
      return reply.code(500).send({ error: 'Failed to create cart checkout session' })
    }
  })

  // Webhook endpoint for Stripe events (simplified for demo)
  fastify.post('/webhook', async (request, reply) => {
    // For production, implement proper webhook signature verification
    // This is a simplified version for demo purposes
    return { received: true, message: 'Webhook endpoint ready' }
  })
}
