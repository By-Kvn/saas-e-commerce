import { FastifyInstance } from 'fastify'
import { ApiResponse } from '@saas/types'

export async function helloRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Reply: ApiResponse
  }>('/hello', async (request, reply) => {
    return {
      message: 'Hello from Fastify API! 🚀',
      timestamp: new Date().toISOString(),
      status: 'success'
    }
  })

  fastify.post<{
    Body: { name: string }
    Reply: ApiResponse
  }>('/hello', async (request, reply) => {
    const { name } = request.body
    
    return {
      message: `Hello ${name}! Welcome to the SaaS API! 🎉`,
      timestamp: new Date().toISOString(),
      status: 'success'
    }
  })
}
