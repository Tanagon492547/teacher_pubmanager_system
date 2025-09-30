import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

// ปรับค่าจำนวนข้อมูลได้ผ่าน ENV ตอนรัน เช่น SEED_USERS=100 SEED_ARTICLES=500 node prisma/seed.js
const USER_EXTRA_COUNT = parseInt(process.env.SEED_USERS || '50', 10);       // จำนวน user เพิ่ม (ไม่นับ 4 คนหลัก)
const CONTRIBUTOR_EXTRA_COUNT = parseInt(process.env.SEED_CONTRIB || '30', 10);
const MAX_ARTICLES_PER_TEACHER = parseInt(process.env.SEED_ART_MAX || '6', 10);
const MIN_ARTICLES_PER_TEACHER = parseInt(process.env.SEED_ART_MIN || '2', 10);

faker.locale = 'th';

const prisma = new PrismaClient();

async function ensureUserTypes() {
  await prisma.userType.upsert({ where: { userTypeId: 1 }, update: {}, create: { id: 1, user_typename: 'Admin', userTypeId: 1 } });
  await prisma.userType.upsert({ where: { userTypeId: 2 }, update: {}, create: { id: 2, user_typename: 'Staff', userTypeId: 2 } });
  await prisma.userType.upsert({ where: { userTypeId: 3 }, update: {}, create: { id: 3, user_typename: 'Teacher', userTypeId: 3 } });
}

async function seedBaseContributors() {
  const c1 = await prisma.contributor.create({ data: { contributor_name: 'Dr. Somchai', academic_title: 'Assoc. Prof.' } });
  const c2 = await prisma.contributor.create({ data: { contributor_name: 'Dr. Malee', academic_title: 'Asst. Prof.' } });
  const c3 = await prisma.contributor.create({ data: { contributor_name: 'ธนากร ชนะภักดี', academic_title: 'ดร.' } });

  // เพิ่มแบบสุ่ม
  const extra = Array.from({ length: CONTRIBUTOR_EXTRA_COUNT }).map(() => ({
    contributor_name: faker.person.fullName(),
    academic_title: faker.helpers.arrayElement(['ดร.', 'ผศ.', 'รศ.', 'ศ.'])
  }));
  if (extra.length) await prisma.contributor.createMany({ data: extra });
  return [c1, c2, c3];
}

async function seedBaseUsers() {
  const user1 = await prisma.userAuthentication.upsert({ where: { username: 'teacher1' }, update: {}, create: { username: 'teacher1', password: 'password123' } });
  const user2 = await prisma.userAuthentication.upsert({ where: { username: 'staff1' }, update: {}, create: { username: 'staff1', password: 'staffpass' } });
  const user3 = await prisma.userAuthentication.upsert({ where: { username: 'tanagon' }, update: {}, create: { username: 'tanagon', password: '123456' } });
  const user4 = await prisma.userAuthentication.upsert({ where: { username: 'admin' }, update: {}, create: { username: 'admin', password: '123456' } });
  return { user1, user2, user3, user4 };
}

async function seedExtraUsers() {
  const users = [];
  for (let i = 0; i < USER_EXTRA_COUNT; i++) {
    const uname = `teacher_auto_${i + 1}`; // ให้ predictable ชัดเจน
    const u = await prisma.userAuthentication.create({
      data: { username: uname, password: 'pass1234' }
    });
    users.push(u);
  }
  return users;
}

async function seedPersonals(baseUsers, extraUsers) {
  const faculties = ['วิทยาศาสตร์', 'วิศวกรรมศาสตร์', 'สาธารณสุข', 'บริหารธุรกิจ', 'เทคโนโลยีสารสนเทศ'];
  const departments = ['คอมพิวเตอร์', 'เคมี', 'ชีววิทยา', 'ไฟฟ้า', 'เครื่องกล', 'ซอฟต์แวร์'];

  const personalOps = [];
  // base
  personalOps.push(prisma.personal.upsert({
    where: { userId: baseUsers.user1.id }, update: {}, create: { user: { connect: { id: baseUsers.user1.id } }, user_name: 'Somchai S', user_fame: 'Assoc. Prof.', age: 45, user_type: { connect: { userTypeId: 3 } } }
  }));
  personalOps.push(prisma.personal.upsert({
    where: { userId: baseUsers.user2.id }, update: {}, create: { user: { connect: { id: baseUsers.user2.id } }, user_name: 'Malee M', user_fame: 'Asst. Prof.', age: 38, user_type: { connect: { userTypeId: 2 } } }
  }));
  personalOps.push(prisma.personal.upsert({
    where: { userId: baseUsers.user3.id }, update: {}, create: { user: { connect: { id: baseUsers.user3.id } }, user_name: 'ธนากร ชนะภักดี', user_fame: 'ดร.', age: 45, email: 'tanagon0402547@gmail.com', number_phone: '0862975391', academic: 'ดร.', faculty: 'วิทยาศาสตร์', department: 'วิทยากาารคอมพิวเตอร์', user_type: { connect: { userTypeId: 3 } } }
  }));
  personalOps.push(prisma.personal.upsert({
    where: { userId: baseUsers.user4.id }, update: {}, create: { user: { connect: { id: baseUsers.user4.id } }, user_name: 'สมชาย', user_fame: 'ใจดี', age: 30, user_type: { connect: { userTypeId: 1 } } }
  }));

  // extra all -> Teacher (userTypeId:3)
  for (const u of extraUsers) {
    personalOps.push(prisma.personal.create({
      data: {
        user: { connect: { id: u.id } },
        user_name: faker.person.firstName() + ' ' + faker.person.lastName(),
        user_fame: faker.helpers.arrayElement(['ดร.', 'ผศ.', 'รศ.', 'อ.', 'คุณ']) ,
        age: faker.number.int({ min: 25, max: 65 }),
        email: faker.internet.email(),
        number_phone: faker.phone.number('08########'),
        academic: faker.helpers.arrayElement(['ปริญญาเอก', 'ปริญญาโท', 'ปริญญาตรี']),
        faculty: faker.helpers.arrayElement(faculties),
        department: faker.helpers.arrayElement(departments),
        user_type: { connect: { userTypeId: 3 } }
      }
    }));
  }
  await Promise.all(personalOps);
}

async function seedLogins(allUsers) {
  await Promise.all(allUsers.map(u => prisma.login.upsert({ where: { userId: u.id }, update: {}, create: { userId: u.id } })));
}

async function seedArticleTypes() {
  // ใช้ try/catch กัน duplicate เผื่อรันซ้ำ (ไม่มี unique constraint นอกจาก PK)
  const existing = await prisma.articleType.findMany();
  if (!existing.find(e => e.article_typename === 'Research Article')) {
    await prisma.articleType.create({ data: { article_typename: 'Research Article' } });
  }
  if (!existing.find(e => e.article_typename === 'Review Article')) {
    await prisma.articleType.create({ data: { article_typename: 'Review Article' } });
  }
}

function buildStatusHistoryChain(reviewerPoolIds) {
  const chains = [
    ['draft','submitted','pending','approved','published'],
    ['draft','submitted','pending','rejected'],
    ['draft','submitted','pending'],
  ];
  const chain = faker.helpers.arrayElement(chains);
  const baseDate = faker.date.past({ years: 2 });
  return chain.map((status, idx) => ({
    article_status: status,
    save_history: new Date(baseDate.getTime() + idx * 1000 * 60 * 60 * 24 * faker.number.int({min:1,max:5})),
    reviewerId: idx === 0 ? null : faker.helpers.arrayElement(reviewerPoolIds),
    reviewerNote: idx > 1 && faker.datatype.boolean() ? faker.lorem.sentence() : null
  }));
}

async function seedArticles(allUsers) {
  const teachers = await prisma.personal.findMany({
    where: { userTypeId: 3 },
    select: { userId: true }
  });
  const reviewerUsers = await prisma.personal.findMany({
    where: { OR: [ { userTypeId: 1 }, { userTypeId: 2 } ] },
    select: { userId: true }
  });
  const reviewerIds = reviewerUsers.map(r => r.userId);

  const contributors = await prisma.contributor.findMany({ select: { id: true } });
  const totalArticles = [];

  for (const t of teachers) {
    const count = faker.number.int({ min: MIN_ARTICLES_PER_TEACHER, max: MAX_ARTICLES_PER_TEACHER });
    for (let i = 0; i < count; i++) {
      const articleType = faker.helpers.arrayElement(['Research Article','Review Article']);
      const year = faker.number.int({ min: 2018, max: 2025 });
      const statusHistoryData = buildStatusHistoryChain(reviewerIds);
      const currentStatus = statusHistoryData[statusHistoryData.length - 1].article_status;
      const publishStatus = currentStatus === 'published' ? 'public' : faker.helpers.arrayElement(['private','draft']);
      const categoryCount = faker.number.int({min:1,max:3});
      const categoriesCreate = Array.from({length: categoryCount}).map(() => ({ summary: faker.lorem.words({min:2,max:5}) }));
      totalArticles.push(prisma.articleDB.create({
        data: {
          article_name: faker.lorem.sentence({ min: 3, max: 8 }).replace(/\.$/, ''),
          article_file: faker.datatype.boolean() ? `/uploads/${faker.string.alphanumeric(8)}.pdf` : null,
            article_status: currentStatus,
          publish_status: publishStatus,
          published_year: year,
          articleType,
          abstract: faker.lorem.paragraph(),
          user: { connect: { id: t.userId } },
          contributor: { connect: { id: faker.helpers.arrayElement(contributors).id } },
          statusHistory: { create: statusHistoryData.map(s => ({ article_status: s.article_status, save_history: s.save_history, reviewerId: s.reviewerId, reviewerNote: s.reviewerNote })) },
          categories: { create: categoriesCreate }
        }
      }));
    }
  }

  // รันแบบ batch (Promise.all) ทีละก้อนลด memory explosion
  const chunkSize = 50;
  for (let i = 0; i < totalArticles.length; i += chunkSize) {
    const slice = totalArticles.slice(i, i + chunkSize);
    await Promise.all(slice);
    console.log(`  -> สร้างบทความแล้ว ${Math.min(i + slice.length, totalArticles.length)} / ${totalArticles.length}`);
  }
  return totalArticles.length;
}

async function main() {
  console.log('🚀 เริ่ม Seed ข้อมูล Mock จำนวนมาก...');

  await ensureUserTypes();
  console.log('✔ UserType พร้อม');

  const baseContrib = await seedBaseContributors();
  console.log(`✔ Contributor base + extra รวมแล้ว ~${3 + CONTRIBUTOR_EXTRA_COUNT} รายการ`);

  const baseUsers = await seedBaseUsers();
  const extraUsers = await seedExtraUsers();
  console.log(`✔ Users สร้างแล้ว (base 4 + extra ${extraUsers.length}) = ${4 + extraUsers.length}`);

  await seedPersonals(baseUsers, extraUsers);
  console.log('✔ Personal ครบ');

  await seedLogins([baseUsers.user1, baseUsers.user2, baseUsers.user3, baseUsers.user4, ...extraUsers]);
  console.log('✔ Login ครบ');

  await seedArticleTypes();
  console.log('✔ ArticleType ครบ');

  const articleCount = await seedArticles([baseUsers.user1, baseUsers.user2, baseUsers.user3, baseUsers.user4, ...extraUsers]);
  console.log(`✔ สร้างบทความสุ่มแล้ว ${articleCount} รายการ`);

  // ตัวอย่างบทความเดิม (คงไว้ให้แน่ใจว่ามี reference ตามที่เคยใช้) - จะสร้างเฉพาะถ้ายังไม่มีชื่อซ้ำ
  const existingSample = await prisma.articleDB.findFirst({ where: { article_name: 'Effects of A on B' } });
  if (!existingSample) {
    await prisma.articleDB.create({
      data: {
        article_name: 'Effects of A on B',
        article_file: '/uploads/effects_ab.pdf',
        article_status: 'draft',
        publish_status: 'private',
        published_year: 2023,
        articleType: 'Research Article',
        user: { connect: { id: baseUsers.user1.id } },
        contributor: { connect: { id: baseContrib[0].id } },
      },
    });
  }

  console.log('✅ เสร็จสิ้นการ Seed ข้อมูล Mock แล้ว!');
  console.log('สรุปโดยย่อ:');
  const counts = await Promise.all([
    prisma.userAuthentication.count(),
    prisma.personal.count(),
    prisma.contributor.count(),
    prisma.articleDB.count(),
    prisma.articleStatusHistory.count(),
    prisma.category.count()
  ]);
  console.log(`  Users: ${counts[0]} | Personals: ${counts[1]} | Contributors: ${counts[2]}`);
  console.log(`  Articles: ${counts[3]} | StatusHistory: ${counts[4]} | Categories: ${counts[5]}`);
}

main().catch(e => {
  console.error('เกิดข้อผิดพลาดตอน Seed:', e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

