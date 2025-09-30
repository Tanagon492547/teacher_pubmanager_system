"use client"
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form";

type UserForm = {
title: string;
firstName: string;
lastName: string;
gender: string;
position: string;
faculty: string;
department: string;
email: string;
username: string;
password: string;
role: string;
 age?: number;
};

const UserManagement: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserForm>();
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const onSubmit = async (data: UserForm) => {
    setLoading(true)
    try {
      // map form to API fields expected by /api/users
      const payload = {
        username: data.username,
        password: data.password,
        user_name: `${data.firstName} ${data.lastName}`,
        user_fame: data.title,
        user_typeid: data.role === 'admin' ? 1 : data.role === 'staff' ? 2 : 3,
        age: data.age ?? null
      }
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'Failed to create user')
  alert('บันทึกข้อมูลสำเร็จ')
  router.push('/usermanagement')
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // validate file type and size (<=2MB)
      const allowed = ['image/jpeg', 'image/png']
      if (!allowed.includes(file.type)) {
        alert('รองรับไฟล์ JPG/PNG เท่านั้น')
        return
      }
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        alert('ขนาดไฟล์ต้องไม่เกิน 2MB')
        return
      }
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Title + subtitle */}
          <div className="md:col-span-3">
            <h1 className="text-2xl font-semibold text-slate-800">User Management</h1>
            <p className="text-sm text-slate-500">สร้างบัญชีผู้ใช้ใหม่ — กรอกข้อมูลให้ครบแล้วกด ยืนยัน</p>
          </div>

          {/* Avatar / Image upload */}
          <div className="flex flex-col items-center gap-3 md:col-span-1">
            <div className="w-36 h-36 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400">ไม่มีรูป</div>
              )}
            </div>
            <label className="text-sm text-blue-600 cursor-pointer">
              เปลี่ยนรูป
              <input type="file" className="hidden" onChange={handleImageChange} />
            </label>
            <p className="text-xs text-slate-400 text-center">JPEG/PNG, ขนาดไม่เกิน 2MB</p>
          </div>

          {/* Form area */}
          <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <label className="block text-sm text-slate-700 mb-2">ประเภทผู้ใช้</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" value="admin" {...register("role")} />
                  <span className="text-sm">ผู้ตรวจสอบ</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" value="staff" {...register("role")} />
                  <span className="text-sm">เจ้าหน้าที่</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" value="teacher" {...register("role")} />
                  <span className="text-sm">อาจารย์</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-slate-600">คำนำหน้า</label>
                <select {...register("title")} className="mt-1 block w-full border rounded p-2 bg-white">
                  <option value="">เลือก</option>
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600">ชื่อ</label>
                <input {...register("firstName", { required: 'กรุณากรอกชื่อ' })} placeholder="ชื่อ" className="mt-1 block w-full border rounded p-2" />
                {errors.firstName && <p className="text-xs text-red-600">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="text-sm text-slate-600">นามสกุล</label>
                <input {...register("lastName", { required: 'กรุณากรอกนามสกุล' })} placeholder="นามสกุล" className="mt-1 block w-full border rounded p-2" />
                {errors.lastName && <p className="text-xs text-red-600">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-slate-600">เพศ</label>
                <select {...register("gender")} className="mt-1 block w-full border rounded p-2 bg-white">
                  <option value="">ไม่ระบุ</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600">อายุ</label>
                <input type="number" {...register('age', { valueAsNumber: true })} placeholder="อายุ" className="mt-1 block w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm text-slate-600">ตำแหน่งทางวิชาการ</label>
                <input {...register("position")} placeholder="ตำแหน่ง" className="mt-1 block w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm text-slate-600">คณะ</label>
                <input {...register("faculty")} placeholder="คณะ" className="mt-1 block w-full border rounded p-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600">สาขา/หน่วยงาน</label>
                <input {...register("department")} placeholder="สาขา/หน่วยงาน" className="mt-1 block w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Email</label>
                <input {...register("email", { required: 'กรุณากรอกอีเมล', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'รูปแบบอีเมลไม่ถูกต้อง' } })} placeholder="Email" type="email" className="mt-1 block w-full border rounded p-2" />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600">Username</label>
                <input {...register("username", { required: 'กรุณากรอกชื่อผู้ใช้', minLength: { value: 3, message: 'ต้องมีอย่างน้อย 3 ตัวอักษร' } })} placeholder="Username" className="mt-1 block w-full border rounded p-2" />
                {errors.username && <p className="text-xs text-red-600">{errors.username.message}</p>}
              </div>
              <div>
                <label className="text-sm text-slate-600">Password</label>
                <input {...register("password", { required: 'กรุณากรอกรหัสผ่าน', minLength: { value: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' } })} placeholder="Password" type="password" className="mt-1 block w-full border rounded p-2" />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="px-4 py-2 rounded border text-slate-700 bg-white" onClick={() => window.history.back()}>
                ยกเลิก
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>
                {loading ? 'กำลังบันทึก...' : 'ยืนยัน'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

