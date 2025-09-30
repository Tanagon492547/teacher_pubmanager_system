import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// "เมนูอาหาร" ของเรา ที่บอกว่าจะส่งข้อมูลหน้าตาแบบไหนกลับไป
export type FormattedUser = {
  userId: number;
  name: string;
  email: string | null;
  type: string;
  detail: string;
  login_check_date: string; 
};

// ฟังก์ชันหลักสำหรับดึงและจัดรูปแบบข้อมูล
export async function getAllUsers(): Promise<FormattedUser[]> {
  try {
    // 1. ดึงข้อมูล User ทั้งหมด พร้อมกับ "ประตูวาร์ป" ทั้งหมดที่เราต้องการ
    const users = await prisma.userAuthentication.findMany({
      include: {
        personal: {
          include: {
            user_type: true, // <-- เปิดประตูไปดูข้อมูล UserType
          },
        },
        login: true, // <-- เปิดประตูไปดูข้อมูล Login
      },
    });

    // 2. จัดรูปแบบข้อมูลให้อยู่ในรูปแบบที่เราต้องการ
    const formattedUsers = users.map(user => {
      const personalInfo = user.personal;
      const loginInfo = user.login;

      return {
        userId: user.id,
        name: personalInfo?.user_name || 'N/A',
        email: personalInfo?.email || null,
        // เดินผ่านประตู user_type ไปหยิบเอา user_typename ออกมา
        type: personalInfo?.user_type?.user_typename || 'N/A',
        detail: `Username: ${user.username}, Title: ${personalInfo?.user_fame || '-'}`,
        // อ่านเวลาจาก "นาฬิกา" (login_check_date) แล้วแปลงให้เป็นข้อความที่อ่านง่าย
        login_check_date: loginInfo?.login_check_date?.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }) || 'ยังไม่เคยเข้าสู่ระบบ',
      };
    });

    return formattedUsers;

  } catch (error) {
    console.error("เกิดข้อผิดพลาดตอนดึงข้อมูล Users:", error);
    return [];
  }
}


// "ประตู API" ของเรา ที่จะเรียกใช้ฟังก์ชันข้างบน
export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("API Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

