import { PrismaClient } from '@prisma/client'
const fetch = require('node-fetch');
require('log-timestamp');

const prisma = new PrismaClient({ log: ['query']})

async function main() {

  prisma.$use(async (params, next) => {
    console.log('')
    console.log('Query:', params)

    const url = 'http://localhost:3000/api'
    const response = await fetch(url, {method:'POST', body: JSON.stringify(params), headers: { 'Content-Type': 'application/json' }});
    const result = await response.json();
    console.log({ result })
    // TODO error handling

    return result;
  })


  const allUsers = await prisma.user.findMany()
  console.log({ allUsers })
  for (const user of allUsers) {
    console.log({ user })
    console.log( 'id', user.id )
  }

  const oneUser = await prisma.user.findUnique({ where: { email: 'alice@example.org' }})
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