const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // User types
  const adminType = await prisma.userType.upsert({ where: { id: 1 }, update: {}, create: { user_typename: 'Admin' } })
  const staffType = await prisma.userType.upsert({ where: { id: 2 }, update: {}, create: { user_typename: 'Staff' } })
  const teacherType = await prisma.userType.upsert({ where: { id: 3 }, update: {}, create: { user_typename: 'Teacher' } })

  // Article types
  const researchType = await prisma.articleType.upsert({ where: { id: 1 }, update: {}, create: { article_typename: 'Research Article' } })
  const reviewType = await prisma.articleType.upsert({ where: { id: 2 }, update: {}, create: { article_typename: 'Review Article' } })

  // Contributors
  const contrib1 = await prisma.contributor.upsert({ where: { id: 1 }, update: {}, create: { contributor_name: 'Dr. Somchai', academic_title: 'Assoc. Prof.' } })
  const contrib2 = await prisma.contributor.upsert({ where: { id: 2 }, update: {}, create: { contributor_name: 'Dr. Malee', academic_title: 'Asst. Prof.' } })

  // Users (auth + personal + login)
  const user1 = await prisma.userAuthentication.upsert({
    where: { username: 'teacher1' },
    update: {},
    create: {
      username: 'teacher1',
      password: 'pass123',
      login: { create: { age: 45 } },
      personal: { create: { user_name: 'Somchai S', user_fame: 'Assoc. Prof.', userTypeId: teacherType.id } }
    }
  })

  const user2 = await prisma.userAuthentication.upsert({
    where: { username: 'staff1' },
    update: {},
    create: {
      username: 'staff1',
      password: 'staffpass',
      login: { create: { age: 38 } },
      personal: { create: { user_name: 'Malee M', user_fame: 'Asst. Prof.', userTypeId: staffType.id } }
    }
  })

  // Articles
  const article1 = await prisma.articleDB.upsert({
    where: { id: 1 },
    update: {},
    create: {
      article_name: 'Effects of A on B',
      article_file: '/uploads/effects_ab.pdf',
      article_status: 'draft',
      publish_status: 'private',
      published_year: 2023,
      articleTypeId: researchType.id,
      contributorId: contrib1.id,
      categories: { create: [{ summary: 'Short summary of Effects of A on B' }] },
      statusHistory: { create: [{ article_status: 'created' }] }
    }
  })

  const article2 = await prisma.articleDB.upsert({
    where: { id: 2 },
    update: {},
    create: {
      article_name: 'A review of C techniques',
      article_file: '/uploads/review_c.pdf',
      article_status: 'submitted',
      publish_status: 'public',
      published_year: 2024,
      articleTypeId: reviewType.id,
      contributorId: contrib2.id,
      categories: { create: [{ summary: 'Review abstract for C techniques' }] },
      statusHistory: { create: [{ article_status: 'submitted' }] }
    }
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
