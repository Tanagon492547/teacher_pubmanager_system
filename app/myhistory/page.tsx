"use client";

import { useEffect, useState } from 'react';
import PaginationFeature from '@/components/PaginationFeature'
import ArticleHistoryDetail from '@/components/myhistorys/ArticleHistoryDetail';
import { usePathname, useRouter } from 'next/navigation';

interface StatusHistoryItem {
  status: string;
  date: string;
  reviewer: string;
  note: string;
}

interface Article {
  id: number;
  title: string;
  status: string;
  uploadDate: string;
  completedDate: string | null;
  reviewer: string;
  reviewerNote: string;
  author: string;
  statusHistory: StatusHistoryItem[];
}

interface HistoryData {
  articles: Article[];
  userType: string;
  userTypeId: number;
}

const MyHistoryPage = () => {
  const path = usePathname();
  const router = useRouter();
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/article-history');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleViewDetail = (item: Record<string, unknown>) => {
    // หา article จาก id ที่ส่งมา
    const article = historyData?.articles.find(a => a.title === item.หัวข้อ);
    if (article) {
      setSelectedArticle(article);
    }
  };

  // จัดเรียงข้อมูล
  const sortedArticles = historyData?.articles ? [...historyData.articles].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
    }
    return 0;
  }) : [];

  // แปลงข้อมูลให้เข้ากับ PaginationFeature
  const mockData = sortedArticles.map(article => ({
    "หัวข้อ": article.title,
    "สถานะ": article.status,
    "วันที่อัปโหลด": new Date(article.uploadDate).toLocaleDateString('th-TH'),
    "วันที่บทความสมบูรณ์": article.completedDate 
      ? new Date(article.completedDate).toLocaleDateString('th-TH') 
      : '-',
    "ผู้ตรวจ": article.reviewer
  }));

  if (loading) {
    return (
      <div className="w-full flex flex-col justify-center items-center px-4 py-10">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center px-4 py-10">
        <div className="w-full max-w-(--8xl) flex flex-col justify-between items-center">
          <div className="w-full flex flex-row justify-between items-center my-5">
            <div>
              <p className="text-3xl">ประวัติบทความ</p>
              {historyData && (
                <p className="text-sm text-gray-500 mt-2">
                  บทบาท: {historyData.userType} | จำนวนบทความ: {sortedArticles.length} รายการ
                </p>
              )}
            </div>
            <div className="flex flex-row gap-2">
              <div className="w-xs">
                <select 
                  value={sortBy} 
                  onChange={handleSortChange}
                  className="select select-bordered"
                >
                  <option value="latest">เรียงตามผลงานล่าสุด</option>
                  <option value="oldest">เรียงตามผลงานเก่าสุด</option>
                </select>
              </div>
            </div>
          </div>

          {mockData.length === 0 ? (
            <div className="w-full text-center py-10">
              <p className="text-gray-500">ยังไม่มีประวัติบทความ</p>
            </div>
          ) : (
            <PaginationFeature 
              pathName={path} 
              mockData={mockData} 
              rowsValue={15} 
              onViewDetail={handleViewDetail}
            />
          )}
        </div>
      </div>

      {selectedArticle && (
        <ArticleHistoryDetail
          title={selectedArticle.title}
          author={selectedArticle.author}
          statusHistory={selectedArticle.statusHistory}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  );
};

export default MyHistoryPage;