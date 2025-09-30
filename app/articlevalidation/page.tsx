"use client";
import { usePathname } from 'next/navigation'
import PaginationFeature from "@/components/PaginationFeature"
import { useEffect, useState } from 'react';

type ArticleListItem = {
  articleId: number;
  articleName: string;
  publishedYear: number | null;
  articleType: string | null;
  academicTitle: string | null;
  firstName: string;
  lastName: string;
  contributorName?: string | null;
  faculty: string | null;
  department: string | null;
  abstract: string | null;
  downloadPath: string | null;
  article_status: string | null;
}

const ArticleValidationPage = () => {
  const pathName = usePathname();
  const [data, setData] = useState<ArticleListItem[] | null>(null);
  // (สามารถเพิ่ม pagination UI ภายหลังได้)
  const page = 1;
  const pageSize = 50;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
  const res = await fetch(`/api/articles-list?page=${page}&pageSize=${pageSize}&status=pending`);
        if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');
        const json = await res.json();
        // รองรับทั้งโครงสร้างเก่า (array) และใหม่ ({items:[]})
        const items: ArticleListItem[] = Array.isArray(json) ? json : json.items || [];
        if (!ignore) {
          setData(items);
          if (!Array.isArray(json)) {
            // setTotal(json.total || items.length); // Removed unused state
            // setPageSize(json.pageSize || pageSize); // Removed unused state
          }
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'เกิดข้อผิดพลาด';
        if (!ignore) setError(message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [page, pageSize]);

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-(--8xl) flex flex-col justify-between items-center">
        <div className="w-full flex flex-col items-start my-5 gap-2">
          <p className="text-3xl">Review Lecturer’s Article</p>
          <p className="text-lg">ตรวจสอบบทความอาจารย์</p>
        </div>

        <div className="w-full flex flex-row items-center gap-2 mb-9 border-2 border-(--color-border)/20 rounded-2xl p-2">
          <label>สถานะ : </label>
          <select defaultValue="ทั้งหมด" className="select">
            <option disabled>ทั้งหมด</option>
            <option>ทั้งหมด</option>
            <option>รอการตรวจสอบ</option>
            <option>รอการยืนยัน</option>
            <option>เสร็จสิ้น</option>
          </select>

          <label>ประเภท : </label>
            <select defaultValue="ทั้งหมด" className="select">
              <option disabled>ทั้งหมด</option>
              <option>บทความ</option>
              <option>งานวิจัย</option>
            </select>

          <label>ปี : </label>
          <select defaultValue="ทั้งหมด" className="select">
            <option disabled>ทั้งหมด</option>
            <option>2025</option>
            <option>2024</option>
          </select>
        </div>

        {loading && <div className="w-full flex justify-center py-20"><span className="loading loading-spinner loading-lg" /> กำลังโหลด...</div>}
        {error && !loading && <div className="alert alert-error w-full">{error}</div>}
        {data && !loading && data.length > 0 && (() => {
          // แปลงข้อมูลจาก API ให้เข้ากับโครงสร้างที่ Table ใช้
          const statusMap: Record<string, string> = {
            draft: 'รอการตรวจสอบ',
            submitted: 'รอการยืนยัน',
            pending: 'รอการตรวจสอบ',
            approved: 'เสร็จสิ้น',
          };
          const mapped = data.map(item => {
            const owner = item.contributorName && item.contributorName.trim() !== ''
              ? item.contributorName
              : `${item.academicTitle || ''} ${item.firstName || ''} ${item.lastName || ''}`.trim();
            return {
              articleId: item.articleId,
              title: item.articleName,
              athor: owner || 'ไม่ระบุ',
              field: item.academicTitle || '',
              offset: item.department || item.faculty || '',
              url: item.downloadPath,
              status: statusMap[item.article_status || 'draft'] || item.article_status || 'รอการตรวจสอบ',
            };
          });
          return <PaginationFeature pathName={pathName} mockData={mapped} rowsValue={11} />;
        })()}
        {!loading && (data == null || data.length === 0) && <div className="w-full text-center py-10 text-gray-500">ไม่มีข้อมูลบทความ</div>}
      </div>
    </div>
  );
};

export default ArticleValidationPage;
