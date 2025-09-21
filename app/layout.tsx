"use client";
import FooterPage from "@/components/FooterPage";
import "./globals.css";
import HeaderPage from "@/components/HeaderPage";
import { usePathname } from 'next/navigation'
import Navbar from "@/components/navigations/Navbar";
import { useEffect, useState } from 'react'


const RootLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  const pathname = usePathname();

<<<<<<< HEAD
  const [userType, setUserType] = useState<'teacher'|'staff'|'admin'|'guest'>('guest')
=======
  const [userType, setUserType] = useState<'teacher' | 'staff' | 'admin' | 'guest'>('guest')
>>>>>>> 20cfc0cd9e82cc26646a638e8f7db8faa2ff011d
  const [login, setLogin] = useState<boolean>(false)

  useEffect(() => {
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
<<<<<<< HEAD
  const data = await res.json()
  const typeName = data?.personal?.user_type?.user_typename || data?.personal?.user_fame || 'teacher'
=======
        const data = await res.json()
        const typeName = data?.personal?.user_type?.user_typename || data?.personal?.user_fame || 'teacher'
>>>>>>> 20cfc0cd9e82cc26646a638e8f7db8faa2ff011d
        // map to normalized types
        if (typeName.toLowerCase().includes('admin')) setUserType('admin')
        else if (typeName.toLowerCase().includes('staff')) setUserType('staff')
        else setUserType('teacher')
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
      window.removeEventListener('storage', storageHandler)
      window.removeEventListener('userChanged', handler)
    }
  }, [/* runs once on mount */])

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