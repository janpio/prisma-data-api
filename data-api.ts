import { PrismaClient } from '@prisma/client'
const fetch = require('node-fetch');

const prisma = new PrismaClient({ log: ['query']})

async function main() {

  prisma.$use(async (params, next) => {
    console.log({ params })

    const url = 'http://localhost:3000/api'
    const response = await fetch(url);
    const data = await response.json();

    console.log({ data })

    let result = data
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