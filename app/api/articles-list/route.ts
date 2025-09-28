import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // <-- แก้ path ไปยัง prisma client ของเราให้ถูกต้องนะ

// 1. สร้าง "เมนูอาหาร" (Type) ฉบับใหม่ของเรา!
//    นี่คือหน้าตาข้อมูลแบบจัดเต็มที่เราต้องการ
export type DetailedArticleListItem = {
  articleId: number;
  articleName: string;
  publishedYear: number | null;
  articleType: string | null;
  academicTitle: string | null;
  firstName: string;
  lastName: string;
  faculty: string | null;
  department: string | null;
  abstract: string | null;
  downloadPath: string | null;
  article_status: string | null; // current workflow status
};

// ฟังก์ชัน GET นี้จะทำงานเมื่อมีการเรียกมาที่ /api/articles-list
export async function GET() {
  try {
    // 2. ให้ Prisma ไปค้นหาข้อมูลบทความทั้งหมด (เหมือนเดิม)
    const articles = await prisma.articleDB.findMany({
      include: {
        contributor: true, // ดึงข้อมูลผู้เขียน (Contributor)
        user: {            // ดึงข้อมูลเจ้าของบทความ (User)
          include: {
            personal: true, // และดึงข้อมูลส่วนตัว (Personal) ของเจ้าของมาด้วย
          },
        },
      },
      orderBy: {
        id: 'desc', // เรียงจากบทความล่าสุดก่อน
      }
    });

    // 3. จัดข้อมูลทั้งหมดให้อยู่ในรูปแบบ "เมนู" ฉบับใหม่ของเรา
    const formattedArticles: DetailedArticleListItem[] = articles.map(article => {
      // แยกชื่อ-นามสกุลของผู้เขียน
      const [firstName, lastName] = article.contributor?.contributor_name.split(' ') ?? ['N/A', ''];
      
      // **ส่วนที่แก้ไข!** //
      // เราจะสร้างตัวแปร personalInfo ขึ้นมา และเช็คก่อนว่ามันมีอยู่จริงหรือไม่
      const personalInfo = article.user?.personal;

      return {
        articleId: article.id,
        articleName: article.article_name,
        publishedYear: article.published_year,
        articleType: article.articleType,
        academicTitle: article.contributor?.academic_title ?? null,
        firstName: firstName,
        lastName: lastName,
        // ใช้ตัวแปร personalInfo ที่เราเช็คแล้ว เพื่อความปลอดภัย
        faculty: personalInfo?.faculty ?? null,
        department: personalInfo?.department ?? null,
        abstract: article.abstract,
        downloadPath: article.article_file,
        article_status: article.article_status ?? null,
      };
    });
    
    // 4. ส่งข้อมูลที่จัดแล้วกลับไป
    return NextResponse.json(formattedArticles);

  } catch (error) {
    console.error("เกิดข้อผิดพลาดใน API:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

