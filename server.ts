import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
require('log-timestamp');

const prisma = new PrismaClient({ log: ['query'] })
const app = express()

app.use(express.json())

// Prisma Middleware that takes parameters "hidden" in $executeRaw query and replaces parameter object with them to execute the real query 
prisma.$use(async (params, next) => {
  if (params.action != 'executeRaw' || params.model != undefined) {
    throw Error('Data API server Prisma instance is limited to using $executeRaw to re-construct actual query')
  }

  const real_params = JSON.parse(params.args.query)
  console.log(`Query: ${real_params.model}.${real_params.action}(${JSON.stringify(real_params.args)})`)

  const result = await next(real_params)
  return result;
})

app.post(`/api`, async (req, res) => {
  console.log('')

  const body = req.body
  console.log('Request:', JSON.stringify(body))

  // TODO somehow check if schema is up to date (this one vs. one in requesting app)

  try {
    // $executeRaw is just used as a "container" to trigger the middleware,
    // which then extracts the actual query and params from the "query" again
    // which receives the payload received via POST here
    const data = await prisma.$executeRaw(JSON.stringify(body))
    return res.json(data)
  } catch (error) {
    console.error({ error })
    return res.status(400).json({ 
      error: JSON.stringify(error), 
      message: JSON.stringify(error.message), 
      type: error.constructor.name,
    });
  }

})


const server = app.listen(3000, () =>
  console.log(`
🚀 Data API listening at: http://localhost:3000/api
Waiting for requests:
`,
  ),
)