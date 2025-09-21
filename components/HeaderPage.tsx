"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const HeaderPage = () => {
  const [displayName, setDisplayName] = useState<string | null>(null)
  const router = useRouter()

  const loadUser = async () => {
    try {
      const id = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (!id) {
        setDisplayName(null)
        return
      }
      const res = await fetch(`/api/users/${id}`)
      if (!res.ok) {
        setDisplayName(null)
        return
      }
      const data = await res.json()
      const name = data?.personal?.user_name || data?.username || null
      setDisplayName(name)
    } catch (err) {
      setDisplayName(null)
    }
  }

  useEffect(() => {
    loadUser()
    const handler = () => loadUser()
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'userId') handler()
    }
    window.addEventListener('storage', storageHandler)
    window.addEventListener('userChanged', handler)
    return () => {
      window.removeEventListener('storage', storageHandler)
      window.removeEventListener('userChanged', handler)
    }
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem('userId')
      window.dispatchEvent(new Event('userChanged'))
    } catch (e) {
      // ignore
    }
    router.push('/login')
  }

  return (
    <div className="w-full h-18 flex justify-center items-center bg-(--color-primary) px-4">
      <div className="w-full max-w-(--8xl) flex justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <i className="fa-solid fa-graduation-cap text-4xl text-(--color-base-herder) "></i>
          <p className="text-(--color-base-herder)">ผลงานตีพิมพ์อาจารย์ PSU</p>
        </div>

        <div className="flex items-center gap-2">
          {displayName ? (
            <>
              <button className="btn btn-ghost rounded-lg" onClick={() => router.push('/proflie')}>
                <i className="fa-solid fa-user text-xl"></i>
                <span className="ml-2">{displayName}</span>
              </button>

              <button aria-label="Logout" title="Logout" onClick={handleLogout} className="btn btn-ghost rounded-lg">
                <i className="fa-solid fa-right-from-bracket text-xl"></i>
              </button>
            </>
          ) : (
            <button className="btn btn-success rounded-lg " onClick={() => router.push('/login')}>
              <i className="fa-solid fa-user text-xl"></i>
              <p className="text-success-content"> เข้าสู่ระบบ</p>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeaderPage