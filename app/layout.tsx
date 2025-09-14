"use client";
import FooterPage from "@/components/FooterPage";
import "./globals.css";
import HeaderPage from "@/components/HeaderPage";
import { usePathname } from 'next/navigation'
import Navbar from "@/components/navigations/Navbar";


const RootLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  const pathname = usePathname();

  const userType = 'teacher'; // เปลี่ยนเป็น 'teacher' , 'staff' 'admin' ตามที่ต้องการ

  const login:boolean = true; // เปลี่ยนเป็น true เพื่อแสดง Navbar

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen"> 
        <header>
          {pathname !== '/login' && <HeaderPage />}

          {login === true && pathname !== '/login' && (
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