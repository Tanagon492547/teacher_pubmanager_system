import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = await prisma.userAuthentication.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ ok: false, error: 'User not found' }, { status: 401 });
  }
  
  // **คำเตือน!** การเปรียบเทียบรหัสผ่านตรงๆ แบบนี้ไม่ปลอดภัยนะเหมียว
  if (user.password !== password) {
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  }

  // สร้าง "พัสดุ" (Response) ที่เราจะส่งกลับไป
  // **สำคัญ!** เราใส่ userId เข้าไปใน JSON ที่จะส่งกลับตรงนี้เลย!
  const response = NextResponse.json({ ok: true, userId: user.id });

  // บอกให้ "พัสดุ" นี้ "ติด" cookie ของเราไปด้วย
  try {
    response.cookies.set('userId', String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 วัน
      path: '/',
    });
  } catch (error) {
    console.error("Failed to set cookie:", error);
    return NextResponse.json({ ok: false, error: 'Could not create session' }, { status: 500 });
  }

  // ส่ง "พัสดุ" (ที่มีทั้ง JSON และ cookie) กลับไป
  return response;
}