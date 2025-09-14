"use client";
import FooterPage from "@/components/FooterPage";
import "./globals.css";
import HeaderPage from "@/components/HeaderPage";
import { usePathname } from 'next/navigation'
import Navbar from "@/components/navigations/Navbar";


const RootLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  const pathname = usePathname();
  const userType = 'admin'; // เปลี่ยนเป็น 'teacher' , 'staff' 'admin' ตามที่ต้องการ

<<<<<<< HEAD
  const login: boolean = false; // เปลี่ยนเป็น true เพื่อแสดง Navbar
=======
  const login = true; // เปลี่ยนเป็น true เพื่อแสดง Navbar
>>>>>>> eac7e14 (fertrue-createuser สร้างบัญชีผู้ใช้ใหม่)

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen"> 
        <header>
          {pathname !== '/login' && <HeaderPage />}

          {login && pathname !== '/login' && (
            <>
              <Navbar userType={userType} />
              <div className='w-full h-px bg-primary' /> 
            </>
          )}
        </header>

        <main className="grow">
          {children}
        </main>
        
        {pathname !== '/login' && <FooterPage />}
      </body>
    </html>
  );
}

export default RootLayout;