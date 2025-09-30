"use client";

import ProfileCard from "@/components/profiles/ProfileCard";
import { getProfile } from "@/hooks/posts/actions";
import React, { useEffect, useState } from "react";

// 1. สร้าง Type สำหรับหน้าตาข้อมูลโปรไฟล์ที่เราจะได้รับกลับมา
//    (เพื่อให้ TypeScript ช่วยเราเขียนโค้ดได้ง่ายขึ้น)
type ProfileData = {
  id: number;
  username: string;
  personal: {
    user_name: string;
    user_fame: string | null;
    gender?:string;
    faculty? : string;
    department?: string;
    number_phone?: string;
    email? : string;
    image_user? : string;
    academic?:string;
    // ... field อื่นๆ จาก personal ...
  } | null;
};

const ProfilePage = () => {
  // 2. สร้าง State ขึ้นมา 3 ตัว:
  const [profile, setProfile] = useState<ProfileData | null>(null); // สำหรับเก็บข้อมูลโปรไฟล์
  const [isLoading, setIsLoading] = useState(true);                  // สำหรับเช็คว่ากำลังโหลดอยู่มั้ย
  const [error, setError] = useState<string | null>(null);            // สำหรับเก็บข้อความ Error

  useEffect(() => {
    // 3. สร้างฟังก์ชัน async ไว้ข้างใน useEffect เลย
    const fetchProfileData = async () => {
      // 4. ดึง userId จาก localStorage
      const storedUserId = localStorage.getItem('userId');

      if (storedUserId) {
        // 5. ถ้ามี ID, ก็ให้เรียก Server Action
        const result = await getProfile(storedUserId);

        if (result.success) {
          // 6. ถ้าสำเร็จ, ก็เอาข้อมูลไปเก็บใน State
          //    ใช้ ?? null เพื่อจัดการกรณีที่ TypeScript คิดว่า data อาจเป็น undefined
          setProfile(result.data ?? null);
        } else {
          // ถ้าล้มเหลว, ก็เก็บข้อความ Error
          setError(result.error || "ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
        }
      } else {
        setError("ไม่พบ User ID ในระบบ, กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      }

      // 7. ไม่ว่าจะสำเร็จหรือล้มเหลว ก็ให้หยุดการโหลด
      setIsLoading(false);
    };

    fetchProfileData();
  }, []); // <-- วงเล็บว่าง [] = ทำงานแค่ครั้งเดียวตอนเริ่ม

  // --- ส่วนของการแสดงผล ---
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>กำลังโหลดข้อมูลโปรไฟล์...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-red-500">เกิดข้อผิดพลาด: {error}</p></div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center h-screen"><p>ไม่พบข้อมูลผู้ใช้</p></div>;
  }

  // แยกชื่อ-นามสกุลออกจากกัน (ถ้ามี) และป้องกัน error กรณี user_name เป็น null
  const [firstName, lastName] = profile.personal?.user_name?.split(' ') ?? ['N/A', ''];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <ProfileCard 
        // 8. ส่งข้อมูลจาก State ของเราไปให้ ProfileCard
        academic_user={profile.personal?.academic || 'ยังไม่มีคำนำหน้า'}
        fname_user={firstName? firstName : 'ไม่พบข้อมูล'}
        lname_user={lastName? lastName : 'ไม่พบข้อมูล'}
        gender_user={profile.personal?.gender || 'N/A'}
        faculty_user={profile.personal?.faculty || 'ไม่พบข้อมูล'}
        department_user={profile.personal?.department || 'ไม่พบข้อมูล'}
        numberPhone_user={profile.personal?.number_phone || 'ไม่พบข้อมูล'}
        email_user={profile.personal?.email || 'ไม่พบข้อมูล'}
        image_user={profile.personal?.image_user || ""}
      />
    </div>
  );
}

export default ProfilePage;

