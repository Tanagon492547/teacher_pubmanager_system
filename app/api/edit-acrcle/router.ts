import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // <-- Import cookies สำหรับเช็คสิทธิ์
import prisma from '../../../lib/prisma'; // <-- แก้ path ไปยัง prisma client ของเรา

// ฟังก์ชัน GET นี้จะทำหน้าที่เป็น "ยาม" ของเรา
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {id} =  await params
    const articleId = Number(id);

    console.log('asfas', articleId)
    
    if (isNaN(articleId)) {
      return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 }); // 400 = Bad Request
    }

    // --- นี่คือ Logic จาก "นักสืบ" ที่เราเอามาปรับใช้นะ! ---

    // 1. ยามเช็ค "บัตรพนักงาน" (Cookie)
    //    พี่ข้าวขออธิบายเรื่อง cookies() อีกทีนะ! เราไม่ต้องใช้ await นะเหมียว 🐱
      const cookie =  await cookies() 
    const userIdCookie = cookie.get('userId')
    if (!userIdCookie) {
      // ถ้าไม่มีบัตร ก็ "ปฏิเสธการเข้า" ด้วยสถานะ 401
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, { status: 401 }); // 401 = Unauthorized
    }
    const loggedInUserId = Number(userIdCookie.value);

    // 2. ยามค้นหาข้อมูลบทความใน "แฟ้มเอกสาร" (Database)
    const article = await prisma.articleDB.findUnique({
      where: { id: articleId },
    });

    // 3. ถ้าหาไม่เจอ ก็ตะโกนบอกว่า "404 หาไม่เจอ!"
    if (!article) {
      return NextResponse.json({ error: "ไม่พบบทความนี้" }, { status: 404 }); // 404 = Not Found
    }

    // 4. ยามเช็คว่า "เป็นเจ้าของบทความหรือไม่"
    if (article.userId !== loggedInUserId) {
      // ถ้าไม่ใช่ ก็ตะโกนบอกว่า "403 ไม่มีสิทธิ์เข้า!"
      return NextResponse.json({ error: "คุณไม่มีสิทธิ์แก้ไขบทความนี้" }, { status: 403 }); // 403 = Forbidden
    }

    // --- จบ Logic จาก "นักสืบ" ---
    
    // 5. ถ้าทุกอย่างผ่านฉลุย ก็ "เปิดประตู" แล้วส่งข้อมูลบทความกลับไป
    return NextResponse.json(article);

  } catch (error) {
    console.error("เกิดข้อผิดพลาดใน API:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

