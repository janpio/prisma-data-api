import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get(`/api`, async (req, res) => {
  //const { name, email, posts } = req.body
  console.log('incoming request:', req.body)

  const allUsers = await prisma.user.findMany()
  console.log({ allUsers })

  res.json(allUsers)
})


const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`,
  ),
)