import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma' // <-- แก้ path ไปยัง prisma client ของเราให้ถูกต้องนะ

// ฟังก์ชัน GET นี้จะทำงานเมื่อมีการเรียกมาที่ /api/articles/[id]
// เช่น /api/articles/123
export async function GET(
  request: Request, // request จะไม่ได้ใช้ แต่ต้องมีไว้ตามโครงสร้างนะเหมียว
  { params }: { params: { id: string } } // params คือ object ที่มี id ของเราอยู่ข้างใน
) {
  try {
    const id = params.id;

    // --- นี่คือ Logic จากใน Canvas ที่เราเอามาปรับใช้นะ! ---

    // 1. แปลง id ที่ได้จาก URL ให้เป็นตัวเลข
    const numericId = Number(id);
    if (isNaN(numericId)) {
      // ถ้า id ไม่ใช่ตัวเลข, ให้ส่ง error กลับไป
      return NextResponse.json({ error: "ID ที่ส่งมาไม่ถูกต้อง (ต้องเป็นตัวเลขเท่านั้น)" }, { status: 400 });
    }

    // 2. พยายามค้นหาบทความในฐานข้อมูลด้วย id นั้น
    const article = await prisma.articleDB.findUnique({
      where: { id: numericId },
    });

    // 3. ถ้าหาบทความไม่เจอ, ให้ส่ง error 404 Not Found กลับไป
    if (!article) {
      return NextResponse.json({ error: "ไม่พบบทความนี้" }, { status: 404 });
    }
    
    // --- จบ Logic จาก Canvas ---

    // 4. ถ้าหาเจอ ก็ให้ส่งข้อมูลบทความกลับไป
    return NextResponse.json(article);

  } catch (error) {
    console.error("เกิดข้อผิดพลาดใน API:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}