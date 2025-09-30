import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('เริ่มทำการ Seed ข้อมูลตาม SQL dump...');

  // --- 1. สร้าง UserType ---
  await prisma.userType.upsert({ where: { userTypeId: 1 }, update: {}, create: { id: 1, user_typename: 'Staff', userTypeId: 1 } });
  await prisma.userType.upsert({ where: { userTypeId: 2 }, update: {}, create: { id: 2, user_typename: 'ผู้ตรวจสอบ', userTypeId: 2 } });
  await prisma.userType.upsert({ where: { userTypeId: 3 }, update: {}, create: { id: 3, user_typename: 'Teacher', userTypeId: 3 } });
  console.log('สร้าง UserType 3 ประเภทสำเร็จ');

  // --- 2. สร้าง Contributor ---
  const contributor1 = await prisma.contributor.create({ data: { contributor_name: 'Dr. Somchai', academic_title: 'Assoc. Prof.' } });
  const contributor2 = await prisma.contributor.create({ data: { contributor_name: 'Dr. Malee', academic_title: 'Asst. Prof.' } });
  const contributor3 = await prisma.contributor.create({ data: { contributor_name: 'ธนากร ชนะภักดี', academic_title: 'ดร.' } });
  
  // **ส่วนที่แก้ไข!** เอา skipDuplicates ออก
  await prisma.contributor.createMany({
    data: [
      { contributor_name: 'asffasf asfasfasff', academic_title: 'asfasff' },
      { contributor_name: 'fasfas fasfasf', academic_title: 'asfas' },
      { contributor_name: 'saf asf', academic_title: 'asf' },
      { contributor_name: 'asfas asf', academic_title: 'asfas' },
      { contributor_name: 'fdb fdb', academic_title: 'dfbdf' },
      { contributor_name: 'asfasf asfasf', academic_title: 'asfasf' },
      { contributor_name: 'asfasf asfasfsa', academic_title: 'asff' },
      { contributor_name: 'sfasf asfasf', academic_title: 'asfa' },
      { contributor_name: 'asfs fasf', academic_title: 'asffas' },
    ]
  });
  console.log('สร้าง Contributor ทั้งหมดสำเร็จ');
  
  // --- 3. สร้าง UserAuthentication ---
  const user1 = await prisma.userAuthentication.create({ data: { username: 'teacher1', password: 'password123' } });
  const user2 = await prisma.userAuthentication.create({ data: { username: 'staff1', password: 'staffpass' } });
  const user3 = await prisma.userAuthentication.create({ data: { username: 'tanagon', password: '123456' } });
  const user4 = await prisma.userAuthentication.create({ data: { username: 'admin', password: '123456' } });
  console.log('สร้าง UserAuthentication 4 คนสำเร็จ');

  // --- 4. สร้าง Personal Data ---
  await prisma.personal.create({
    data: {
      user: { connect: { id: user1.id } },
      user_name: 'Somchai S',
      user_fame: 'Assoc. Prof.',
      age: 45,
      user_type: { connect: { userTypeId: 3 } },
    },
  });
  await prisma.personal.create({
    data: {
      user: { connect: { id: user2.id } },
      user_name: 'Malee M',
      user_fame: 'Asst. Prof.',
      age: 38,
      user_type: { connect: { userTypeId: 1 } },
    },
  });
  await prisma.personal.create({
    data: {
      user: { connect: { id: user3.id } },
      user_name: 'ธนากร ชนะภักดี',
      user_fame: 'ดร.',
      age: 45,
      email: 'tanagon0402547@gmail.com',
      number_phone: '0862975391',
      academic: 'ดร.',
      faculty: 'วิทยาศาสตร์',
      department: 'วิทยากาารคอมพิวเตอร์',
      user_type: { connect: { userTypeId: 3 } },
    },
  });
  await prisma.personal.create({
    data: {
      user: { connect: { id: user4.id } },
      user_name: 'สมชาย',
      user_fame: 'ใจดี',
      age: 30,
      user_type: { connect: { userTypeId: 2 } },
    },
  });
  console.log('สร้าง Personal Data 4 คนสำเร็จ');
  
  // --- 5. สร้าง Login ---
  // **ส่วนที่แก้ไข!** เอา skipDuplicates ออก
  await prisma.login.createMany({
    data: [
        { userId: user1.id },
        { userId: user2.id },
        { userId: user3.id },
        { userId: user4.id },
    ]
  });
  console.log('สร้างข้อมูล Login สำเร็จ');

  // --- 6. สร้าง ArticleType ---
  await prisma.articleType.create({ data: { article_typename: 'Research Article' } });
  await prisma.articleType.create({ data: { article_typename: 'Review Article' } });
  console.log('สร้าง ArticleType สำเร็จ');

  // --- 7. สร้าง ArticleDB ---
  await prisma.articleDB.create({
    data: {
      article_name: 'Effects of A on B',
      article_file: '/uploads/effects_ab.pdf',
      article_status: 'draft',
      publish_status: 'private',
      published_year: 2023,
      articleType: 'Research Article',
      user: { connect: { id: user1.id } },
      contributor: { connect: { id: contributor1.id } },
    },
  });
  await prisma.articleDB.create({
    data: {
      article_name: 'A review of C techniques',
      article_file: '/uploads/review_c.pdf',
      article_status: 'submitted',
      publish_status: 'public',
      published_year: 2024,
      articleType: 'Review Article',
      user: { connect: { id: user2.id } },
      contributor: { connect: { id: contributor2.id } },
    },
  });
  await prisma.articleDB.create({
    data: {
      article_name: 'ความจริงมีหนึ่งเดียว',
      article_status: 'pending',
      publish_status: 'private',
      published_year: 2025,
      abstract: 'ในโลกที่เต็มไปด้วยข้อมูลข่าวสารที่สับสนวุ่นวาย...',
      user: { connect: { id: user3.id } },
      contributor: { connect: { id: contributor3.id } },
    },
  });
  console.log('สร้าง ArticleDB 3 บทความสำเร็จ');

  console.log('✅ Seed ข้อมูลทั้งหมดสำเร็จแล้วเหมียว!');
}

main()
  .catch((e) => {
    console.error("เกิดข้อผิดพลาดตอน Seed ข้อมูล:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

