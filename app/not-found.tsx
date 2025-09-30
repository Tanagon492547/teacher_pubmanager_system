import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-9xl font-bold text-blue-500">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-800">ไม่พบหน้านี้เหมียว!</h2>
      <p className="mt-2 text-gray-600">
        ขออภัยนะ แต่หน้าเว็บที่เธอกำลังมองหาอาจจะถูกลบไปแล้ว หรือไม่เคยมีอยู่จริง
      </p>
      <Link href="/" className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        กลับไปที่หน้าแรก
      </Link>
      
    </div>
  );
}
