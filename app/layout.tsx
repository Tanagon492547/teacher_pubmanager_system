"use client";
import FooterPage from "@/components/FooterPage";
import "./globals.css";
import HeaderPage from "@/components/HeaderPage";
import { usePathname } from 'next/navigation'
import Navbar from "@/components/navigations/Navbar";
import { useEffect } from "react";


const RootLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  const pathname = usePathname();
  const userType = 'admin'; // เปลี่ยนเป็น 'teacher' , 'staff' 'admin' ตามที่ต้องการ

  const login = true; // เปลี่ยนเป็น true เพื่อแสดง Navbar

  useEffect(() => {
    document.documentElement.classList.add('light');
  }, []);

  return (
    <html lang="en">
      <body>
        
        {pathname !== '/login' && <HeaderPage />}

        {login === true && pathname !== '/login' && (
          <>
            <Navbar userType={userType} />
            <div className='w-full h-2 bg-(--color-primary) flex justify-center items-center'>
              <hr className="border-t border-(--color-primary) w-full h-full mt-2" />
            </div>
          </>)}
        

        
        {children}

        {pathname !== '/login' && <FooterPage />}
        
      </body>
    </html>
  );
}

export default RootLayout;