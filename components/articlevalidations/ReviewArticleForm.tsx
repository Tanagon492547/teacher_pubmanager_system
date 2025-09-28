"use client";
import React, { useState } from 'react';
import { reviewArticle } from '@/hooks/posts/actions';

type Article = {
  id: number;
  article_name: string;
  articleType: string | null;
  published_year: number | null;
  abstract: string | null;
  publish_status: string | null;
  article_status: string | null;
  article_file: string | null;
  contributor?: { contributor_name: string; academic_title: string | null } | null;
};

interface Props {
  article: Article;
}

const ReviewArticleForm: React.FC<Props> = ({ article }) => {
  const [rights, setRights] = useState(article.publish_status || 'private');
  const [fileName, setFileName] = useState<string>(article.article_file ? article.article_file.split('/').pop() || '' : '');
  const [comment, setComment] = useState('');
  // loading state: 'approved' | 'revision'
  const [loading, setLoading] = useState<'approved' | 'revision' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const contributorTitle = article.contributor?.academic_title || 'อ.';
  const [firstname, lastname] = (article.contributor?.contributor_name || '').split(' ');

  async function handleSubmit(status: 'approved' | 'revision') {
    setLoading(status);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('status', status);
      formData.append('rights', rights);
      formData.append('comment', comment);
      const fileInput = document.getElementById('article_file') as HTMLInputElement | null;
      if (fileInput?.files && fileInput.files.length > 0) {
        formData.append('article_file', fileInput.files[0]);
      }
      const result = await reviewArticle(article.id, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(status === 'approved' ? 'อนุมัติบทความสำเร็จ' : 'ส่งกลับเพื่อแก้ไขสำเร็จ');
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white border rounded-2xl p-10 space-y-10">
        {/* Section: Author */}
  <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-1">อาจารย์เจ้าของบทความ</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input value={contributorTitle} readOnly className="input input-bordered bg-gray-100" />
                <input value={firstname || ''} readOnly className="input input-bordered bg-gray-100" />
                <input value={lastname || ''} readOnly className="input input-bordered bg-gray-100" />
              </div>
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-1">ผู้ร่วมบทความ</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input placeholder="อ." className="input input-bordered" />
                <input placeholder="ชื่อ" className="input input-bordered" />
                <input placeholder="นามสกุล" className="input input-bordered" />
              </div>
              <button type="button" className="btn btn-ghost mt-2 text-blue-600"><i className="fa-solid fa-circle-plus" /> เพิ่มผู้ร่วมบทความ</button>
            </div>
          </div>
        </div>

        {/* Section: Article Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">ชื่อผลงาน <span className="text-red-500">*</span></label>
            <input defaultValue={article.article_name} className="input input-bordered w-full" readOnly />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">ประเภทงาน <span className="text-red-500">*</span></label>
              <select defaultValue={article.articleType || ''} className="select select-bordered w-full" disabled>
                <option>{article.articleType || '—'}</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">ตำแหน่งอาจารย์ <span className="text-red-500">*</span></label>
              <input value={contributorTitle} readOnly className="input input-bordered w-full bg-gray-100" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">วัน เดือน ปี <span className="text-red-500">*</span></label>
              <input type="date" defaultValue={article.published_year ? `${article.published_year}-01-01` : ''} className="input input-bordered w-full" readOnly />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">บทคัดย่อ</label>
            <textarea defaultValue={article.abstract || ''} className="textarea textarea-bordered w-full min-h-40" readOnly />
          </div>
        </div>

        {/* Section: Rights & Upload */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">สิทธิ์ในการเผยแพร่บทความ</label>
            <div className="mt-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" className="radio radio-primary" value="public" checked={rights === 'public'} onChange={() => setRights('public')} />
                <span>เผยแพร่ (Public)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" className="radio" value="private" checked={rights === 'private'} onChange={() => setRights('private')} />
                <span>ไม่เผยแพร่ (Private)</span>
              </label>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium">อัปโหลดไฟล์บทความ (.PDF)</label>
            {/* อัปโหลดไฟล์ */}
            <label
              htmlFor={rights === 'public' ? 'article_file' : undefined}
              className={`mt-2 border-2 border-dashed rounded-xl w-full flex flex-col items-center justify-center p-6 cursor-pointer transition hover:bg-gray-50 ${rights === 'private' ? 'opacity-60' : ''}`}
              onClick={() => {
                if (rights === 'private') {
                  // ช่วยผู้ใช้: เปลี่ยนเป็น public แล้วเปิด input
                  setRights('public');
                  // เปิดไฟล์เลือกหลังจาก state เปลี่ยนเล็กน้อย
                  setTimeout(() => {
                    const input = document.getElementById('article_file') as HTMLInputElement | null;
                    input?.click();
                  }, 50);
                }
              }}
            >
              <i className="fa-solid fa-cloud-arrow-up text-2xl text-gray-500" />
              <span className="text-sm mt-2">{fileName || (rights === 'private' ? 'ต้องเลือก Public ก่อน (คลิกที่นี่)' : 'คลิกเพื่อเลือกไฟล์')}</span>
              <span className="text-xs text-gray-500">รองรับเฉพาะ .PDF</span>
              <input id="article_file" type="file" accept=".pdf" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
            </label>
            {rights === 'private' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] bg-white/80 px-3 py-1 rounded-md border">ตอนนี้เป็น Private – คลิกเพื่อเปลี่ยนเป็น Public แล้วอัปโหลด</span>
              </div>
            )}
          </div>
        </div>

        {/* Section: Comment */}
        <div>
          <label className="block text-sm font-medium mb-2">ความคิดเห็นจากพนักงาน</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="พิมพ์ความคิดเห็น..." className="textarea textarea-bordered w-full min-h-48" />
        </div>

        {error && <div className="alert alert-error text-sm">{error}</div>}
        {success && <div className="alert alert-success text-sm">{success}</div>}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button type="button" onClick={() => history.back()} className="btn">ย้อนกลับ</button>
          <button type="button" disabled={loading==='revision'} onClick={() => handleSubmit('revision')} className="btn bg-red-600 hover:bg-red-700 text-white">
            {loading==='revision' ? 'กำลังส่งกลับ...' : 'แก้ไข'}
          </button>
          <button type="button" disabled={loading==='approved'} onClick={() => handleSubmit('approved')} className="btn bg-green-600 hover:bg-green-700 text-white">
            {loading==='approved' ? 'กำลังอนุมัติ...' : 'อนุมัติ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewArticleForm;
