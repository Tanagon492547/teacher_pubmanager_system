"use client";
import PaginationFeature from "@/components/PaginationFeature";
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

type UserData = {
  userId: number;
  name: string;
  type: string;
  detail: string;
};

const UserManagement = () => {
  const pathName = usePathname();
  const router = useRouter();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debug Log 1: เช็คทุกครั้งที่ Component ถูกวาดใหม่
  console.log("Component is rendering...");

  useEffect(() => {
    // Debug Log 2: เช็คตอน useEffect ทำงาน
    console.log("useEffect triggered! This should happen only once (or twice in dev mode).");

    const fetchUsers = async () => {
      try {
        const data = await fetch('/api/user-all');
        if (!data.ok) {
          throw new Error(`API responded with status: ${data.status}`);
        }
        const fetchedUsers = await data.json();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    // Debug Log 3: ฟังก์ชันนี้จะทำงานตอน Component ถูกทำลาย
    return () => {
      console.log("Component is UNMOUNTING. If you see this, something is removing me.");
    };
  }, []); // <-- วงเล็บว่าง [] สำคัญมากๆ นะ!

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p className="text-xl">กำลังโหลดข้อมูลผู้ใช้...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-[var(--8xl)] flex flex-col justify-between items-center">
        <div className="w-full flex flex-col items-start my-5 gap-2">
          <p className="text-3xl">User Management</p>
          <p className="text-lg">จัดการบัญชีผู้ใช้</p>
        </div>
        <div className="w-full flex flex-row gap-5 mb-10">
          <button className="btn btn-success gap-1" onClick={()=>{router.push('/createuser');}}>สร้างบัญชีผู้ใช้ <i className="fa-solid fa-plus"></i> </button>
          <div className="w-xs">
            <form action="" className="w-full relative">
              <button type="submit" className="btn btn-ghost absolute z-99 end-0"><i className="fa-solid fa-magnifying-glass"></i></button>
              <input type="text" placeholder="ค้นหาผู้ใช้" className="input input-neutral pr-15 absolute z-0 w-full" />
            </form>
          </div>
        </div>

        <div className="w-full min-h-screen border-2 border-[var(--color-border)]/20 rounded-2xl p-5">
          <p className="text-xl pl-4">บัญผู้ใช้ทั้งหมด</p>
          <PaginationFeature pathName={pathName} mockData={users} rowsValue={11} />
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
