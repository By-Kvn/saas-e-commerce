import { prisma } from '../lib/prisma'

beforeAll(async () => {
  // Setup test database
})

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect()
})

beforeEach(async () => {
  // Clean database before each test
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`)
      } catch (error) {
        console.log({ error })
      }
    }
  }
})
