"use client";
import FooterPage from "@/components/FooterPage";
import "./globals.css";
import HeaderPage from "@/components/HeaderPage";
import { usePathname } from 'next/navigation'
import Navbar from "@/components/navigations/Navbar";


const RootLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  const pathname = usePathname();

<<<<<<< HEAD
  const login = true; // เปลี่ยนเป็น true เพื่อแสดง Navbar
=======
  const userType = 'teacher'; // เปลี่ยนเป็น 'teacher' , 'staff' 'admin' ตามที่ต้องการ

  const login:boolean = true; // เปลี่ยนเป็น true เพื่อแสดง Navbar
>>>>>>> 4c130011624d89a976c4f094f1f803811d5d2212

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