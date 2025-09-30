import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  const users = await prisma.userAuthentication.findMany({
    include: { 
      personal: {
        include: {
          user_type: true
        }
      } 
    }
  })
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { username, password, user_name,
    user_fame, userTypeId, age,
    email, number_phone, academic,
    faculty, department
  } = body

  // เช็คก่อนเลยว่ามี userTypeId ส่งมาให้รึเปล่า
  if (!userTypeId) {
    return NextResponse.json({ error: "จำเป็นต้องระบุประเภทผู้ใช้ (userTypeId)" }, { status: 400 });
  }

  try {
    // เรารวบการสร้าง User, Personal, และ Login ไว้ในคำสั่งเดียวเลย!
    const user = await prisma.userAuthentication.create({
      data: {
        username,
        password, // **คำเตือน!** ในแอปจริง ควรจะเข้ารหัสรหัสผ่านก่อนนะ
        personal: {
          create: {
            user_name,
            user_fame,
            email,
            number_phone,
            academic,
            faculty,
            department,
            age: age ? Number(age) : undefined,
            
            // **ส่วนที่แก้ไข!** //
            // เราจะใช้ `connect` เพื่อ "เชื่อม" ความสัมพันธ์อย่างชัดเจน
            // แทนการใส่ userTypeId เข้าไปตรงๆ นะเหมียว
            user_type: {
              connect: {
                userTypeId: Number(userTypeId)
              }
            }
          }
        },
        // Prisma จะสร้าง Login record และเชื่อม userId ให้เราโดยอัตโนมัติเลย!
        login: {
          create: {} 
        }
      },
      // ดึงข้อมูลทั้งหมดกลับมาเพื่อส่ง response
      include: { 
        personal: { 
          include: { 
            user_type: true 
          } 
        }, 
        login: true 
      } 
    })
    
    console.log(`สร้าง User, Personal, และ Login สำหรับ userId: ${user.id} สำเร็จ!`);

    return NextResponse.json(user)

  } catch (error) {
    console.error("เกิดข้อผิดพลาดตอนสร้าง User:", error);
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

