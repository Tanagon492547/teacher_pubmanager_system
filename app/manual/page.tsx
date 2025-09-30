import ManualDownloader from "@/components/manual/ManualDownloader";
import { getCurrentUserType } from "@/lib/data/users";

// Page นี้เป็น "พ่อครัว" (Server Component)
export default async function ManualPage() {
  
  // 1. ให้ "พ่อครัว" ไปหาประเภทของผู้ใช้ที่ Login อยู่มา
  const userType = await getCurrentUserType();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* 2. ส่งประเภทผู้ใช้ที่ได้ ไปให้ "พนักงานเสิร์ฟ" ของเรา */}
      <ManualDownloader userType={userType} />
    </div>
  );
}
