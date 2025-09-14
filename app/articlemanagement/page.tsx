"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import PaginationFeature from "@/components/PaginationFeature";
import { mockArticles as mockData } from "@/data/articles";

const STORAGE_KEY = "myArticles";
type MyArticle = {
  หัวข้อ: string;
  วันที่อัปโหลด: string; // dd/mm/yyyy
  ปีที่พิมพ์: string;    // yyyy
  ประเภท: string;
  สถานะ: string;
};

const ArticlemanagementPage = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [stored, setStored] = useState<MyArticle[]>([]);
  const [sortKey, setSortKey] = useState<'ล่าสุด' | 'เก่าสุด' | 'ปีใหม่ไปเก่า' | 'ปีเก่าไปใหม่'>('ล่าสุด');

  // โหลดข้อมูลจาก localStorage เมื่อเข้าเพจ
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      const data = raw ? JSON.parse(raw) as MyArticle[] : [];
      setStored(Array.isArray(data) ? data : []);
    } catch {
      setStored([]);
    }
  }, []);

  // helper: แปลง dd/mm/yyyy -> Date
  const parseDMY = (dmy: string): Date | null => {
    const [dd, mm, yyyy] = dmy.split('/').map(Number);
    if (!dd || !mm || !yyyy) return null;
    return new Date(yyyy, mm - 1, dd);
  };

  // รวม mock + stored แล้วเรียงตามตัวเลือก
  const combined = useMemo(() => {
    const arr = [...stored, ...mockData];
    const copy = [...arr];
    switch (sortKey) {
      case 'ล่าสุด':
        copy.sort((a, b) => {
          const da = parseDMY(a.วันที่อัปโหลด)?.getTime() ?? 0;
          const db = parseDMY(b.วันที่อัปโหลด)?.getTime() ?? 0;
          return db - da; // ใหม่ -> เก่า
        });
        break;
      case 'เก่าสุด':
        copy.sort((a, b) => {
          const da = parseDMY(a.วันที่อัปโหลด)?.getTime() ?? 0;
          const db = parseDMY(b.วันที่อัปโหลด)?.getTime() ?? 0;
          return da - db; // เก่า -> ใหม่
        });
        break;
      case 'ปีใหม่ไปเก่า':
        copy.sort((a, b) => Number(b.ปีที่พิมพ์) - Number(a.ปีที่พิมพ์));
        break;
      case 'ปีเก่าไปใหม่':
        copy.sort((a, b) => Number(a.ปีที่พิมพ์) - Number(b.ปีที่พิมพ์));
        break;
      default:
        break;
    }
    return copy;
  }, [stored, sortKey]);

  // วิเคราะห์จำนวนรวม และจำนวนรายสถานะ
  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of combined) {
      const key = a.สถานะ || 'ไม่ทราบสถานะ';
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return { total: combined.length, counts };
  }, [combined]);

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-(--8xl) flex flex-col justify-between items-center">
        <div className="w-full flex flex-row justify-between items-center my-5">
          <p className="text-3xl">บทความของฉัน</p>
          <div className="flex flex-row gap-2">
            <button className="btn btn-success rounded-xl" onClick={() => router.push('/addArticle')}>เพิ่มบทความ</button>
            <div className="w-xs">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as 'ล่าสุด' | 'เก่าสุด' | 'ปีใหม่ไปเก่า' | 'ปีเก่าไปใหม่')}
                className="select select-bordered"
              >
                <option value="ล่าสุด">เรียงตามผลงานล่าสุด</option>
                <option value="เก่าสุด">เรียงจากผลงานเก่าสุด</option>
                <option value="ปีใหม่ไปเก่า">เรียงตามปีที่พิมพ์: ใหม่ → เก่า</option>
                <option value="ปีเก่าไปใหม่">เรียงตามปีที่พิมพ์: เก่า → ใหม่</option>
              </select>
            </div>  
          </div>
        </div>
      
        {/* สรุปภาพรวม */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-3 my-4">
          <div className="stat bg-base-200 rounded-xl">
            <div className="stat-title">บทความทั้งหมด</div>
            <div className="stat-value text-primary">{summary.total}</div>
          </div>
          {Object.entries(summary.counts).map(([status, count]) => (
            <div key={status} className="stat bg-base-200 rounded-xl">
              <div className="stat-title">{status}</div>
              <div className="stat-value">{count}</div>
            </div>
          ))}
        </div>

        <PaginationFeature pathName={pathName} mockData={combined} rowsValue={11} />
      </div>
    </div>
  );
};

export default ArticlemanagementPage;
