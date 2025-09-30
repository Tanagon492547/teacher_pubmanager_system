import ArticleDetails from "@/components/homes/articledetails/ArticleDetails";
import { notFound } from 'next/navigation';

// 1. ปรับแก้ฟังก์ชันดึงข้อมูลให้ฉลาดขึ้น
async function getArticleData(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/articles/${id}`, {
      cache: 'no-store' // สั่งให้ดึงข้อมูลใหม่เสมอ ไม่เอาจาก cache
    });
    
    if (!res.ok) {
      return null; 
    }
    // ป้องกันกรณี body ว่างหรือ JSON พัง -> ใช้ text() ก่อนแล้วค่อย parse
    const raw = await res.text();
    if (!raw) {
      console.warn('API /articles returned empty body');
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (parseErr) {
      console.error('Invalid JSON from /api/articles:', parseErr, 'raw =', raw);
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null; // ถ้า fetch ล้มเหลว (เช่น server ปิด) ก็ถือว่าหาไม่เจอ
  }
}

// 3. แก้ไข Type ของ params ให้ถูกต้อง
const ArticleDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  
  const articleData = await getArticleData(id);

  // 4. เช็คว่าได้ข้อมูลกลับมาหรือไม่
  if (!articleData) {
    notFound(); // ถ้าไม่ได้ข้อมูล (null) ก็ให้ไปแสดงหน้า 404
  }
  
  return (
    // 5. ส่งข้อมูลบทความ (articleData) ทั้งก้อนไปให้ ArticleDetails เลย!
    <ArticleDetails article={articleData} />
  )
}

export default ArticleDetailPage;