"use client";
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react';
import PaginationFeature from "@/components/PaginationFeature"

//จำลองข้อมูล API
const mockData = [
  { หัวข้อ: "ผู้หญิงมีจริงหรือไม่", วันที่อัปโหลด: "30/08/2568", ปีที่พิมพ์: "2505", ประเภท: "วารสาร", สถานะ: "กำลังตรวจ" },
  { หัวข้อ: "พลังงานทดแทนในอนาคต", วันที่อัปโหลด: "01/09/2568", ปีที่พิมพ์: "2560", ประเภท: "งานวิจัย", สถานะ: "ต้องเเก้ไข" },
  { หัวข้อ: "การพัฒนาปัญญาประดิษฐ์", วันที่อัปโหลด: "02/09/2568", ปีที่พิมพ์: "2566", ประเภท: "วิทยานิพนธ์", สถานะ: "ข้อมูลสมบูรณ์" },
  { หัวข้อ: "ผลกระทบโลกร้อน", วันที่อัปโหลด: "03/09/2568", ปีที่พิมพ์: "2555", ประเภท: "รายงาน", สถานะ: "เสร็จสิ้น" },
  { หัวข้อ: "วิทยาศาสตร์อาหาร", วันที่อัปโหลด: "04/09/2568", ปีที่พิมพ์: "2558", ประเภท: "วารสาร", สถานะ: "ต้องเเก้ไข" },
  { หัวข้อ: "โครงข่ายประสาทเทียม", วันที่อัปโหลด: "05/09/2568", ปีที่พิมพ์: "2564", ประเภท: "งานวิจัย", สถานะ: "ข้อมูลสมบูรณ์" },
  { หัวข้อ: "พฤติกรรมผู้บริโภคยุคดิจิทัล", วันที่อัปโหลด: "06/09/2568", ปีที่พิมพ์: "2559", ประเภท: "วารสาร", สถานะ: "กำลังตรวจ" },
  { หัวข้อ: "เศรษฐกิจสร้างสรรค์", วันที่อัปโหลด: "07/09/2568", ปีที่พิมพ์: "2557", ประเภท: "วิทยานิพนธ์", สถานะ: "เสร็จสิ้น" },
  { หัวข้อ: "ผลของการออกกำลังกาย", วันที่อัปโหลด: "08/09/2568", ปีที่พิมพ์: "2562", ประเภท: "งานวิจัย", สถานะ: "กำลังตรวจ" },
  { หัวข้อ: "ระบบขนส่งอัจฉริยะ", วันที่อัปโหลด: "09/09/2568", ปีที่พิมพ์: "2563", ประเภท: "รายงาน", สถานะ: "ข้อมูลสมบูรณ์" },
  { หัวข้อ: "วรรณคดีไทยสมัยใหม่", วันที่อัปโหลด: "10/09/2568", ปีที่พิมพ์: "2554", ประเภท: "วารสาร", สถานะ: "ต้องเเก้ไข" },
  { หัวข้อ: "ความปลอดภัยทางไซเบอร์", วันที่อัปโหลด: "11/09/2568", ปีที่พิมพ์: "2567", ประเภท: "วิทยานิพนธ์", สถานะ: "กำลังตรวจ" },
  { หัวข้อ: "การออกแบบ UX/UI", วันที่อัปโหลด: "12/09/2568", ปีที่พิมพ์: "2561", ประเภท: "รายงาน", สถานะ: "เสร็จสิ้น" },
  { หัวข้อ: "ผลกระทบโซเชียลมีเดีย", วันที่อัปโหลด: "13/09/2568", ปีที่พิมพ์: "2565", ประเภท: "งานวิจัย", สถานะ: "ต้องเเก้ไข" },
  { หัวข้อ: "การจัดการขยะพลาสติก", วันที่อัปโหลด: "14/09/2568", ปีที่พิมพ์: "2553", ประเภท: "วารสาร", สถานะ: "ข้อมูลสมบูรณ์" },
  { หัวข้อ: "การเรียนรู้แบบออนไลน์", วันที่อัปโหลด: "15/09/2568", ปีที่พิมพ์: "2560", ประเภท: "วิทยานิพนธ์", สถานะ: "กำลังตรวจ" },
  { หัวข้อ: "การท่องเที่ยวเชิงวัฒนธรรม", วันที่อัปโหลด: "16/09/2568", ปีที่พิมพ์: "2552", ประเภท: "รายงาน", สถานะ: "ต้องเเก้ไข" },
  { หัวข้อ: "ผลกระทบโควิด-19", วันที่อัปโหลด: "17/09/2568", ปีที่พิมพ์: "2563", ประเภท: "งานวิจัย", สถานะ: "ข้อมูลสมบูรณ์" },
  { หัวข้อ: "การจัดการทรัพยากรน้ำ", วันที่อัปโหลด: "18/09/2568", ปีที่พิมพ์: "2556", ประเภท: "วารสาร", สถานะ: "เสร็จสิ้น" },
  { หัวข้อ: "ระบบสมองกลฝังตัว", วันที่อัปโหลด: "19/09/2568", ปีที่พิมพ์: "2564", ประเภท: "วิทยานิพนธ์", สถานะ: "ต้องเเก้ไข" },
  { หัวข้อ: "พลังงานแสงอาทิตย์", วันที่อัปโหลด: "20/09/2568", ปีที่พิมพ์: "2551", ประเภท: "งานวิจัย", สถานะ: "ข้อมูลสมบูรณ์" },
  { หัวข้อ: "การเกษตรอัจฉริยะ", วันที่อัปโหลด: "21/09/2568", ปีที่พิมพ์: "2562", ประเภท: "รายงาน", สถานะ: "กำลังตรวจ" },
  { หัวข้อ: "พฤติกรรมการนอน", วันที่อัปโหลด: "22/09/2568", ปีที่พิมพ์: "2550", ประเภท: "วารสาร", สถานะ: "เสร็จสิ้น" },
  { หัวข้อ: "การเงินดิจิทัล", วันที่อัปโหลด: "23/09/2568", ปีที่พิมพ์: "2561", ประเภท: "วิทยานิพนธ์", สถานะ: "ต้องเเก้ไข" }
];

const STORAGE_KEY = 'myArticles';

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
    <div className="w-full flex flex-col justify-center items-center px-4 py-10">
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
