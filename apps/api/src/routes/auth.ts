import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

export async function authRoutes(fastify: FastifyInstance) {
  // Register endpoint
  fastify.post<{
    Body: { email: string; password: string; name?: string }
  }>('/register', async (request, reply) => {
    const { email, password, name } = request.body

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return reply.code(400).send({ error: 'User already exists' })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      })

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user.id, email: user.email })

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      }
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Login endpoint
  fastify.post<{
    Body: { email: string; password: string }
  }>('/login', async (request, reply) => {
    const { email, password } = request.body

    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' })
      }

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user.id, email: user.email })

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      }
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' })
    }
  })
}
