'use client'
import React, { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { addArticle } from '@/hooks/posts/actions';
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

// สร้าง Type สำหรับข้อมูลในฟอร์มของเรา
type FormValues = {
  article_name: string;
  article_type: string;
  published_year: string;
  abstract: string;
  author_academic_title: string;
  author_firstname: string;
  author_lastname: string;
  coAuthors: {
    academic_title: string;
    firstname: string;
    lastname: string;
  }[];
  rights: 'public' | 'private';
  article_file: FileList;
};

// --- ไอคอนสำหรับปุ่มต่างๆ (SVG) ---
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg>);
const UploadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-gray-400" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" /><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" /></svg>);


const AddArticleFeature =  () => {
  const router = useRouter();
  const [fileName, setFileName] = useState('');
  const prisma = new PrismaClient();
  // 1. ตั้งค่า react-hook-form
  const { register, handleSubmit, control, watch, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      coAuthors: [], // เริ่มต้นให้ผู้ร่วมเขียนเป็น array ว่างๆ
      rights: 'public',
    }
  });

  // 2. ตั้งค่า useFieldArray สำหรับจัดการผู้ร่วมเขียน
  const { fields, append, remove } = useFieldArray({
    control,
    name: "coAuthors"
  });

  // 3. ใช้ watch เพื่อคอยดูค่าของ "สิทธิ์การเผยแพร่"
  const publishPermission = watch('rights');

  // 4. ฟังก์ชันที่จะทำงานเมื่อกด Submit
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // สร้าง FormData ขึ้นมาใหม่เพื่อส่งไปให้ Server Action
    const formData = new FormData();

    // 5. ใส่ข้อมูลทั้งหมดลงใน FormData
    formData.append('article_name', data.article_name);
    formData.append('article_type', data.article_type);
    formData.append('published_year', data.published_year);
    formData.append('abstract', data.abstract);
    formData.append('author_academic_title', data.author_academic_title);
    formData.append('author_firstname', data.author_firstname);
    formData.append('author_lastname', data.author_lastname);
    formData.append('rights', data.rights);

    // แปลง array ของผู้ร่วมเขียนให้เป็น JSON string แล้วค่อยส่งไป
    formData.append('coAuthors', JSON.stringify(data.coAuthors));

    // ใส่ไฟล์ลงไป (ถ้ามี)
    if (data.rights === 'public' && data.article_file.length > 0) {
      formData.append('article_file', data.article_file[0]);
    }

    // 6. เรียกใช้ Server Action!
    await addArticle(formData);
  };

  const userIdCookie = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
  if (!userIdCookie) return null; // ถ้าไม่มีบัตร ก็กลับไปมือเปล่า
  console.log("cookie : ", userIdCookie)
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full my-5 flex item-center justify-center">
      <div className="space-y-10">
        {/* Section 1: Article Details */}
        <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">รายละเอียดบทความ</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

            <div className="sm:col-span-6">
              <label htmlFor="article_name" className="block text-sm font-medium text-gray-700">ชื่อบทความ <span className="text-red-500">*</span></label>
              <div className="mt-1"><input {...register("article_name")} id="article_name" type="text" className="input input-bordered w-full" required /></div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="article_type" className="block text-sm font-medium text-gray-700">ประเภทงาน <span className="text-red-500">*</span></label>
              <div className="mt-1">
                <select {...register("article_type")} id="article_type" className="select select-bordered w-full" required defaultValue="">
                  <option value="" disabled>— เลือกประเภทงาน —</option>
                  <option value="บทความวิจัย ระดับประเทศ">บทความวิจัย ระดับประเทศ</option>
                  <option value="บทความวิจัย ระดับสากล">บทความวิจัย ระดับสากล</option>
                  <option value="บทความประชุมวิชาการ ระดับประเทศ">บทความประชุมวิชาการ ระดับประเทศ</option>
                  <option value="บทความประชุมวิชาการ ระดับสากล">บทความประชุมวิชาการ ระดับสากล</option>
                  <option value="บทความทบทวน ระดับประเทศ">บทความทบทวน ระดับประเทศ</option>
                  <option value="บทความทบทวน ระดับประเทศ">บทความทบทวน ระดับสากล</option>
                  <option value="other">อื่น ๆ</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="published_year" className="block text-sm font-medium text-gray-700">วัน/เดือน/ปี ที่ตีพิมพ์ <span className="text-red-500">*</span></label>
              <div className="mt-1"><input {...register("published_year")} id="published_year" type="date" className="input input-bordered w-full" required /></div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">บทคัดย่อ <span className="text-red-500">*</span></label>
              <div className="mt-1"><textarea {...register("abstract")} id="abstract" className="textarea textarea-bordered w-full min-h-36" required /></div>
            </div>
          </div>
        </div>

        {/* Section 2: Author Details */}
        <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">ข้อมูลผู้เขียน</h2>
          <div className="mt-6 space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700">อาจารย์เจ้าของบทความ <span className="text-red-500">*</span></label>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input {...register("author_academic_title")} placeholder="ตำแหน่งทางวิชาการ" className="input input-bordered w-full" required />
                <input  {...register("author_firstname")} placeholder="ชื่อ" className="input input-bordered w-full" required />
                <input  {...register("author_lastname")} placeholder="นามสกุล" className="input input-bordered w-full" required />
              </div>
            </div>

            {/* ผู้ร่วมบทความ (Dynamic) */}
            {fields.map((field, index) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700">ผู้ร่วมบทความ #{index + 1}</label>
                <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <input {...register(`coAuthors.${index}.academic_title`)} placeholder="ตำแหน่งทางวิชาการ" className="input input-bordered w-full" />
                  <input {...register(`coAuthors.${index}.firstname`)} placeholder="ชื่อ" className="input input-bordered w-full" />
                  <div className="flex items-center gap-2">
                    <input {...register(`coAuthors.${index}.lastname`)} placeholder="นามสกุล" className="input input-bordered w-full" />
                    <button type="button" onClick={() => remove(index)} className="btn btn-ghost btn-square text-red-500"><TrashIcon /></button>
                  </div>
                </div>
              </div>
            ))}

            <div><button type="button" onClick={() => append({ academic_title: "", firstname: "", lastname: "" })} className="btn btn-ghost mt-2 gap-2 text-blue-600"><PlusIcon />เพิ่มผู้ร่วมบทความ</button></div>
          </div>
        </div>

        {/* Section 3: Publishing */}
        <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">การเผยแพร่</h2>
          <div className="mt-6 space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700">สิทธิ์ในการเผยแพร่บทความ</label>
              <div className="mt-2 flex items-center gap-x-6">
                <label className="label cursor-pointer gap-2"><input type="radio" {...register("rights")} value="public" className="radio radio-primary" /><span className="label-text">เผยแพร่ (Public)</span></label>
                <label className="label cursor-pointer gap-2"><input type="radio" {...register("rights")} value="private" className="radio" /><span className="label-text">ไม่เผยแพร่ (Private)</span></label>
              </div>
            </div>

            <div className={`transition-opacity duration-300 ${publishPermission === 'private' ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <label className="block text-sm font-medium text-gray-700">อัปโหลดไฟล์บทความ {publishPermission === 'public' && <span className="text-red-500">*</span>}</label>
              <label className={`mt-1 w-full ${publishPermission === 'private' ? 'pointer-events-none' : 'cursor-pointer'}`}>
                <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50">
                  <UploadIcon />
                  <span className="text-sm text-gray-600">{fileName || 'ลากและวางไฟล์ที่นี่ หรือคลิกเพื่อเลือกไฟล์'}</span>
                  <p className="text-xs text-gray-500">รองรับไฟล์ .PDF</p>
                  <input
                    {...register("article_file", {
                      onChange: (e) => setFileName(e.target.files[0]?.name || '')
                    })}
                    type="file" className="hidden" accept=".pdf"
                    disabled={publishPermission === 'private'}
                    required={publishPermission === 'public'}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end">
          <button type="button" onClick={() => router.back()} className="btn btn-ghost sm:w-40">ยกเลิก</button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary sm:w-40">
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกบทความ'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default AddArticleFeature;