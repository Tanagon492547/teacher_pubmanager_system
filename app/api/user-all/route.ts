import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// สร้าง Type สำหรับข้อมูลที่เราต้องการจะแสดงผล
export type FormattedUser = {
  userId: number;
  name: string;
  // email: string | null;
  type: string;
  detail: string;
  // login_check_date ถูกลบออกไปแล้ว
};

// ย้ายฟังก์ชัน getAllUsers มาไว้ในไฟล์นี้เลย
export async function getAllUsers(): Promise<FormattedUser[]> {
  try {
    // 1. ดึงข้อมูล User ทั้งหมด พร้อมกับข้อมูลที่เชื่อมกันอยู่
    const users = await prisma.userAuthentication.findMany({
      include: {
        personal: {
          include: {
            user_type: true,
          },
        },
        // เราไม่จำเป็นต้อง include: login แล้ว เพราะไม่ได้ใช้ข้อมูลจากตารางนั้น
      },
    });

    // 2. จัดรูปแบบข้อมูล (map) ให้อยู่ในรูปแบบที่เราต้องการ
    const formattedUsers = users.map(user => {
      const personalInfo = user.personal;

      return {
        userId: user.id,
        name: personalInfo?.user_name || 'N/A',
        // email: personalInfo?.email || "null",
        type: personalInfo?.user_type.user_typename || 'N/A',
        detail: `Username: ${user.username}, Title: ${personalInfo?.user_fame || '-'}`,
        // login_check_date ถูกลบออกไปแล้ว
      };
    });

    return formattedUsers;

  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}


// สร้างฟังก์ชันชื่อ GET เพื่อรองรับ GET request โดยเฉพาะ
export async function GET() {
  try {
    // เรียกใช้ฟังก์ชันดึงข้อมูลจากฐานข้อมูล (ที่อยู่ในไฟล์เดียวกัน)
    const users = await getAllUsers();

    // ส่งข้อมูล users กลับไปในรูปแบบ JSON พร้อมกับ status 200 (OK)
    return NextResponse.json(users, { status: 200 });

  } catch (error) {
    console.error("API Error fetching users:", error);
    // หากเกิดข้อผิดพลาด ให้ส่ง error message กลับไปพร้อม status 500
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

