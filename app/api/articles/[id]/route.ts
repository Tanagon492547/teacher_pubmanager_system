import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // <-- แก้ path ไปยัง prisma client ของเราให้ถูกต้องนะ

// ฟังก์ชัน GET นี้จะทำงานเมื่อมีการเรียกมาที่ /api/articles/[id]
// เช่น /api/articles/123
export async function GET(
  request: Request, // request จะไม่ได้ใช้ แต่ต้องมีไว้ตามโครงสร้างนะเหมียว
  { params }: { params: { id: string } } // params คือ object ที่มี id ของเราอยู่ข้างใน
) {
  try {
    // **ส่วนที่แก้ไข!** //
    // params ไม่ใช่ Promise นะเหมียว! มันเป็น object ธรรมดาๆ
    // เราเลยสามารถดึง id ออกมาได้โดยตรงเลย ไม่ต้องใช้ await จ้ะ

  // params ถูกส่งมาเป็น object ปกติ ไม่ต้อง await
  const { id } = params;
  console.log('ได้รับคำขอสำหรับบทความ ID: ', id);

    // 1. แปลง id ที่ได้จาก URL ให้เป็นตัวเลข
    const numericId = Number(id);
    if (isNaN(numericId)) {
      // ถ้า id ไม่ใช่ตัวเลข, ให้ส่ง error กลับไป
      return NextResponse.json({ error: "ID ที่ส่งมาไม่ถูกต้อง (ต้องเป็นตัวเลขเท่านั้น)" }, { status: 400 });
    }

    // 2. พยายามค้นหาบทความในฐานข้อมูลด้วย id นั้น
    // รวมความสัมพันธ์ contributor และ coAuthors เพื่อให้หน้า frontend ใช้งานได้
    const article = await prisma.articleDB.findUnique({
      where: { id: numericId },
      include: {
        contributor: true,
        coAuthors: true,
        statusHistory: {
          orderBy: { save_history: 'desc' },
          take: 1,
        },
      },
    });

    // 3. ถ้าหาบทความไม่เจอ, ให้ส่ง error 404 Not Found กลับไป
    if (!article) {
      return NextResponse.json({ error: "ไม่พบบทความนี้" }, { status: 404 });
    }
    
    // 4. ถ้าหาเจอ ก็ให้จัดรูปแบบข้อมูลบางส่วนแล้วส่งกลับ
    // คำนวณ uploadDate ให้เหมือน logic ใน article-managers
    const latestHistory = article.statusHistory && article.statusHistory.length > 0 ? article.statusHistory[0] : null;
    const uploadDate = latestHistory && latestHistory.save_history
      ? new Date(latestHistory.save_history).toISOString()
      : article.published_date
      ? new Date(article.published_date).toISOString()
      : new Date().toISOString();

    const mapped = {
      id: article.id,
      article_name: article.article_name,
      article_file: article.article_file,
      article_status: article.article_status,
      publish_status: article.publish_status,
      published_year: article.published_year,
      published_date: article.published_date,
      articleType: article.articleType,
      abstract: article.abstract,
      uploadDate,
      contributor: article.contributor ? {
        contributor_name: article.contributor.contributor_name,
        academic_title: article.contributor.academic_title,
      } : null,
      coAuthors: Array.isArray(article.coAuthors) && article.coAuthors.length > 0 ? article.coAuthors.map((c: any) => ({
        academic_title: c.academic_title,
        firstname: c.firstname,
        lastname: c.lastname,
      })) : [],
    };

    return NextResponse.json(mapped);

  } catch (error) {
    console.error("เกิดข้อผิดพลาดใน API:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

