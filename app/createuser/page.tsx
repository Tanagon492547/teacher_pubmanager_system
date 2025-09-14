"use client"
import React, { useState } from "react";
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
};

const UserManagement: React.FC = () => {
const { register, handleSubmit } = useForm<UserForm>();
const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = (data: UserForm) => {
    console.log("Form Data:", data);
    alert("บันทึกข้อมูลสำเร็จ");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-(--8xl) flex flex-col justify-between items-center">
        <div className="w-full flex flex-col">
          <p className="text-4xl font-bold text-(--color-base-herder-content) ">
            User Management
          </p>
          <p className="text-(--color-base-herder-content)">สร้างบัญชีผู้ใช้ใหม่</p>
        </div>


        {/* Upload รูป */}
<div className="flex flex-col items-center mb-6">
  {/* วงกลมแสดงรูป */}
  <label className="w-32 h-32 border rounded-full flex items-center justify-center overflow-hidden bg-blue-100 cursor-pointer">
    {preview ? (
      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
    ) : (
      <span className="text-gray-500">ไม่มีรูป</span>
    )}
    <input type="file" className="hidden" onChange={handleImageChange} />
  </label>

  {/* ปุ่มเพิ่มรูปอยู่นอกวงกลม */}
  <label className="mt-3 cursor-pointer transition">
    เพิ่มรูป
    <input type="file" className="hidden" onChange={handleImageChange} />
  </label>
</div>

      {/* ประเภทผู้ใช้ */}
      <form onSubmit={handleSubmit(onSubmit)} >
      <div className="bg-blue-100 w-full p-4 rounded-xl  flex justify-between my-5">
        <div>
            <p>ประเภทผู้ใช้</p>
        </div>
        <div className="flex gap-5">
          <label className="flex items-center gap-1">
          <input type="radio" value="admin" {...register("role")} /> แอดมิน
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" value="staff" {...register("role")} /> เจ้าหน้าที่
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" value="teacher" {...register("role")} /> อาจารย์
        </label>
        </div>
      </div>
      
      <div className="bg-blue-100 w-full p-4 rounded-xl space-y-3">
        <p>รายละเอียดทั่วไป</p>
        <hr />
        <div className="flex gap-2">
          <div>
            <p>คำนำหน้า</p>
          <select {...register("title")} className="border rounded p-2 w-25">
            <option value="" selected>คำนำหน้า</option>
            <option value="นาย">นาย</option>
            <option value="นาง">นาง</option>
            <option value="นางสาว">นางสาว</option>
          </select>
          </div>
          <div>
            <p>ชื่อ</p>
          <input
            {...register("firstName")}
            placeholder="ชื่อ"
            className="border rounded p-2 flex-1 w-150"
          />
          </div>
          <div>
            <p>นามสกุล</p>
          <input
            {...register("lastName")}
            placeholder="นามสกุล"
            className="border rounded p-2 flex-1 w-150"
          />
          </div>
        </div>

        <div>
          <p>เพศ</p>
        <select {...register("gender")} className="border rounded p-2 w-25">
          <option value="">เพศ</option>
          <option value="ชาย">ชาย</option>
          <option value="หญิง">หญิง</option>
        </select>
        </div>

        <div>
          <p>ตำแหน่งทางวิชาการ</p>
        <input
          {...register("position")}
          placeholder="ตำแหน่งทางวิชาการ"
          className="border rounded p-2 w-full"
        />
        </div>
        <div>
          <p>คณะ</p>
        <input
          {...register("faculty")}
          placeholder="คณะ"
          className="border rounded p-2 w-full"
        />
        </div>
        <div>
          <p>สาขา/หน่วยงาน</p>
        <input
          {...register("department")}
          placeholder="สาขา/หน่วยงาน"
          className="border rounded p-2 w-full"
        />
        </div>
        <div>
          <p>Email</p>
        <input
          {...register("email")}
          placeholder="Email"
          type="email"
          className="border rounded p-2 w-full"
        />
        </div>
        <div>
          <p>Username</p>
        <input
          {...register("username")}
          placeholder="Username"
          className="border rounded p-2 w-full"
        />
        </div>
        <div>
          <p>Password</p>
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="border rounded p-2 w-full"
        />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded">
            ยกเลิก
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            ยืนยัน
          </button>
        </div>
      </div>
      </form>
      </div>


    </div>
    


  );
};

export default UserManagement;

