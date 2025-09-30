const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📊 กำลังตรวจสอบข้อมูลในฐานข้อมูล...\n');
  
  const userCount = await prisma.userAuthentication.count();
  const contributorCount = await prisma.contributor.count();
  const articleCount = await prisma.articleDB.count();
  const historyCount = await prisma.articleStatusHistory.count();
  const categoryCount = await prisma.category.count();
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📈 สรุปข้อมูลทั้งหมดในฐานข้อมูล:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✓ ผู้ใช้งาน: ${userCount} คน`);
  console.log(`✓ Contributors: ${contributorCount} คน`);
  console.log(`✓ บทความ: ${articleCount} บทความ`);
  console.log(`✓ ประวัติการตรวจสอบ: ${historyCount} รายการ`);
  console.log(`✓ หมวดหมู่: ${categoryCount} รายการ`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // แสดงสถิติบทความ
  const articlesByStatus = await prisma.articleDB.groupBy({
    by: ['article_status'],
    _count: true
  });
  
  console.log('📑 สถิติบทความตามสถานะ:');
  articlesByStatus.forEach(item => {
    console.log(`  ${item.article_status || 'ไม่ระบุ'}: ${item._count} บทความ`);
  });
  
  console.log('\n✅ ตรวจสอบเสร็จสิ้น!');
}

main()
  .catch((e) => {
    console.error('❌ เกิดข้อผิดพลาด:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
