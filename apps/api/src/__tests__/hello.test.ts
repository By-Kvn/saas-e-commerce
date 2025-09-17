import { build } from '../server'
import request from 'supertest'

describe('Hello API Routes', () => {
  let app: any

  beforeAll(async () => {
    app = await build()
  })

  afterAll(async () => {
    await app.close()
  })

  test('GET /api/hello should return success message', async () => {
    const response = await request(app.server)
      .get('/api/hello')
      .expect(200)

    expect(response.body).toEqual({
      message: 'Hello from Fastify API! 🚀',
      timestamp: expect.any(String),
      status: 'success'
    })
  })

  test('POST /api/hello should return personalized message', async () => {
    const response = await request(app.server)
      .post('/api/hello')
      .send({ name: 'Test User' })
      .expect(200)

    expect(response.body).toEqual({
      message: 'Hello Test User! Welcome to the SaaS API! 🎉',
      timestamp: expect.any(String),
      status: 'success'
    })
  })
})
