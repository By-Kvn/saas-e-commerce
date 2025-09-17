import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from './prisma'

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string
  emailVerified: boolean
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return reply.code(401).send({ error: 'Token d\'authentification requis' })
    }

    // Verify JWT token
    const decoded = request.server.jwt.verify(token) as { userId: string; email: string }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
      },
    })

    if (!user) {
      return reply.code(401).send({ error: 'Token invalide' })
    }

    // Attach user to request
    ;(request as any).currentUser = user
  } catch (error) {
    return reply.code(401).send({ error: 'Token invalide' })
  }
}

export async function requireEmailVerification(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).currentUser as AuthenticatedUser
  if (!user?.emailVerified) {
    return reply.code(403).send({ 
      error: 'Email non vérifié',
      message: 'Veuillez vérifier votre adresse email avant de continuer'
    })
  }
}

// Helper to register auth middleware plugin
export async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate('authenticate', authMiddleware)
  fastify.decorate('requireEmailVerification', requireEmailVerification)
}
