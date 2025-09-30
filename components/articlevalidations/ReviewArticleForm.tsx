"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// ใช้เรียก API route แทนการ import server action โดยตรง

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
  coAuthors?: { academic_title?: string | null; firstname: string; lastname: string }[];
};

interface Props { article: Article }

const ReviewArticleForm: React.FC<Props> = ({ article }) => {
  // Rights now shown as text only (no toggle per user request to display details as text)
  const [rights] = useState(article.publish_status || 'private');
  const router = useRouter();
  // Derive file name for download link
  const fileName = article.article_file ? article.article_file.split('/').pop() || '' : '';
  const [comment, setComment] = useState('');
  // loading state: 'approved' | 'revision'
  const [loading, setLoading] = useState<'approved' | 'revision' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const contributorTitle = article.contributor?.academic_title || 'อ.';
  const parseNameSafe = (name?: string | null) => {
    if (!name) return ['', ''];
    const parts = name.trim().split(/\s+/).map(p => (String(p).toLowerCase() === 'null' || String(p).toLowerCase() === 'undefined' ? '' : p));
    const first = parts[0] || '';
    const last = parts.slice(1).join(' ') || '';
    return [first, last];
  };
  const [firstname, lastname] = parseNameSafe(article.contributor?.contributor_name ?? '');

  async function handleSubmit(status: 'approved' | 'revision') {
    setLoading(status);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('status', status);
      formData.append('rights', rights);
      formData.append('comment', comment);
      // Removed file upload handling (changed to download only display)
      const res = await fetch(`/api/review-article/${article.id}`, { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || 'ไม่สามารถบันทึกได้');
      } else {
        setSuccess(status === 'approved' ? 'อนุมัติบทความสำเร็จ' : 'ส่งกลับเพื่อแก้ไขสำเร็จ');
        // After a successful approval, redirect back to the validation list.
        if (status === 'approved') {
          // small delay so the user can see the success message briefly
          setTimeout(() => {
            try {
              router.push('/articlevalidation');
            } catch (err) {
              // ignore push errors in client navigation
              console.error('Navigation error', err);
            }
          }, 600);
        }
      }
    } catch (e) {
      console.error(e);
      setError('เกิดข้อผิดพลาดในการบันทึก (เครือข่าย)');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white border rounded-2xl p-10 space-y-10">
        {/* Section: Author (display only) */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold">ข้อมูลผู้เขียน</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">คำนำหน้า</p>
              <p className="font-medium">{contributorTitle}</p>
            </div>
            <div>
              <p className="text-gray-500">ชื่อ</p>
              <p className="font-medium">{firstname || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">นามสกุล</p>
              <p className="font-medium">{lastname || '-'}</p>
            </div>
          </div>
        </section>

        {/* Section: Article Info (display only) */}
        <section className="space-y-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">ชื่อผลงาน</p>
            <p className="font-semibold break-words">{article.article_name}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="sm:col-span-1">
              <p className="text-gray-500 mb-1">ประเภทงาน</p>
              <p className="font-medium">{article.articleType || '—'}</p>
            </div>
            <div className="sm:col-span-1">
              <p className="text-gray-500 mb-1">ตำแหน่งอาจารย์</p>
              <p className="font-medium">{contributorTitle}</p>
            </div>
            <div className="sm:col-span-1">
              <p className="text-gray-500 mb-1">ปีที่เผยแพร่</p>
              <p className="font-medium">{article.published_year ?? '—'}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">บทคัดย่อ</p>
            <div className="p-4 rounded-md bg-gray-50 text-sm whitespace-pre-wrap leading-relaxed border">{article.abstract || '—'}</div>
          </div>
          {/* Co-Authors */}
          <div>
            <p className="text-gray-500 text-sm mb-1">ผู้ร่วมบทความ</p>
            {Array.isArray(article.coAuthors) && article.coAuthors.length > 0 ? (
              <ul className="list-disc pl-5 text-sm">
                {article.coAuthors.map((c, idx) => (
                  <li key={idx} className="mb-1">
                    <span className="font-medium">{(c.academic_title || '').trim() || 'อ.'} </span>
                    <span>{c.firstname} {c.lastname}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="italic text-gray-400">ไม่มีผู้ร่วมบทความ</div>
            )}
          </div>
        </section>

        {/* Section: Rights & File (display only) */}
        <section className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">สิทธิ์ในการเผยแพร่</p>
            <p className="inline-flex items-center gap-2 font-medium">
              <i className="fa-solid fa-shield" />
              {rights === 'public' ? 'เผยแพร่ (Public)' : 'ไม่เผยแพร่ (Private)'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">ไฟล์บทความ (.PDF)</p>
            {article.article_file ? (
              <a
                href={article.article_file}
                download={fileName || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-white hover:bg-gray-100 transition text-blue-600"
              >
                <i className="fa-solid fa-file-pdf" /> ดาวน์โหลด {fileName || 'ไฟล์'}
              </a>
            ) : (
              <span className="italic text-gray-400">ไม่มีไฟล์แนบ</span>
            )}
          </div>
        </section>

        {/* Section: Comment (still editable for reviewer) */}
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
