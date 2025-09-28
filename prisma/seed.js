import { PrismaClient } from '@prisma/client';
// **หมายเหตุ:** ในแอปจริง เราควรจะเข้ารหัสรหัสผ่านเสมอนะเหมียว!
// import bcrypt from 'bcrypt'; 
const prisma = new PrismaClient();

async function main() {
  console.log('เริ่มทำการ Seed ข้อมูลตาม SQL dump ฉบับสมบูรณ์...');

  // --- 1. สร้าง UserType ---
  // ใช้ upsert เพื่อป้องกันการสร้างซ้ำ
  await prisma.userType.upsert({ where: { userTypeId: 1 }, update: {}, create: { id: 1, user_typename: 'Staff', userTypeId: 1 } });
  await prisma.userType.upsert({ where: { userTypeId: 2 }, update: {}, create: { id: 2, user_typename: 'admin', userTypeId: 2 } });
  await prisma.userType.upsert({ where: { userTypeId: 3 }, update: {}, create: { id: 3, user_typename: 'Teacher', userTypeId: 3 } });
  console.log('สร้าง UserType 3 ประเภทสำเร็จ');

  // --- 2. สร้าง Contributor ทั้งหมด ---
  // ใช้ createMany เพื่อความรวดเร็ว
  await prisma.contributor.createMany({
    data: [
      { id: 1, contributor_name: 'Dr. Somchai', academic_title: 'Assoc. Prof.' },
      { id: 2, contributor_name: 'Dr. Malee', academic_title: 'Asst. Prof.' },
      { id: 3, contributor_name: 'ธนากร ชนะภักดี', academic_title: 'ดร.' },
      { id: 4, contributor_name: 'asffasf asfasfasff', academic_title: 'asfasff' },
      { id: 5, contributor_name: 'fasfas fasfasf', academic_title: 'asfas' },
      { id: 6, contributor_name: 'saf asf', academic_title: 'asf' },
      { id: 7, contributor_name: 'asfas asf', academic_title: 'asfas' },
      { id: 8, contributor_name: 'fdb fdb', academic_title: 'dfbdf' },
      { id: 9, contributor_name: 'asfasf asfasf', academic_title: 'asfasf' },
      { id: 10, contributor_name: 'asfasf asfasfsa', academic_title: 'asff' },
      { id: 11, contributor_name: 'sfasf asfasf', academic_title: 'asfa' },
      { id: 12, contributor_name: 'asfs fasf', academic_title: 'asffas' },
      { id: 13, contributor_name: 'null null', academic_title: null },
      { id: 14, contributor_name: 'ธนา จริงโจ้', academic_title: 'ดร' },
      { id: 15, contributor_name: 'ธนากร asf', academic_title: 'ดร.' },
    ],
    skipDuplicates: true,
  });
  console.log('สร้าง Contributor ทั้งหมด 15 คนสำเร็จ');
  
  // --- 3. สร้าง UserAuthentication ทั้งหมด ---
  await prisma.userAuthentication.createMany({
    data: [
        { id: 1, username: 'teacher1', password: 'password123' },
        { id: 2, username: 'staff1', password: 'staffpass' },
        { id: 3, username: 'tanagon', password: '123456' },
        { id: 4, username: 'admin', password: '123456' },
        { id: 5, username: '6610210151', password: '123456789' },
    ],
    skipDuplicates: true,
  });
  console.log('สร้าง UserAuthentication 5 คนสำเร็จ');

  // --- 4. สร้าง Personal Data ---
  await prisma.personal.createMany({
    data: [
      { userId: 1, user_name: 'Somchai S', user_fame: 'Assoc. Prof.', age: 45, userTypeId: 3 },
      { userId: 2, user_name: 'Malee M', user_fame: 'Asst. Prof.', age: 38, userTypeId: 1 },
      { userId: 3, user_name: 'ธนากร ชนะภักดี', user_fame: 'ดร.', age: 45, email: 'tanagon0402547@gmail.com', number_phone: '0862975391', academic: 'ดร.', faculty: 'วิทยาศาสตร์', department: 'วิทยากาารคอมพิวเตอร์', userTypeId: 3 },
      { userId: 4, user_name: 'admin', user_fame: '888', age: 325, userTypeId: 2 },
      { userId: 5, user_name: 'ธนากร ชนะภักดี์', user_fame: 'นาย', age: 39, userTypeId: 1 },
    ],
    skipDuplicates: true,
  });
  console.log('สร้าง Personal Data 5 คนสำเร็จ');
  
  // --- 5. สร้าง Login ---
  await prisma.login.createMany({
    data: [
        { userId: 1 }, { userId: 2 }, { userId: 3 }, { userId: 4 },
    ],
    skipDuplicates: true
  });
  console.log('สร้างข้อมูล Login 4 รายการสำเร็จ');

  // --- 6. สร้าง ArticleType ---
  await prisma.articleType.createMany({
    data: [
      { id: 1, article_typename: 'Research Article' },
      { id: 2, article_typename: 'Review Article' },
    ],
    skipDuplicates: true,
  });
  console.log('สร้าง ArticleType สำเร็จ');

  // --- 7. สร้าง ArticleDB ---
  await prisma.articleDB.createMany({
    data: [
      { id: 1, article_name: 'Effects of A on B', article_file: '/uploads/effects_ab.pdf', article_status: 'approved', publish_status: 'private', published_year: 2023, articleType: 'Research Article', contributorId: 1, abstract: 'แสงสุดท้ายของวันอาทิตย์กำลังจะลับขอบฟ้า แต่หน้าจอคอมพิวเตอร์ของเอเธนส์ยังคงสว่างไสว กองหนังสืออ้างอิงและไฟล์ PDF ที่ดาวน์โหลดมากว่าสิบไฟล์วางระเกะระกะ "เหลือเวลาอีกแค่สัปดาห์เดียว... แต่เรายังหาบทความหลักสำหรับโปรเจกต์ไม่ได้เลย" เอเธนส์พึมพำกับตัวเอง การค้นหาทั่วไปให้ผลลัพธ์ที่กว้างเกินไป เหมือนงมเข็มในมหาสมุทรข้อมูล จนกระทั่งเอเธนส์ได้เจอกับระบบค้นหาของมหาวิทยาลัยเวอร์ชันใหม่ หน้าตาของมันสะอาดและดูเป็นทางการ ไม่เหมือนระบบเก่าที่เคยใช้ ตรงหน้าคือ "ตัวกรองการค้นหาขั้นสูง" ที่ดูเหมือนจะเข้าใจความต้องการของเขา เอเธนส์เริ่มกรอก "คำค้นหา" ที่เฉพาะเจาะจงลงไปในช่องแรกที่มีไอคอนรูปแว่นขยายสวยงาม "AI and education technology" เขาพิมพ์ลงไปอย่างมีความหวัง ถัดมาคือ "ปีที่ตีพิมพ์" เอเธนส์จำได้ว่าอาจารย์แนะนำให้ใช้เปเปอร์ที่ไม่เก่าเกินไป เขาจึงใส่ช่วงปี "2022" ถึง "2025" ลงไปในช่อง "เริ่มต้น" และ "สิ้นสุด" "ประเภทผลงาน" คือตัวเลือกถัดไป เอเธนส์ต้องการงานวิจัยที่น่าเชื่อถือ เขาจึงเลือก "บทความวิจัย (Research)" จากในลิสต์ "ตำแหน่งทางวิชาการ" ก็เป็นตัวกรองที่น่าสนใจ เขาอยากได้งานของนักวิชาการที่มีชื่อเสียง เอเธนส์ลองเลือก "ศาสตราจารย์" ดู ด้านขวามี "ตัวกรองด่วน" ที่ดูน่าใช้ แต่เขายังอยากจะเจาะจงด้วยตัวเองก่อน ทุกอย่างดูพร้อมแล้ว... หัวใจของเขาเต้นแรงขึ้นเล็กน้อย เอเธนส์เลื่อนเมาส์ไปที่ปุ่มสีน้ำเงินเข้มทางด้านขวาล่างของฟอร์ม ปุ่มที่มีไอคอนแว่นขยายและคำว่า "ค้นหา" คลิก! หน้าเว็บไม่ได้รีเฟรชทั้งหมด แต่รายการผลลัพธ์ด้านล่างเปลี่ยนแปลงไปอย่างรวดเร็ว บทความสิบกว่ารายการปรากฏขึ้นมา แต่มีอยู่หนึ่งรายการที่ทำให้เอเธนส์ตาโต "The Synergy of AI Tutors and Modern Pedagogy" โดยศาสตราจารย์ท่านหนึ่งที่เขาติดตามอยู่ มันตรงกับหัวข้อโปรเจกต์ของเขาเป๊ะๆ! เขากดเข้าไปดูรายละเอียดทันที บทคัดย่อยืนยันว่านี่คือสิ่งที่เขาตามหามาตลอดหลายสัปดาห์ เอเธนส์กดดาวน์โหลดไฟล์ PDF นั้นมาเก็บไว้ด้วยความรู้สึกโล่งใจอย่างบอกไม่ถูก ฟอร์มค้นหาที่ออกแบบมาอย่างดีนี้ ไม่ใช่แค่เครื่องมือ... แต่มันคือสะพานที่เชื่อมโยงความพยายามของเขากับองค์ความรู้ที่ใช่ เอเธนส์ยิ้มออกมาได้เป็นครั้งแรกในรอบหลายชั่วโมง "เอาล่ะ... มาเริ่มเขียนโปรเจกต์ของเรากันเถอะ!"', userId: 1 },
      { id: 2, article_name: 'A review of C techniques', article_file: '/uploads/review_c.pdf', article_status: 'approved', publish_status: 'public', published_year: 2024, articleType: 'Review Article', contributorId: 2, userId: 2 },
      { id: 3, article_name: 'ความจริงมีหนึ่งเดียว', article_status: 'pending', publish_status: 'private', published_year: 2025, articleType: 'บทความวิจัย ระดับประเทศ', contributorId: 13, abstract: 'ในโลกที่เต็มไปด้วยข้อมูลข่าวสารที่สับสนวุ่นวาย...', userId: 3 },
      { id: 4, article_name: 'ผู้เข้าหาย', article_file: '/file/pdf/4.pdf', article_status: 'approved', publish_status: 'public', published_year: 2025, articleType: 'บทความประชุมวิชาการ ระดับสากล', contributorId: 14, abstract: 'ผมเหนืื่อยยยยย\n\n', userId: 3 },
      { id: 5, article_name: 'asfasfasf', article_status: 'pending', publish_status: 'private', published_year: 2025, articleType: 'other', contributorId: 15, abstract: '784748787487478447', userId: 3 },
    ],
    skipDuplicates: true,
  });
  console.log('สร้าง ArticleDB 5 บทความสำเร็จ');

  // --- 8. สร้าง Category ---
  await prisma.category.createMany({
    data: [ { articleId: 3, summary: 'ประเภทไม่มี' } ],
    skipDuplicates: true,
  });
  console.log('สร้าง Category สำเร็จ');

  // --- 9. สร้าง ArticleStatusHistory ---
  await prisma.articleStatusHistory.createMany({
    data: [
      { articleId: 2, article_status: 'approved' },
      { articleId: 1, article_status: 'approved' },
      { articleId: 3, article_status: 'revision' },
      { articleId: 4, article_status: 'approved' },
    ],
    skipDuplicates: true,
  });
  console.log('สร้าง ArticleStatusHistory สำเร็จ (ข้ามข้อมูลซ้ำ)');


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





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   console.log('เริ่มทำการ Seed ข้อมูลตาม SQL dump...');

//   // --- 1. สร้าง UserType ---
//   await prisma.userType.upsert({ where: { userTypeId: 1 }, update: {}, create: { id: 1, user_typename: 'Staff', userTypeId: 1 } });
//   await prisma.userType.upsert({ where: { userTypeId: 2 }, update: {}, create: { id: 2, user_typename: 'admin', userTypeId: 2 } });
//   await prisma.userType.upsert({ where: { userTypeId: 3 }, update: {}, create: { id: 3, user_typename: 'Teacher', userTypeId: 3 } });
//   console.log('สร้าง UserType 3 ประเภทสำเร็จ');

//   // --- 2. สร้าง Contributor ---
//   const contributor1 = await prisma.contributor.create({ data: { contributor_name: 'Dr. Somchai', academic_title: 'Assoc. Prof.' } });
//   const contributor2 = await prisma.contributor.create({ data: { contributor_name: 'Dr. Malee', academic_title: 'Asst. Prof.' } });
//   const contributor3 = await prisma.contributor.create({ data: { contributor_name: 'ธนากร ชนะภักดี', academic_title: 'ดร.' } });
  
//   // **ส่วนที่แก้ไข!** เอา skipDuplicates ออก
//   await prisma.contributor.createMany({
//     data: [
//       { contributor_name: 'asffasf asfasfasff', academic_title: 'asfasff' },
//       { contributor_name: 'fasfas fasfasf', academic_title: 'asfas' },
//       { contributor_name: 'saf asf', academic_title: 'asf' },
//       { contributor_name: 'asfas asf', academic_title: 'asfas' },
//       { contributor_name: 'fdb fdb', academic_title: 'dfbdf' },
//       { contributor_name: 'asfasf asfasf', academic_title: 'asfasf' },
//       { contributor_name: 'asfasf asfasfsa', academic_title: 'asff' },
//       { contributor_name: 'sfasf asfasf', academic_title: 'asfa' },
//       { contributor_name: 'asfs fasf', academic_title: 'asffas' },
//     ]
//   });
//   console.log('สร้าง Contributor ทั้งหมดสำเร็จ');
  
//   // --- 3. สร้าง UserAuthentication ---
//   const user1 = await prisma.userAuthentication.create({ data: { username: 'teacher1', password: 'password123' } });
//   const user2 = await prisma.userAuthentication.create({ data: { username: 'staff1', password: 'staffpass' } });
//   const user3 = await prisma.userAuthentication.create({ data: { username: 'tanagon', password: '123456' } });
//   const user4 = await prisma.userAuthentication.create({ data: { username: 'admin', password: '123456' } });
//   console.log('สร้าง UserAuthentication 4 คนสำเร็จ');

//   // --- 4. สร้าง Personal Data ---
//   await prisma.personal.create({
//     data: {
//       user: { connect: { id: user1.id } },
//       user_name: 'Somchai S',
//       user_fame: 'Assoc. Prof.',
//       age: 45,
//       user_type: { connect: { userTypeId: 3 } },
//     },
//   });
//   await prisma.personal.create({
//     data: {
//       user: { connect: { id: user2.id } },
//       user_name: 'Malee M',
//       user_fame: 'Asst. Prof.',
//       age: 38,
//       user_type: { connect: { userTypeId: 1 } },
//     },
//   });
//   await prisma.personal.create({
//     data: {
//       user: { connect: { id: user3.id } },
//       user_name: 'ธนากร ชนะภักดี',
//       user_fame: 'ดร.',
//       age: 45,
//       email: 'tanagon0402547@gmail.com',
//       number_phone: '0862975391',
//       academic: 'ดร.',
//       faculty: 'วิทยาศาสตร์',
//       department: 'วิทยากาารคอมพิวเตอร์',
//       user_type: { connect: { userTypeId: 3 } },
//     },
//   });
//   await prisma.personal.create({
//     data: {
//       user: { connect: { id: user4.id } },
//       user_name: 'admin',
//       user_fame: '888',
//       age: 325,
//       user_type: { connect: { userTypeId: 2 } },
//     },
//   });
//   console.log('สร้าง Personal Data 4 คนสำเร็จ');
  
//   // --- 5. สร้าง Login ---
//   // **ส่วนที่แก้ไข!** เอา skipDuplicates ออก
//   await prisma.login.createMany({
//     data: [
//         { userId: user1.id },
//         { userId: user2.id },
//         { userId: user3.id },
//         { userId: user4.id },
//     ]
//   });
//   console.log('สร้างข้อมูล Login สำเร็จ');

//   // --- 6. สร้าง ArticleType ---
//   await prisma.articleType.create({ data: { article_typename: 'Research Article' } });
//   await prisma.articleType.create({ data: { article_typename: 'Review Article' } });
//   console.log('สร้าง ArticleType สำเร็จ');

//   // --- 7. สร้าง ArticleDB ---
//   await prisma.articleDB.create({
//     data: {
//       article_name: 'Effects of A on B',
//       article_file: '/uploads/effects_ab.pdf',
//       article_status: 'draft',
//       publish_status: 'private',
//       published_year: 2023,
//       articleType: 'Research Article',
//       user: { connect: { id: user1.id } },
//       contributor: { connect: { id: contributor1.id } },
//     },
//   });
//   await prisma.articleDB.create({
//     data: {
//       article_name: 'A review of C techniques',
//       article_file: '/uploads/review_c.pdf',
//       article_status: 'submitted',
//       publish_status: 'public',
//       published_year: 2024,
//       articleType: 'Review Article',
//       user: { connect: { id: user2.id } },
//       contributor: { connect: { id: contributor2.id } },
//     },
//   });
//   await prisma.articleDB.create({
//     data: {
//       article_name: 'ความจริงมีหนึ่งเดียว',
//       article_status: 'pending',
//       publish_status: 'private',
//       published_year: 2025,
//       abstract: 'ในโลกที่เต็มไปด้วยข้อมูลข่าวสารที่สับสนวุ่นวาย...',
//       user: { connect: { id: user3.id } },
//       contributor: { connect: { id: contributor3.id } },
//     },
//   });
//   console.log('สร้าง ArticleDB 3 บทความสำเร็จ');

//   console.log('✅ Seed ข้อมูลทั้งหมดสำเร็จแล้วเหมียว!');
// }

// main()
//   .catch((e) => {
//     console.error("เกิดข้อผิดพลาดตอน Seed ข้อมูล:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });



