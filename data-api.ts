import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query']})

async function main() {

  prisma.$use(async (params, next) => {
    console.log({ params })
    const result = [
      { foo: 1, email: 'alice@example.org', name: 'Alice' },
      { id: 2, email: 'bob@example.org', name: 'Bob' }
    ]; //
    //await next(params);
    return result;
  })


  const allUsers = await prisma.user.findMany()

  console.log({ allUsers })
  for (const user of allUsers) {
    console.log({ user })
    console.log( 'id', user.id )
  }

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })