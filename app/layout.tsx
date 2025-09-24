"use client";
import FooterPage from "@/components/FooterPage";
import "./globals.css";
import HeaderPage from "@/components/HeaderPage";
import { usePathname } from 'next/navigation'
import Navbar from "@/components/navigations/Navbar";
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  const pathname = usePathname();

  const [userType, setUserType] = useState<'teacher' | 'staff' | 'admin' | 'guest'>('guest')
  const [login, setLogin] = useState<boolean>(false)
  const [userId, setUserId] = useState('');
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // ถ้าเลื่อนจอลงไปมากกว่า 380px...
      if (window.scrollY > 100) {
        setShowNavbar(true); // ...ก็ให้แสดง Navbar
      } else {
        setShowNavbar(false); // ...ถ้าน้อยกว่า ก็ให้ซ่อน
      }
    };
    window.addEventListener('scroll', handleScroll);

    // read saved userId after login
    const id = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    if (!id) {
      setLogin(false)
      setUserType('guest')
      return
    }

    // fetch user to determine type
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`)
        if (!res.ok) throw new Error('No user')
        const data = await res.json()
        const typeName = data?.personal?.user_type?.user_typename || data?.personal?.user_fame || 'teacher'
        // map to normalized types
        if (typeName.toLowerCase().includes('admin')) setUserType('admin')
        else if (typeName.toLowerCase().includes('staff')) setUserType('staff')
        else {
          setUserType('teacher')
          setUserId(id)
        }
        setLogin(true)
      } catch (err) {
        setLogin(false)
        setUserType('guest')
      }
    }

    fetchUser()

    // react to changes in other tabs or when other code dispatches 'userChanged'
    const handler = () => {
      const id2 = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (!id2) {
        setLogin(false)
        setUserType('guest')
        return
      }
      fetchUser()
    }

    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'userId') handler()
    }

    window.addEventListener('storage', storageHandler)
    window.addEventListener('userChanged', handler)
    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('userChanged', handler);
      window.removeEventListener('scroll', handleScroll);
    }
  }, [/* runs once on mount */])

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">

        <header>
          {pathname !== '/login' && <HeaderPage />}

          {login === true && pathname !== '/login' && (
            <>
              <Navbar userType={userType} user_id={userId} />
              <div className='w-full h-px bg-primary' />
            </>
          )}
        </header>
        <AnimatePresence>
          {showNavbar && ( // <-- ถ้า showNavbar เป็น true, ก็จะแสดง motion.nav
            <motion.nav
              className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg" // ทำให้ Navbar ลอยอยู่ข้างบนสุดเสมอ
              initial={{ y: -100, opacity: 0 }} // เริ่มต้น: ซ่อนอยู่นอกจอด้านบน
              animate={{ y: 0, opacity: 1 }}     // ตอนแสดงผล: เลื่อนลงมาที่ตำแหน่งปกติ
              exit={{ y: -100, opacity: 0 }}      // ตอนหายไป: เลื่อนกลับขึ้นไปซ่อน
              transition={{ duration: 0.3 }}
            >
              <Navbar userType={userType} user_id={userId} />
            </motion.nav>
          )}
        </AnimatePresence>
        <main className="grow">
          {children}
        </main>

        {pathname !== '/login' && <FooterPage />}
      </body>
    </html>
  );
}

export default RootLayout;