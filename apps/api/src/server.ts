import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { helloRoutes } from './routes/hello'
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/users'
import { stripeRoutes } from './routes/stripe'
import { prisma } from './lib/prisma'
import { authPlugin } from './lib/auth'
import fastifyOAuthPlugin from './lib/fastifyOAuth'
import 'dotenv/config'

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
})

// Register CORS
server.register(cors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    process.env.FRONTEND_URL || 'http://localhost:3002'
  ],
  credentials: true,
})

// Register JWT
server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
})

// Register auth plugin
server.register(authPlugin)

// Register OAuth plugin
server.register(fastifyOAuthPlugin)

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
    const port = Number(process.env.PORT) || 3002  // Use 3002 to avoid conflict with web app
    const host = process.env.HOST || '0.0.0.0'
    
    await server.listen({ port, host })
    console.log(`🚀 Server ready at http://${host}:${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
