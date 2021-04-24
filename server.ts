import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
require('log-timestamp');

const prisma = new PrismaClient({ log: ['query']})
const app = express()

app.use(express.json())

prisma.$use(async (params, next) => {
  const body = params.args.where.email
  console.log(`Query: ${body.model}.${body.action}(${ JSON.stringify(body.args) })`)
  // console.log({ params })
  // console.log({ overwritten_params: body })
  // console.log(body.args?.where)
  const result = await next(body)
  // console.log({ result })
  return result;
})

app.post(`/api`, async (req, res) => {
  //const { name, email, posts } = req.body
  const body = req.body
  console.log('')
  console.log('Request:', JSON.stringify(body))



  const data = await prisma.user.findMany({ where: { email: body }}) // this just uses one random known method, but internally this is rewritten to execute the submitted query
//   console.log({ data })

  res.json(data)
})


const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`,
  ),
)