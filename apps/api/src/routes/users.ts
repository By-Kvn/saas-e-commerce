import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function userRoutes(fastify: FastifyInstance) {
  // Get current user profile
  fastify.get('/me', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  }, async (request, reply) => {
    const user = request.user as { userId: string; email: string }

    try {
      const userData = await prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          stripeCustomerId: true,
        },
      })

      if (!userData) {
        return reply.code(404).send({ error: 'User not found' })
      }

      return userData
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Update user profile
  fastify.put<{
    Body: { name?: string }
  }>('/me', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  }, async (request, reply) => {
    const user = request.user as { userId: string; email: string }
    const { name } = request.body

    try {
      const updatedUser = await prisma.user.update({
        where: { id: user.userId },
        data: { name },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      })

      return updatedUser
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' })
    }
  })
}
