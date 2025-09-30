"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

type Form = {
  title?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  position?: string;
  faculty?: string;
  department?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: string;
  age?: number;
  number_phone?: string;
  academic?: string;
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

        // Normalize personal fields into createuser-compatible names
        const personal = json.personal || {}
        const [firstName, ...rest] = (personal.user_name || '').split(' ')
        const lastName = rest.join(' ')

        reset({
          title: personal.user_fame || '',
          firstName: firstName || '',
          lastName: lastName || '',
          gender: personal.gender || '',
          position: personal.academic || '',
          faculty: personal.faculty || '',
          department: personal.department || '',
          email: personal.email || '',
          username: json.username || '',
          password: json.password || '',
          role: personal.user_type ? (personal.user_type.user_typename === 'Admin' ? 'admin' : personal.user_type.user_typename === 'เจ้าหน้าที่' ? 'staff' : 'teacher') : '',
          age: personal.age ?? undefined,
          number_phone: personal.number_phone || '',
          academic: personal.academic || ''
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
        username: data.username,
        password: data.password,
        user_name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        user_fame: data.title,
        userTypeId: data.role === 'admin' ? 1 : data.role === 'staff' ? 2 : 3,
        age: data.age ?? null,
        email: data.email,
        number_phone: data.number_phone,
        academic: data.academic,
        faculty: data.faculty,
        department: data.department
      }

      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to save')

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">คำนำหน้า</label>
              <select {...register('title')} className="mt-1 block w-full border rounded p-2 bg-white">
                <option value="">เลือก</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>
            <div>
              <label className="text-sm">ชื่อ</label>
              <input {...register('firstName')} className="w-full border rounded p-2 mt-1" />
            </div>
            <div>
              <label className="text-sm">นามสกุล</label>
              <input {...register('lastName')} className="w-full border rounded p-2 mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">เพศ</label>
              <select {...register('gender')} className="mt-1 block w-full border rounded p-2 bg-white">
                <option value="">ไม่ระบุ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>
            <div>
              <label className="text-sm">อายุ</label>
              <input type="number" {...register('age', { valueAsNumber: true })} className="w-full border rounded p-2 mt-1" />
            </div>
            <div>
              <label className="text-sm">ตำแหน่งทางวิชาการ</label>
              <input {...register('academic')} className="w-full border rounded p-2 mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">คณะ</label>
              <input {...register('faculty')} className="w-full border rounded p-2 mt-1" />
            </div>
            <div>
              <label className="text-sm">เบอร์โทรศัพท์</label>
              <input {...register('number_phone')} className="w-full border rounded p-2 mt-1" />
            </div>
            <div>
              <label className="text-sm">สาขา/หน่วยงาน</label>
              <input {...register('department')} className="w-full border rounded p-2 mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Email</label>
              <input {...register('email')} type="email" className="w-full border rounded p-2 mt-1" />
            </div>
            <div>
              <label className="text-sm">Username</label>
              <input {...register('username')} className="w-full border rounded p-2 mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Password</label>
              <input {...register('password')} className="w-full border rounded p-2 mt-1" />
            </div>
            <div>
              <label className="text-sm">ประเภทผู้ใช้</label>
              <select {...register('role')} className="w-full border rounded p-2 mt-1">
                <option value="">เลือก</option>
                <option value="admin">Admin</option>
                <option value="staff">เจ้าหน้าที่</option>
                <option value="teacher">อาจารย์</option>
              </select>
            </div>
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
