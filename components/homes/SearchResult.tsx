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

// 2. Component ของเรา **ห้าม** เป็น async นะเหมียว!
const SearchResult = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 3. State ของเราจะเก็บข้อมูลที่ "แปลงร่าง" แล้ว (DisplayArticle)
  const [articles, setArticles] = useState<DisplayArticle[]>([]);

  useEffect(() => {
    const fetchAndFormatArticles = async () => {
      try {
        const response = await fetch(`/api/articles-list`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const apiData = await response.json();
        
        // 4. **หัวใจของการแก้ไข!** //
        //    "แปลงร่าง" ข้อมูลที่ได้จาก API ให้กลายเป็นรูปแบบที่ Component ของเราต้องการ
        const formattedData: DisplayArticle[] = apiData.map((article: any) => ({
          id: String(article.articleId),
          title: article.articleName,
          athor: `${article.firstName} ${article.lastName}`,
          field: article.academicTitle,
          offset: article.department,
          url: article.downloadPath,
          abstract: article.abstract,
          articleType: article.articleType,
          publishedYear: article.published_year,
        }));

        console.log(`ได้รับและแปลงข้อมูลบทความแล้ว: ${formattedData.length} ชิ้น`, formattedData);
        
        setArticles(formattedData);
        
      } catch (err: any) {
        console.error('เกิดข้อผิดพลาดตอนดึงข้อมูลบทความ:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFormatArticles();
  }, []); // <-- ทำงานแค่ครั้งเดียวตอนเริ่มนะ!

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
          <p className="text-lg">( {articles.length} บทความที่ค้นพบ )</p>
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
        {/* 5. ส่งข้อมูลที่แปลงร่างแล้วไปให้ PaginationFeature */}
        <PaginationFeature pathName="/" mockData={articles} rowsValue={10} />
      </div>
    </div>
  );
}

export default SearchResult;

