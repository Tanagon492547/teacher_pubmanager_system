const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ฟังก์ชันสุ่มข้อมูล
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// ข้อมูลสำหรับสุ่ม
const firstNames = ['สมชาย', 'สมหญิง', 'วิชัย', 'สุดา', 'ประดิษฐ์', 'นภา', 'อนุชา', 'วรรณา', 'ธนา', 'สุภา', 
  'จิรายุ', 'ปิยะ', 'สุรชัย', 'นันทนา', 'ชัยวัฒน์', 'มานิต', 'วิไล', 'สมพร', 'กนก', 'ธีระ',
  'พิมพ์', 'รัตน์', 'ศักดิ์', 'จิตรา', 'สมศักดิ์', 'อรุณ', 'วีระ', 'สาวิตรี', 'ประภาส', 'อัมพร'];

const lastNames = ['ใจดี', 'รักการสอน', 'นักวิจัย', 'สร้างสรรค์', 'พัฒนา', 'เจริญ', 'มั่งคั่ง', 'สุขสันต์', 'ปัญญา', 'คิดดี',
  'ทำดี', 'มีศรี', 'ชัยชนะ', 'เหมาะสม', 'ถูกต้อง', 'สมบูรณ์', 'เพียรพยายาม', 'มุ่งมั่น', 'ก้าวหน้า', 'วิทยา'];

const academicTitles = ['ผู้ช่วยศาสตราจารย์', 'รองศาสตราจารย์', 'ศาสตราจารย์', 'อาจารย์', 'นักวิจัย', 'ผู้เชี่ยวชาญ'];

const faculties = ['คณะวิทยาศาสตร์', 'คณะวิศวกรรมศาสตร์', 'คณะแพทยศาสตร์', 'คณะพยาบาลศาสตร์', 
  'คณะครุศาสตร์', 'คณะมนุษยศาสตร์', 'คณะสังคมศาสตร์', 'คณะเศรษฐศาสตร์', 
  'คณะบริหารธุรกิจ', 'คณะนิติศาสตร์', 'คณะเภสัชศาสตร์', 'คณะสถาปัตยกรรมศาสตร์'];

const departments = ['ภาควิชาวิทยาการคอมพิวเตอร์', 'ภาควิชาฟิสิกส์', 'ภาควิชาเคมี', 'ภาควิชาชีววิทยา',
  'ภาควิชาวิศวกรรมซอฟต์แวร์', 'ภาควิชาวิศวกรรมไฟฟ้า', 'ภาควิชาวิศวกรรมโยธา', 
  'ภาควิชาวิศวกรรมเครื่องกล', 'ภาควิชาคณิตศาสตร์', 'ภาควิชาสถิติ'];

const articleTopics = [
  'การพัฒนาระบบ', 'การวิเคราะห์ข้อมูล', 'ปัญญาประดิษฐ์', 'Machine Learning', 
  'Deep Learning', 'Blockchain', 'Internet of Things', 'Cloud Computing',
  'Cybersecurity', 'Big Data Analytics', 'Data Science', 'Natural Language Processing',
  'Computer Vision', 'Robotics', 'Quantum Computing', 'Edge Computing',
  'การจัดการความรู้', 'นวัตกรรมทางการศึกษา', 'เทคโนโลยีชีวภาพ', 'พลังงานทดแทน'
];

const articleSubjects = [
  'ในภาคอุตสาหกรรม', 'สำหรับการศึกษา', 'เพื่อการแพทย์', 'ในยุคดิจิทัล',
  'และการประยุกต์ใช้งาน', 'เพื่อความยั่งยืน', 'ในประเทศไทย', 'สมัยใหม่',
  'แบบอัจฉริยะ', 'เชิงนวัตกรรม', 'แนวทางใหม่', 'ยุค 4.0'
];

const articleStatuses = ['รอตรวจสอบ', 'อนุมัติ', 'ไม่อนุมัติ', 'แก้ไข'];
const publishStatuses = ['เผยแพร่แล้ว', 'ยังไม่เผยแพร่'];
const articleTypes = ['วิจัย', 'บทความวิชาการ', 'บทความปริทัศน์', 'กรณีศึกษา'];

async function main() {
  console.log('🚀 เริ่มสร้างข้อมูลจำนวนมากแบบสุ่ม...\n');

  // สร้าง UserType
  await Promise.all([
    prisma.userType.upsert({
      where: { userTypeId: 1 },
      update: {},
      create: { id: 1, userTypeId: 1, user_typename: 'Admin' }
    }),
    prisma.userType.upsert({
      where: { userTypeId: 2 },
      update: {},
      create: { id: 2, userTypeId: 2, user_typename: 'Staff' }
    }),
    prisma.userType.upsert({
      where: { userTypeId: 3 },
      update: {},
      create: { id: 3, userTypeId: 3, user_typename: 'Teacher' }
    })
  ]);
  console.log('✓ สร้าง UserType เรียบร้อย');

  // สร้าง Admin
  const admin = await prisma.userAuthentication.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: 'admin123' }
  });

  await prisma.personal.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      user_name: 'ผู้ดูแลระบบ',
      user_fame: 'Admin',
      age: 30,
      email: 'admin@university.ac.th',
      number_phone: '084-567-8901',
      academic: 'ผู้ดูแลระบบ',
      faculty: 'สำนักงานอธิการบดี',
      department: 'ฝ่ายเทคโนโลยีสารสนเทศ',
      userTypeId: 1
    }
  });

  console.log('✓ สร้าง Admin เรียบร้อย');

  // สร้างผู้ใช้จำนวนมากแบบสุ่ม (50 คน)
  const users = [admin];
  const userCount = 50;
  
  console.log(`🔄 กำลังสร้างผู้ใช้ ${userCount} คน...`);
  
  for (let i = 1; i <= userCount; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const username = `user${String(i).padStart(3, '0')}`;
    const userTypeId = randomInt(2, 3); // Staff หรือ Teacher
    
    try {
      const user = await prisma.userAuthentication.create({
        data: {
          username: username,
          password: 'password123'
        }
      });
      
      await prisma.personal.create({
        data: {
          userId: user.id,
          user_name: firstName,
          user_fame: lastName,
          age: randomInt(25, 65),
          email: `${username}@university.ac.th`,
          number_phone: `08${randomInt(0, 9)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
          academic: randomItem(academicTitles),
          faculty: randomItem(faculties),
          department: randomItem(departments),
          userTypeId: userTypeId
        }
      });
      
      users.push(user);
      
      if (i % 10 === 0) {
        console.log(`  ✓ สร้างผู้ใช้แล้ว ${i}/${userCount} คน`);
      }
    } catch (error) {
      console.log(`  ⚠ ข้าม ${username} (มีอยู่แล้ว)`);
    }
  }
  
  console.log(`✅ สร้างผู้ใช้ทั้งหมด ${users.length} คน เรียบร้อย\n`);

  // สร้าง Contributors จำนวนมาก (30 คน)
  const contributors = [];
  const contributorCount = 30;
  
  console.log(`🔄 กำลังสร้าง Contributors ${contributorCount} คน...`);
  
  for (let i = 1; i <= contributorCount; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const hasTitle = Math.random() > 0.3;
    const contributorName = hasTitle 
      ? `${randomItem(['ดร.', 'ผศ.ดร.', 'รศ.ดร.', 'ศ.ดร.'])}${firstName} ${lastName}`
      : `${firstName} ${lastName}`;
    
    try {
      const contributor = await prisma.contributor.create({
        data: {
          contributor_name: contributorName,
          academic_title: hasTitle ? randomItem(academicTitles) : null
        }
      });
      
      contributors.push(contributor);
      
      if (i % 10 === 0) {
        console.log(`  ✓ สร้าง Contributors แล้ว ${i}/${contributorCount} คน`);
      }
    } catch (error) {
      console.log(`  ⚠ ข้าม contributor (มีข้อผิดพลาด)`);
    }
  }
  
  console.log(`✅ สร้าง Contributors ทั้งหมด ${contributors.length} คน เรียบร้อย\n`);

  // สร้างบทความจำนวนมาก (100 บทความ)
  const articles = [];
  const articleCount = 100;
  
  console.log(`🔄 กำลังสร้างบทความ ${articleCount} บทความ...`);
  
  for (let i = 1; i <= articleCount; i++) {
    const topic = randomItem(articleTopics);
    const subject = randomItem(articleSubjects);
    const articleName = `${topic}${subject}`;
    const status = randomItem(articleStatuses);
    const publishStatus = status === 'อนุมัติ' 
      ? randomItem(publishStatuses)
      : 'ยังไม่เผยแพร่';
    
    try {
      const article = await prisma.articleDB.create({
        data: {
          article_name: articleName,
          article_status: status,
          publish_status: publishStatus,
          published_year: randomInt(2020, 2025),
          articleType: randomItem(articleTypes),
          abstract: `บทความนี้นำเสนอเกี่ยวกับ${topic}${subject} โดยมีวัตถุประสงค์เพื่อศึกษาและพัฒนา${topic}ให้มีประสิทธิภาพมากยิ่งขึ้น ผลการศึกษาพบว่ามีความเป็นไปได้สูงในการนำไปประยุกต์ใช้งานจริง`,
          userId: randomItem(users).id,
          contributorId: contributors.length > 0 ? randomItem(contributors).id : null
        }
      });
      
      articles.push(article);
      
      // สร้าง Category สำหรับบทความ
      await prisma.category.create({
        data: {
          articleId: article.id,
          summary: `${topic}, ${randomItem(articleTopics)}`
        }
      });
      
      // สร้าง Article Status History
      const shouldHaveHistory = Math.random() > 0.2; // 80% มี history
      if (shouldHaveHistory) {
        await prisma.articleStatusHistory.create({
          data: {
            articleId: article.id,
            article_status: status,
            reviewerId: admin.id,
            reviewerNote: status === 'อนุมัติ' 
              ? 'บทความมีคุณภาพดี อนุมัติให้เผยแพร่' 
              : status === 'ไม่อนุมัติ'
              ? 'เนื้อหาต้องปรับปรุง กรุณาแก้ไขตามข้อเสนอแนะ'
              : status === 'แก้ไข'
              ? 'พบข้อบกพร่องบางส่วน กรุณาแก้ไขและส่งใหม่'
              : 'อยู่ระหว่างการพิจารณา'
          }
        });
      }
      
      if (i % 20 === 0) {
        console.log(`  ✓ สร้างบทความแล้ว ${i}/${articleCount} บทความ`);
      }
    } catch (error) {
      console.log(`  ⚠ ข้ามบทความที่ ${i} (มีข้อผิดพลาด: ${error.message})`);
    }
  }
  
  console.log(`✅ สร้างบทความทั้งหมด ${articles.length} บทความ เรียบร้อย\n`);
  console.log('\n🎉 สร้างข้อมูลทั้งหมดเรียบร้อยแล้ว!');
  console.log('\n📊 สรุปข้อมูลที่สร้าง:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✓ UserType: 3 ประเภท`);
  console.log(`✓ ผู้ใช้งาน: ${users.length} คน`);
  console.log(`✓ Contributors: ${contributors.length} คน`);
  console.log(`✓ บทความ: ${articles.length} บทความ`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔑 ข้อมูล Login ตัวอย่าง:');
  console.log('Username: admin, Password: admin123 (Admin)');
  console.log('Username: user001-user050, Password: password123 (Staff/Teacher)');
}

main()
  .catch((e) => {
    console.error('❌ เกิดข้อผิดพลาด:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
