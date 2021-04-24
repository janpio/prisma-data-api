import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
require('log-timestamp');

const prisma = new PrismaClient({ log: ['query']})
const app = express()

app.use(express.json())

// Prisma Middleware that takes parameters hidden in where.email and replaces parameter object with them to execute the real query 
prisma.$use(async (params, next) => {
  const real_params = JSON.parse(params.args.query)
  console.log(`Query: ${real_params.model}.${real_params.action}(${ JSON.stringify(real_params.args) })`)

  // console.log({ params })
  // console.log({ overwritten_params: body })

  const result = await next(real_params)
  return result;
})

app.post(`/api`, async (req, res) => {
  console.log('')

  const body = req.body
  console.log('Request:', JSON.stringify(body))

  // TODO somehow check if schema is up to date (this one vs. one in requesting app)

  // this just uses one random known query method, but is rewritten to execute the real query via the Middleware
  // the query (received via POS) is submitted via where.email 
  //const data = await prisma.user.findMany({ where: { email: body }}) 
  let data
  try {
    data = await prisma.$executeRaw(JSON.stringify(body))
  } catch (error) {
    data = error
  }

  res.json(data)
})


const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
Waiting for requests:
`,
  ),
)