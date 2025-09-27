import EditArticleForm from "@/components/editArticle/EditArticleForm";
import { getArticleForEdit } from "@/hooks/posts/actions";
import { notFound } from "next/navigation";

// Page นี้เป็น Server Component ที่ฉลาด
export default async function EditArticlePage({ params }: { params: { id: string } }) {
  // เช็คก่อนเลยว่า id ที่ส่งมาเป็นตัวเลขรึเปล่า
  const {id} = await params
  const articleId = Number(id);
  if (isNaN(articleId)) {
    notFound(); // ถ้า id ไม่ใช่ตัวเลข ก็ส่งไปหน้า 404 เลย
  }

  // **โค้ดบรรทัดนี้จะทำงานแค่ "ครั้งเดียว" ตอนที่ Server สร้างหน้านี้ขึ้นมานะเหมียว!**
  const article = await getArticleForEdit(articleId);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 px-4 py-10">
      <div className="w-full max-w-4xl bg-base-100 rounded-2xl shadow-lg p-8 md:p-10">
        <div className="w-full flex justify-left mb-6">
          <h1 className="text-2xl font-bold text-gray-800">แก้ไขบทความ</h1>
        </div>
        
        {/* ส่งข้อมูลบทความที่ได้มา ไปให้ฟอร์มของเรา */}
        <EditArticleForm article={article} />
      </div>
    </div>
  );
}

