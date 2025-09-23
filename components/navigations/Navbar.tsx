'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import Link from "next/link";

type props = {
  userType?: string,
  user_id?: string,
}

const Navbar = ({userType, user_id}:props) => {
  const pathname = usePathname()
  return (
    <div className="w-full h-16  flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-(--8xl) flex flex-col">
        <div role="tablist" className="tabs tabs-border">
          <Link href='/' role="tab" id='tab-navbarmanu' className={`tab  p-0   ${ pathname === '/' ? 'tab-active' : ''} `}>หน้าหลัก</Link>
          {userType === 'teacher' && (
            <Link  href={`/articlemanagement/${user_id}`} role="tab" className={`tab ${pathname.startsWith('/articlemanagement') ? 'tab-active' : ''}`}>บทความของฉัน</Link>
          )}
          {userType === 'staff' && (
            <Link href='/articlevalidation' role="tab" className={`tab  ${ pathname === '/articlevalidation' ? 'tab-active' : ''}`}>ตรวจสอบบทความ</Link>
          )}
          {userType === 'admin' && (
            <Link href='/usermanagement' role="tab" className={`tab  ${ pathname === '/usermanagement' ? 'tab-active' : ''}`}>จัดการบัญชีผู้ใช้</Link>
          )}
          <Link href='/myhistory' role="tab" className={`tab  ${ pathname === '/myhistory' ? 'tab-active' : ''}`}>ประวัติบทความ</Link>
          <Link href='/manual' role="tab" className={`tab  ${ pathname === '/manual' ? 'tab-active' : ''}`}>คู่มือ</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;