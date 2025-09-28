'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// Type สำหรับข้อมูลผู้เขียน (จากไฟล์เดิม)
export type AuthorData = {
  academic_title: string;
  firstname: string;
  lastname: string;
};

// ฟังก์ชันหาข้อมูลผู้เขียน (จากไฟล์เดิม)
export async function getCurrentUserAuthorData(): Promise<AuthorData | null> {
  try {

    const cookieStore = await cookies()
    const userIdCookie = cookieStore.get('userId');
    if (!userIdCookie) return null;
    const personalInfo = await prisma.personal.findUnique({
      where: { userId: Number(userIdCookie.value) },
      select: { user_fame: true, user_name: true },
    });
    if (!personalInfo) return null;
    const [firstname, lastname] = personalInfo.user_name?.split(' ') ?? ['', ''];
    return {
      academic_title: personalInfo.user_fame || '',
      firstname: firstname,
      lastname: lastname,
    };
  } catch (error) {
    console.error("Failed to fetch current user data:", error);
    return null;
  }
}

// **"นักสืบ" คนใหม่ของเรา!** //
// ทำหน้าที่หา "ประเภท" ของผู้ใช้ที่ Login อยู่
export async function getCurrentUserType(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const userIdCookie = cookieStore.get('userId');
    if (!userIdCookie) return null;

    const loggedInUserId = Number(userIdCookie.value);

    // ไปหาข้อมูลในตาราง Personal
    const personalInfo = await prisma.personal.findUnique({
      where: { userId: loggedInUserId },
      select: {
        // **ส่วนที่แก้ไข!** //
        // เปลี่ยนจาก userType เป็น user_type ให้ตรงกับ schema ของเรา
        // และดึงข้อมูล user_typename ที่อยู่ข้างในออกมาด้วย
        user_type: {
          select: {
            user_typename: true,
          }
        },
      },
    });

    // **ส่วนที่แก้ไข!** //
    // ส่งค่า user_typename ที่อยู่ใน object user_type กลับไป
    return personalInfo?.user_type?.user_typename || null;

  } catch (error) {
    console.error("Failed to fetch user type:", error);
    return null;
  }
}

