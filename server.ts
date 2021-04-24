import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
require('log-timestamp');

const prisma = new PrismaClient({ log: ['query']})
const app = express()

app.use(express.json())

prisma.$use(async (params, next) => {
  const real_params = params.args.where.email
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

  const data = await prisma.user.findMany({ where: { email: body }}) // this just uses one random known method, but internally this is rewritten to execute the submitted query

  res.json(data)
})


const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`,
  ),
)