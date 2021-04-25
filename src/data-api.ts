import { PrismaClient } from '@prisma/client'
import { DataApi } from './middleware/data-api-middleware';
require('log-timestamp');

const prisma = new PrismaClient({ log: ['query'] })
prisma.$use(
  DataApi({ endpoint: 'http://localhost:3000/api' })
)

async function main() {
 
  await prisma.user.deleteMany({})

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: {
        create: {
          title: 'Watch the talks from Prisma Day 2019',
          content: 'https://www.prisma.io/blog/z11sg6ipb3i1/',
          published: true,
        },
      },
    },
    include: {
      posts: true,
    },
  })

  try {
    const user1_2 = await prisma.user.create({
      data: {
        email: 'alice@prisma.io',
        name: 'Alice',
      },
    })
  } catch (error) {
    if(error.code === 'P2002') {
      console.log('User already exists (as expected)')
    } else {
      throw new Error('bad')
    }
  }

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@prisma.io',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Subscribe to GraphQL Weekly for community news',
            content: 'https://graphqlweekly.com/',
            published: true,
          },
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma/',
            published: false,
          },
        ],
      },
    },
    include: {
      posts: true,
    },
  })
  console.log(
    `Created users: ${user1.name} (${user1.posts.length} post) and ${user2.name} (${user2.posts.length} posts) `,
  )

  // Retrieve all published posts
  const allPosts = await prisma.post.findMany({
    where: { published: true },
  })
  console.log(`Retrieved all published posts: ${allPosts}`)

  // Create a new post (written by an already existing user with email alice@prisma.io)
  const newPost = await prisma.post.create({
    data: {
      title: 'Join the Prisma Slack community',
      content: 'http://slack.prisma.io',
      published: false,
      author: {
        connect: {
          email: 'alice@prisma.io',
        },
      },
    },
  })
  console.log(`Created a new post: ${newPost}`)

  // Publish the new post
  const updatedPost = await prisma.post.update({
    where: {
      id: newPost.id,
    },
    data: {
      published: true,
    },
  })
  console.log(`Published the newly created post: ${updatedPost}`)

  // Retrieve all posts by user with email alice@prisma.io
  const postsByUser = await prisma.user
    .findUnique({
      where: {
        email: 'alice@prisma.io',
      },
    })
    .posts()
  console.log(`Retrieved all posts from a specific user: ${postsByUser}`)

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })