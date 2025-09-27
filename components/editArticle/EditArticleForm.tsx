"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import type { ArticleDB, Contributor } from '@prisma/client'; // Import Type จาก Prisma
import { updateArticle } from '@/hooks/posts/actions';

// --- ไอคอน (เหมือนเดิม) ---
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg> );
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg> );
const UploadIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-gray-400" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/></svg> );

// **ส่วนสำคัญ!** สร้าง Type ที่มีข้อมูล Article และ Contributor ซ้อนกันอยู่
type ArticleWithContributor = ArticleDB & {
  contributor: Contributor | null;
};

// Type สำหรับข้อมูลในฟอร์ม (ให้ครบทุกช่อง!)
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

// Component ของเราจะรับ 'article' ที่มีข้อมูล Contributor มาด้วย
const EditArticleFeature = ({ article }: { article: ArticleWithContributor }) => {
  const router = useRouter();
  const [fileName, setFileName] = useState(article.article_file || '');
  const [serverError, setServerError] = useState<string | null>(null);

  // แยกชื่อ-นามสกุลของผู้เขียนหลัก
  const [mainAuthorFirstname, mainAuthorLastname] = article.contributor?.contributor_name.split(' ') ?? ['', ''];

  const { register, handleSubmit, control, watch, formState: { isSubmitting, isDirty } } = useForm<FormValues>({
    // **หัวใจของการแสดงผล!** เติมข้อมูลเก่าทั้งหมดลงในฟอร์ม
    defaultValues: {
      article_name: article.article_name,
      article_type: article.articleType || '',
      published_year: article.published_year ? new Date(article.published_year, 0, 2).toISOString().split('T')[0] : '',
      abstract: article.abstract || '',
      author_academic_title: article.contributor?.academic_title || '',
      author_firstname: mainAuthorFirstname,
      author_lastname: mainAuthorLastname,
      coAuthors: [], // **หมายเหตุ:** ส่วนนี้ยังไม่ได้ดึงข้อมูล co-author เก่ามาแสดงนะ เพราะ Schema ของเรายังไม่รองรับจ้ะ
      rights: article.publish_status as 'public' | 'private' || 'private',
    }
  });
  
  // **ส่วนที่เพิ่มเข้ามา!** //
  // ใช้ useFieldArray เพื่อจัดการผู้ร่วมเขียน
  const { fields, append, remove } = useFieldArray({ control, name: "coAuthors" });
  const publishPermission = watch('rights');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
      setServerError(null);
      const formData = new FormData();
      
      // ใส่ข้อมูลทั้งหมดที่อาจมีการแก้ไขลงใน formData
      formData.append('article_name', data.article_name);
      formData.append('article_type', data.article_type);
      formData.append('published_year', data.published_year);
      formData.append('abstract', data.abstract);
      formData.append('rights', data.rights);
      
      // **ส่วนที่เพิ่มเข้ามา!** //
      // แปลงข้อมูลผู้ร่วมเขียนเป็น JSON string แล้วส่งไปด้วย
      formData.append('coAuthors', JSON.stringify(data.coAuthors));
      
      if (data.article_file.length > 0) {
          formData.append('article_file', data.article_file[0]);
      }
      
      const result = await updateArticle(article.id, formData);
      if (result?.error) {
          setServerError(result.error);
      }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full my-5 flex items-center justify-center">
      <div className="space-y-10 w-full">
        {/* Section 1: Article Details (ฉบับเต็ม!) */}
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
                  <select {...register("article_type")} id="article_type" className="select select-bordered w-full" required>
                    <option value="" disabled>— เลือกประเภทงาน —</option>
                    <option value="บทความวิจัย ระดับประเทศ">บทความวิจัย ระดับประเทศ</option>
                    <option value="บทความวิจัย ระดับสากล">บทความวิจัย ระดับสากล</option>
                    <option value="บทความประชุมวิชาการ ระดับประเทศ">บทความประชุมวิชาการ ระดับประเทศ</option>
                    <option value="บทความประชุมวิชาการ ระดับสากล">บทความประชุมวิชาการ ระดับสากล</option>
                    <option value="บทความทบทวน ระดับประเทศ">บทความทบทวน ระดับประเทศ</option>
                    <option value="บทความทบทวน ระดับสากล">บทความทบทวน ระดับสากล</option>
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
                <label className="block text-sm font-medium text-gray-700">อาจารย์เจ้าของบทความ (ไม่สามารถแก้ไขได้)</label>
                <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input {...register("author_academic_title")} className="input input-bordered w-full bg-gray-100" readOnly />
                  <input {...register("author_firstname")} className="input input-bordered w-full bg-gray-100" readOnly />
                  <input {...register("author_lastname")} className="input input-bordered w-full bg-gray-100" readOnly />
                </div>
              </div>
              
              {/* **ส่วนที่เพิ่มเข้ามา!** ผู้ร่วมบทความ (Dynamic) */}
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
                 <label className="block text-sm font-medium text-gray-700">อัปโหลดไฟล์บทความใหม่ (ถ้าต้องการเปลี่ยน)</label>
                 <label className={`mt-1 w-full ${publishPermission === 'private' ? 'pointer-events-none' : 'cursor-pointer'}`}>
                   <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50">
                     <UploadIcon />
                     <span className="text-sm text-gray-600">{fileName || 'ลากและวางไฟล์ที่นี่ หรือคลิกเพื่อเลือกไฟล์'}</span>
                     <p className="text-xs text-gray-500">รองรับไฟล์ .PDF</p>
                     <input 
                      {...register("article_file", { onChange: (e) => setFileName(e.target.files?.[0]?.name || '') })}
                      type="file" className="hidden" accept=".pdf" 
                      disabled={publishPermission === 'private'}
                     />
                   </div>
                 </label>
               </div>
             </div>
          </div>

          {serverError && ( <div className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-100 text-center">{serverError}</div> )}
          
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end">
            <button type="button" onClick={() => router.back()} className="btn btn-ghost sm:w-40">ยกเลิก</button>
            <button type="submit" disabled={isSubmitting || !isDirty} className="btn btn-primary sm:w-40">
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </div>
    </form>
  );
};

export default EditArticleFeature;

