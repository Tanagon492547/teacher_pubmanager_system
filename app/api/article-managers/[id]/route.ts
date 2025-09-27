import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // <-- แก้ path ไปยัง prisma client ของเราให้ถูกต้องนะ

// สร้าง Type สำหรับข้อมูลที่เราต้องการจะส่งกลับไป
type ArticleData = {
  articleId?: number;
  article_name?: string;
  uploadDate?: string; // <-- ยังคงมี field นี้อยู่ แต่จะใช้ข้อมูลสมมติ
  published_year?: string;
  articleType?: string;
  article_status?: string;
};

// ฟังก์ชัน GET นี้จะทำงานเมื่อมีการเรียกมาที่ /api/articles/[id]
// **หมายเหตุ:** ตอนนี้ [id] จะหมายถึง userId นะเหมียว!
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {

    const {id} = await params; // <-- แก้ไข: params ไม่ใช่ Promise นะ
    const userId = Number(id);

    // 1. เช็คก่อนว่า ID ที่ส่งมาเป็นตัวเลขที่ถูกต้องหรือไม่
    if (isNaN(userId)) {
      return NextResponse.json({ error: "User ID ที่ส่งมาไม่ถูกต้อง (ต้องเป็นตัวเลขเท่านั้น)" }, { status: 400 });
    }

    // 2. ใช้ Prisma เพื่อค้นหาบทความทั้งหมดที่มี userId ตรงกับที่เราต้องการ
    const articles = await prisma.articleDB.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        id: 'desc', // เรียงจากบทความล่าสุดก่อน
      }
    });

    // 3. ถ้าหาบทความไม่เจอเลย ก็ให้ส่ง array ว่างๆ กลับไป
    if (!articles || articles.length === 0) {
      console.log(`ไม่พบบทความสำหรับ User ID: ${userId}`);
      return NextResponse.json([]);
    }

    // 4. จัดรูปแบบข้อมูล (map) ให้อยู่ในรูปแบบ ArticleData ที่เราต้องการ
    const formattedArticles: ArticleData[] = articles.map(article => {
      return {
        articleId: article.id,
        article_name: article.article_name,
        
        // --- ส่วนที่แก้ไขตามคำขอ ---
        // เนื่องจากตอนนี้เรายังไม่มีข้อมูลวันที่อัปโหลดในฐานข้อมูล
        // พี่ข้าวจึงใส่เป็น "ข้อมูลสมมติ" (วันที่ปัจจุบัน) ให้แทนนะเหมียว
        uploadDate: new Date().toISOString(),
        // -----------------------------

        published_year: String(article.published_year || 'N/A'),
        articleType: article.articleType || 'N/A',
        article_status: article.article_status || 'N/A',
      };
    });

    // 5. ส่งข้อมูลที่จัดรูปแบบแล้วกลับไป
    return NextResponse.json(formattedArticles);

  } catch (error) {
    console.error("API Error - find articles by user:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

