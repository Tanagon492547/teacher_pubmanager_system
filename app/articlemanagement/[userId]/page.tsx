"use client";
import { usePathname } from 'next/navigation'
import PaginationFeature from "@/components/PaginationFeature";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ArticleData = {
  userId?: number;
  article_name? : string;
  uploadDate? : string;
  published_year? : string;
  articleType?:  string;
  article_status? : string;
  articleId?:number;
};

const ArticlemanagementPage = () => { 
    const pathName = usePathname();
    const router = useRouter();
    
    const [article, setArticle] = useState<ArticleData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    // Debug Log 1: เช็คทุกครั้งที่ Component ถูกวาดใหม่
    console.log("Component is rendering...");
  
    useEffect(() => {
      // Debug Log 2: เช็คตอน useEffect ทำงาน
      console.log("useEffect triggered! This should happen only once (or twice in dev mode).");
  
      const fetchUsers = async () => {
        try {
          const id = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
          const data = await fetch(`/api/article-managers/${id}`);
          if (!data.ok) {
            throw new Error(`API responded with status: ${data.status}`);
          }
          const fetchedUsers = await data.json();
          setArticle(fetchedUsers);
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUsers();
  
      // Debug Log 3: ฟังก์ชันนี้จะทำงานตอน Component ถูกทำลาย
      return () => {
        console.log("Component is UNMOUNTING. If you see this, something is removing me.");
      };
    }, []); // <-- วงเล็บว่าง [] สำคัญมากๆ นะ!
  
    if (isLoading) {
      return (
        <div className="w-full flex justify-center items-center py-20">
          <p className="text-xl">กำลังโหลดข้อมูลผู้ใช้...</p>
        </div>
      );
    }
  
  return (
    <div className="w-full flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-(--8xl) flex flex-col justify-between items-center">
        <div className="w-full flex flex-row justify-between items-center my-5">
          <p className="text-3xl">บทความของฉัน</p>
          <div className="flex flex-row gap-2">
            <button className="btn btn-success rounded-xl" onClick={()=>{router.push('/addArticle');}}>เพิ่มบทความ</button>
            <div className="w-xs">
              <select defaultValue="เรียงตามผลงานล่าสุด" className="select">
                <option disabled={true}>เรียงตามผลงานล่าสุด</option>
                <option>เรียงตามผลงานล่าสุด</option>
                <option>Amber</option>
                <option>Velvet</option>
              </select>
            </div>
          </div>
        </div>
      
        <PaginationFeature pathName={pathName} mockData={article} rowsValue={11} />
      </div>
    </div>
  );
};

export default ArticlemanagementPage;
