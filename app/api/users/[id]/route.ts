import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

// =================================================================
//  GET (ขอดูข้อมูล User คนเดียว)
// =================================================================
export async function GET(
  req: Request, 
  { params }: { params: { id: string } } // <-- ปรับแก้ context ให้เป็นแบบมาตรฐานนะเหมียว
) {
  const {id} = await params
  const nid = Number(id)
  // เพิ่มการเช็คว่า id เป็นตัวเลขที่ถูกต้องหรือไม่
  if (isNaN(nid)) {
    return NextResponse.json({ error: 'ID ไม่ถูกต้อง' }, { status: 400 });
  }

  const user = await prisma.userAuthentication.findUnique({
    where: { id : nid },
    // **ส่วนที่แก้ไขสำคัญที่สุด!** // เราต้อง include `user_type` ที่ซ้อนอยู่ใน `personal` อีกทีหนึ่ง
    include: { 
      personal: {
        include: {
          user_type: true // <-- แบบนี้แหละที่ `fetchUser` ต้องการ!
        }
      } 
    }
  })

  if (!user) return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 })
  return NextResponse.json(user)
}

// =================================================================
//  PUT (แก้ไขข้อมูล User คนเดียว)
// =================================================================
export async function PUT(
  req: Request, 
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID ไม่ถูกต้อง' }, { status: 400 });
  }

  const body = await req.json()

  try {
    // 1. อัปเดตข้อมูลหลักใน UserAuthentication
    if (body.username || body.password) {
      await prisma.userAuthentication.update({ 
        where: { id }, 
        data: { 
          username: body.username, 
          // **คำเตือน!** ในแอปจริง ควรจะเข้ารหัสรหัสผ่านก่อนบันทึกนะเหมียว!
          password: body.password 
        } 
      })
    }

    // 2. เตรียมข้อมูลสำหรับอัปเดตตาราง Personal
    const personalData: any = {};
    // พี่ข้าวเพิ่มการเช็คเข้าไป เพื่อให้เราส่งไปแค field ที่ต้องการจะอัปเดตจริงๆ นะ
    if (body.user_name) personalData.user_name = body.user_name;
    if (body.user_fame) personalData.user_fame = body.user_fame;
    if (body.age != null) personalData.age = Number(body.age);
    if (body.profile_image) personalData.profile_image = body.profile_image;
    if (body.email) personalData.email = body.email;
    if (body.number_phone) personalData.number_phone = body.number_phone;
    if (body.academic) personalData.academic = body.academic;
    if (body.faculty) personalData.faculty = body.faculty;
    if (body.department) personalData.department = body.department;
    
    // **ส่วนที่แก้ไข!** จัดการความสัมพันธ์กับ UserType ให้ถูกต้อง
    if (body.user_typename) {
        const userType = await prisma.userType.findFirst({
            where: { user_typename: body.user_typename }
        });
        if(userType) {
            personalData.user_type = {
                connect: { userTypeId: userType.userTypeId }
            }
        }
    }
    
    // 3. อัปเดตหรือสร้างข้อมูล Personal
    await prisma.personal.upsert({
        where: { userId: id },
        update: personalData,
        create: {
            userId: id,
            ...personalData
        }
    });

    // 4. ดึงข้อมูลที่อัปเดตแล้วทั้งหมดกลับไป
    const updatedUser = await prisma.userAuthentication.findUnique({ 
      where: { id }, 
      include: { 
        personal: {
          include: { user_type: true }
        }
      } 
    })

    return NextResponse.json(updatedUser)

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// =================================================================
//  DELETE (ลบข้อมูล User คนเดียว)
// =================================================================
export async function DELETE(
  req: Request, 
  { params }: { params: { id: string } }
) {
  const {id} = await params
  const nid = Number(id)
  if (isNaN(nid)) {
    return NextResponse.json({ error: 'ID ไม่ถูกต้อง' }, { status: 400 });
  }

  try {
    // **ส่วนที่แก้ไข!** เราต้องลบข้อมูลที่เชื่อมกันอยู่ทั้งหมดก่อนนะ
    await prisma.personal.deleteMany({ where: { userId: nid } })
    await prisma.login.deleteMany({ where: { userId: nid } })
    await prisma.articleDB.deleteMany({ where: { userId: nid }}) // <-- ลบบทความของ User นี้ด้วย
    
    // สุดท้ายค่อยลบ User หลัก
    await prisma.userAuthentication.delete({ where: { id : nid } })
    
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
