import { PrismaClient } from '@prisma/client'
import { DataApi } from './data-api-middleware';
require('log-timestamp');

const prisma = new PrismaClient({ log: ['query'] })
prisma.$use(
  DataApi({ endpoint: 'http://localhost:3000/api' })
)

async function main() {
  const allUsers = await prisma.user.findMany()
  console.log({ allUsers })
  for (const user of allUsers) {
    console.log({ user })
  }

  const oneUser = await prisma.user.findUnique({ where: { email: 'alice@example.org' } })
  console.log({ oneUser })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })