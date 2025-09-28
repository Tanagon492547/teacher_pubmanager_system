'use client';

import PaginationFeature from '@/components/PaginationFeature';
import { useEffect, useState } from 'react';

// 1. สร้าง "เมนูอาหาร" (Type) ของเราขึ้นมาใหม่
//    เพื่อให้ตรงกับข้อมูลที่ PaginationFeature ต้องการ (เหมือนกับ mockData ของเราเลย)
type DisplayArticle = {
  id: string;
  title: string;
  athor: string;
  field: string | null;
  offset: string | null;
  url: string | null;
  abstract: string | null;
  articleType: string | null;
  publishedYear: number | null;
};

interface ArticlesListAPIItem {
  articleId: number;
  articleName: string;
  publishedYear: number | null;
  articleType: string | null;
  academicTitle: string | null;
  firstName: string;
  lastName: string;
  faculty: string | null;
  department: string | null;
  abstract: string | null;
  downloadPath: string | null;
  article_status: string | null;
}

interface ArticlesListAPIResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: ArticlesListAPIItem[];
  error?: string;
}

// 2. Component ของเรา **ห้าม** เป็น async นะเหมียว!
const SearchResult = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 3. State ของเราจะเก็บข้อมูลที่ "แปลงร่าง" แล้ว (DisplayArticle)
  const [articles, setArticles] = useState<DisplayArticle[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20); // client page size
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAndFormatArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/articles-list?page=${page}&pageSize=${pageSize}`, { signal: controller.signal });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const apiData: ArticlesListAPIResponse = await response.json();
        const formattedData: DisplayArticle[] = apiData.items.map((article) => ({
          id: String(article.articleId),
            title: article.articleName,
            athor: `${article.firstName} ${article.lastName}`,
            field: article.academicTitle,
            offset: article.department,
            url: article.downloadPath,
            abstract: article.abstract,
            articleType: article.articleType,
            publishedYear: article.publishedYear,
        }));
        setArticles(formattedData);
        setTotal(apiData.total);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('เกิดข้อผิดพลาดตอนดึงข้อมูลบทความ:', err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndFormatArticles();
    return () => controller.abort();
  }, [page, pageSize]);

  // --- ส่วนของการแสดงผล (เหมือนเดิม) ---
  if (isLoading) {
    return <div className="text-center py-10">กำลังโหลดข้อมูลบทความ...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">เกิดข้อผิดพลาด: {error}</div>;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-row justify-between items-center mb-5">
        <div className="flex flex-row items-center gap-2">
          <p className="text-4xl">ผลการค้นหา</p>
          <p className="text-lg">( {total} บทความที่ค้นพบ )</p>
        </div>

        <form action="" className="w-xs">
          <fieldset className="fieldset">
            <select className="select select-bordered px-5 w-full">
              <option disabled>เรียงตามผลลัพธ์</option>
              <option>เรียงตามความใหม่</option>
              <option>เรียงตามความนิยม</option>
            </select>
          </fieldset>
        </form>
      </div>

      <div className="w-full">
        <PaginationFeature pathName="/" mockData={articles} rowsValue={10} />
      </div>
    </div>
  );
}

export default SearchResult;

