"use client";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { mockArticles, type ArticleRow } from '../../data/articles';

const STORAGE_KEY = 'myArticles';

type Summary = {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byYear: Record<string, number>;
};

const parseDMY = (dmy: string): Date | null => {
  const [dd, mm, yyyy] = dmy.split('/').map(Number);
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
};

const AnalyticsPage = () => {
  const [stored, setStored] = useState<ArticleRow[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      const data = raw ? (JSON.parse(raw) as ArticleRow[]) : [];
      setStored(Array.isArray(data) ? data : []);
    } catch {
      setStored([]);
    }
  }, []);

  const allArticles = useMemo(() => {
    return [...stored, ...mockArticles];
  }, [stored]);

  const summary: Summary = useMemo(() => {
    const s: Summary = { total: allArticles.length, byStatus: {}, byType: {}, byYear: {} };
    for (const a of allArticles) {
      s.byStatus[a.สถานะ] = (s.byStatus[a.สถานะ] ?? 0) + 1;
      s.byType[a.ประเภท] = (s.byType[a.ประเภท] ?? 0) + 1;
      s.byYear[a.ปีที่พิมพ์] = (s.byYear[a.ปีที่พิมพ์] ?? 0) + 1;
    }
    return s;
  }, [allArticles]);

  const latest5 = useMemo(() => {
    const copy = [...allArticles];
    copy.sort((a, b) => {
      const da = parseDMY(a.วันที่อัปโหลด)?.getTime() ?? 0;
      const db = parseDMY(b.วันที่อัปโหลด)?.getTime() ?? 0;
      return db - da;
    });
    return copy.slice(0, 5);
  }, [allArticles]);

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-(--8xl) flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">สรุปภาพรวมบทความ</h1>
          <Link href="/articlemanagement" className="btn btn-ghost">ไปที่รายการบทความ</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat bg-base-200 rounded-xl">
            <div className="stat-title">บทความทั้งหมด</div>
            <div className="stat-value text-primary">{summary.total}</div>
          </div>
          {Object.entries(summary.byStatus).map(([k, v]) => (
            <div key={k} className="stat bg-base-200 rounded-xl">
              <div className="stat-title">{k}</div>
              <div className="stat-value">{v}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-base-100 rounded-xl p-4 border border-base-300">
            <h2 className="text-xl mb-2">จำนวนบทความแยกตามประเภท</h2>
            <ul className="list-disc pl-5">
              {Object.entries(summary.byType).map(([k, v]) => (
                <li key={k}>{k}: {v}</li>
              ))}
            </ul>
          </div>

          <div className="bg-base-100 rounded-xl p-4 border border-base-300">
            <h2 className="text-xl mb-2">จำนวนบทความแยกตามปีที่พิมพ์</h2>
            <ul className="list-disc pl-5">
              {Object.entries(summary.byYear).sort((a,b)=> Number(b[0]) - Number(a[0])).map(([k, v]) => (
                <li key={k}>{k}: {v}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-4 border border-base-300">
          <h2 className="text-xl mb-2">5 รายการล่าสุด</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>หัวข้อ</th>
                  <th>วันที่อัปโหลด</th>
                  <th>ปีที่พิมพ์</th>
                  <th>ประเภท</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {latest5.map((r, i) => (
                  <tr key={i}>
                    <td>{r.หัวข้อ}</td>
                    <td>{r.วันที่อัปโหลด}</td>
                    <td>{r.ปีที่พิมพ์}</td>
                    <td>{r.ประเภท}</td>
                    <td>{r.สถานะ}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
