"use client";
import { usePathname } from 'next/navigation'
import PaginationFeature from "@/components/PaginationFeature"

//จำลองข้อมูล API
const mockData = [
  {
    "id": "tanagon1", "title": "ผลงานตีพิมพ์อาจารย์ PSU สุดโหด", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "maiko1", "title": "ผลงานยอดเเย่", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": null , "status" : "รอการตรวจสอบ" 
  },
  {
    "id": "kitiko1", "title": "ศาสตราจารย์คนไหนดีย์", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"   , "status" : "รอการยืนยัน"
  },
  {
    "id": "china1", "title": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null , "status" : "รอการตรวจสอบ"
  },
  {
    "id": "tanagon2", "title": "การวิจัย AI ใน PSU", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th" , "status" : "เสร็จสิ้น"
  },
  {
    "id": "maiko2", "title": "ระบบฐานข้อมูลแย่ที่สุด", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": null , "status" : "รอการตรวจสอบ"
  },
  {
    "id": "kitiko2", "title": "การสอนโปรแกรมเชิงวิเคราะห์", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "china2", "title": "ทำไมภาควิชานี้ดีมาก", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null , "status" : "รอการตรวจสอบ"
  },
  {
    "id": "tanagon3", "title": "บทความ Machine Learning", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "maiko3", "title": "ปัญหาอาจารย์ใน PSU", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": null , "status" : "รอการตรวจสอบ"
  },
  {
    "id": "kitiko3", "title": "วิชาคอมพิวเตอร์ขั้นสูง", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "china3", "title": "เทคนิคการสอนดี ๆ", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null , "status" : "รอการตรวจสอบ"
  },
  {
    "id": "tanagon4", "title": "โปรเจกต์ PSU ที่น่าทึ่ง", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "maiko4", "title": "ข้อผิดพลาดของการเรียน", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "kitiko4", "title": "การประเมินผลงานอาจารย์", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "china4", "title": "คำแนะนำสำหรับนักศึกษา", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null , "status" : "รอการตรวจสอบ"
  },
  {
    "id": "tanagon5", "title": "แนวทางวิจัยใหม่", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "maiko5", "title": "การเรียนออนไลน์แย่มาก", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "kitiko5", "title": "เทคนิคการสอบ", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "china5", "title": "การพัฒนาภาควิชา", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null , "status" : "รอการตรวจสอบ"
  },
  {
    "id": "tanagon6", "title": "การเขียนบทความวิชาการ", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "maiko6", "title": "ข้อเสนอแนะ PSU", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "kitiko6", "title": "เทคโนโลยีใหม่สำหรับการเรียน", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th", "status" : "รอการตรวจสอบ"
  },
  {
    "id": "china6", "title": "ประสบการณ์การเรียนดี", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null , "status" : "รอการตรวจสอบ"
  }
];

const ArticlemanagementPage = () => {
  const pathName = usePathname();

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-(--8xl) flex flex-col justify-between items-center">
        <div className="w-full flex flex-col items-start my-5 gap-2">
          <p className="text-3xl">Review Lecturer’s Article</p>
          <p className="text-lg">ตรวจสอบบทความอาจารย์</p>
        </div>

        <div className="w-full flex flex-row items-center gap-2 mb-9 border-2 border-(--color-border)/20 rounded-2xl p-2">
          <label htmlFor="">สถานะ : </label>
          <select defaultValue="เรียงตามผลงานล่าสุด" className="select">
            <option disabled={true}>เรียงตามผลงานล่าสุด</option>
            <option>เรียงตามผลงานล่าสุด</option>
            <option>Amber</option>
            <option>Velvet</option>
          </select>

          <label htmlFor="">ประเภท : </label>
          <select defaultValue="เรียงตามผลงานล่าสุด" className="select">
            <option disabled={true}>เรียงตามผลงานล่าสุด</option>
            <option>เรียงตามผลงานล่าสุด</option>
            <option>Amber</option>
            <option>Velvet</option>
          </select>

          <label htmlFor="">ปี : </label>
          <select defaultValue="2025" className="select">
            <option disabled={true}>2025</option>
            <option>เรียงตามผลงานล่าสุด</option>
            <option>Amber</option>
            <option>Velvet</option>
          </select>
        </div>

        <PaginationFeature pathName={pathName} mockData={mockData} rowsValue={11} />

      </div>
    </div>
  );
};

export default ArticlemanagementPage;
