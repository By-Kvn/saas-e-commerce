import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import passport from 'passport'
import { helloRoutes } from './routes/hello'
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/users'
import { stripeRoutes } from './routes/stripe'
import { prisma } from './lib/prisma'
import { authPlugin } from './lib/auth'
import { oauthService } from './lib/oauth'
import 'dotenv/config'

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
})

// Register CORS
server.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})

// Register JWT
server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
})

// Register auth plugin
server.register(authPlugin)

// Health check
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Register routes
server.register(helloRoutes, { prefix: '/api' })
server.register(authRoutes, { prefix: '/api/auth' })
server.register(userRoutes, { prefix: '/api/users' })
server.register(stripeRoutes, { prefix: '/api/stripe' })

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  await server.close()
  process.exit(0)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001
    const host = process.env.HOST || '0.0.0.0'
    
    await server.listen({ port, host })
    console.log(`🚀 Server ready at http://${host}:${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
