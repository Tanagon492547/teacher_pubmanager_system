'use server'
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

export async function getProfile(userId: string) {
  try {
    console.log('ID:', userId);
    const id = Number(userId);
    // ช่วยดึงข้อมูลจาก ฐานข้อมูล
    // 2. เช็คว่าการแปลงสำเร็จหรือไม่ (ถ้า id ไม่ใช่ตัวเลข)
    if (isNaN(id)) {
      throw new Error('User ID ไม่ถูกต้อง');
    }
    // 3. ใช้ Prisma เพื่อดึงข้อมูลจากฐานข้อมูล
    const userProfile = await prisma.userAuthentication.findUnique({
      where: {
        id: id, // <-- ใช้ id ที่เป็น number ในการค้นหา
      },
      // 4. ใช้ include เพื่อดึงข้อมูลที่เกี่ยวข้องมาด้วย
      include: {
        personal: { // ดึงข้อมูลจากตาราง Personal
          include: {
            user_type: true, // และดึงข้อมูล UserType ที่อยู่ใน Personal อีกที
          },
        },
      },
    });

    // 5. ถ้าหา user ไม่เจอ
    if (!userProfile) {
      throw new Error('ไม่พบข้อมูลผู้ใช้');
    }

    // 6. ไม่ส่งรหัสผ่านกลับไปที่ Client เพื่อความปลอดภัย
    const { password, ...safeUserProfile } = userProfile;

    // 7. ส่งข้อมูลโปรไฟล์ (ที่ไม่รวมรหัสผ่าน) กลับไป
    return { success: true, data: safeUserProfile };
  } catch (error : any) {
    console.error("เกิดข้อผิดพลาดในการดึงโปรไฟล์:", error.message);
    return { success: false, error: error.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้' };
  }


}