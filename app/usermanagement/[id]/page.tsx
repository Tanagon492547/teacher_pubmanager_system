"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

type Form = {
  username: string
  password: string
  user_name: string
  user_fame: string
  user_typeid?: string
  age?: number
}

const EditUserPage: React.FC = () => {
  const router = useRouter()
  const params = useParams() as { id?: string }
  const id = Number(params?.id)
  const { register, handleSubmit, reset } = useForm<Form>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        // map fields (user_type is nested under personal.user_type)
        reset({
          username: json.username,
          password: json.password,
          user_name: json.personal?.user_name || '',
          user_fame: json.personal?.user_fame || '',
          user_typeid: json.personal?.user_type?.id ? String(json.personal.user_type.id) : '',
          age: json.personal?.age ?? undefined
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(message)
      }
    }
    fetchUser()
  }, [id, reset])

  const onSubmit = async (data: Form) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        user_typeid: data.user_typeid ? Number(data.user_typeid) : undefined
      }
      // debug
      // eslint-disable-next-line no-console
      console.log('PUT payload', payload)
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to save')
      alert('บันทึกสำเร็จ')
      router.push('/usermanagement')
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      alert(message || 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    if (!confirm('ยืนยันการลบผู้ใช้นี้หรือไม่?')) return
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      alert('ลบสำเร็จ')
      router.push('/usermanagement')
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      alert(message || 'ไม่สามารถลบได้')
    }
  }

  return (
    <div className="min-h-screen p-6 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">แก้ไขผู้ใช้</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm">Username</label>
              <input {...register('username', { required: 'กรุณากรอกชื่อผู้ใช้' })} className="w-full border rounded p-2 mt-1" />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <input {...register('password', { required: 'กรุณากรอกรหัสผ่าน' })} className="w-full border rounded p-2 mt-1" />
            </div>
          <div>
            <label className="text-sm">ชื่อ-สกุล</label>
            <input {...register('user_name')} className="w-full border rounded p-2 mt-1" />
          </div>
          <div>
            <label className="text-sm">คำนำหน้า</label>
            <input {...register('user_fame')} className="w-full border rounded p-2 mt-1" />
          </div>
          <div>
            <label className="text-sm">ประเภทผู้ใช้</label>
            <select {...register('user_typeid')} className="w-full border rounded p-2 mt-1">
              <option value="">เลือกประเภท</option>
              <option value="1">ผู้ตรวจสอบ</option>
              <option value="2">เจ้าหน้าที่</option>
              <option value="3">อาจารย์</option>
            </select>
          </div>
          <div>
            <label className="text-sm">อายุ</label>
            <input type="number" {...register('age')} className="w-full border rounded p-2 mt-1" />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => router.push('/usermanagement')} className="px-4 py-2 rounded border">ยกเลิก</button>
            <button type="button" onClick={onDelete} className="px-4 py-2 rounded bg-red-500 text-white">ลบ</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserPage
