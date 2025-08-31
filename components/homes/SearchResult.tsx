'use client';
import PaginationFeature from '@/components/PaginationFeature'

// จำลอง API  
const users = [
  {
    "id": "tanagon1", "title": "ผลงานตีพิมพ์อาจารย์ PSU สุดโหด", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "maiko1", "title": "ผลงานยอดเเย่", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": null
  },
  {
    "id": "kitiko1", "title": "ศาสตราจารย์คนไหนดีย์", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "china1", "title": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null
  },
  {
    "id": "tanagon2", "title": "การวิจัย AI ใน PSU", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "maiko2", "title": "ระบบฐานข้อมูลแย่ที่สุด", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": null
  },
  {
    "id": "kitiko2", "title": "การสอนโปรแกรมเชิงวิเคราะห์", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "china2", "title": "ทำไมภาควิชานี้ดีมาก", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null
  },
  {
    "id": "tanagon3", "title": "บทความ Machine Learning", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "maiko3", "title": "ปัญหาอาจารย์ใน PSU", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": null
  },
  {
    "id": "kitiko3", "title": "วิชาคอมพิวเตอร์ขั้นสูง", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "china3", "title": "เทคนิคการสอนดี ๆ", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null
  },
  {
    "id": "tanagon4", "title": "โปรเจกต์ PSU ที่น่าทึ่ง", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "maiko4", "title": "ข้อผิดพลาดของการเรียน", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "kitiko4", "title": "การประเมินผลงานอาจารย์", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "china4", "title": "คำแนะนำสำหรับนักศึกษา", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null
  },
  {
    "id": "tanagon5", "title": "แนวทางวิจัยใหม่", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "maiko5", "title": "การเรียนออนไลน์แย่มาก", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "kitiko5", "title": "เทคนิคการสอบ", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "china5", "title": "การพัฒนาภาควิชา", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null
  },
  {
    "id": "tanagon6", "title": "การเขียนบทความวิชาการ", "athor": "ดร.คิดมาก", "field": "ศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "maiko6", "title": "ข้อเสนอแนะ PSU", "athor": "อ.ปลงเป็น", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "kitiko6", "title": "เทคโนโลยีใหม่สำหรับการเรียน", "athor": "ดร.จิตดี", "field": "รองศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์", "url": "https://www.psu.ac.th"
  },
  {
    "id": "china6", "title": "ประสบการณ์การเรียนดี", "athor": "Dr.สมหวัง", "field": "ผู้ช่วยศาสตราจารย์", "offset": "ภาควิชาวิทยาการคอมพิวเตอร์ดีจริงไหม", "url": null
  }
]


const SearchResult = () => {

  const varlueResultSearch = Object.keys(users);

  return (
  <div className="w-full flex flex-col justify-center items-center">
    <div className="w-full flex flex-row justify-between items-center mb-5">
        <div className="flex flex-row items-center gap-1 ">
        <p className="text-4xl">ผลการค้นหา</p>
        <p className="text-lg">( {varlueResultSearch.length} บทความที่ค้นพบ )</p>
        </div>

      <form action="" className="w-xs">
        <fieldset className="fieldset ">
          <select className="select px-5 w-full">
            <option disabled >เรียงตามผลลัพธ์</option>
            <option>เรียงตามผลลัพธ์</option>
            <option>Chrome</option>
            <option>FireFox</option>
            <option>Safari</option>
          </select>
        </fieldset>
      </form>

    </div>

    <div className="w-full">
      <PaginationFeature pathName="/" mockData={users} rowsValue={10} />
    </div>

  </div>
  );
}

export default SearchResult;