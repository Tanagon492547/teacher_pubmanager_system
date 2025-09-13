"use client";

import { useRouter } from 'next/navigation';
import ContributorCard from './ContributorCard';
import Image from 'next/image';
import DownloadCard from '@/components/DownloadCard';

const ArticleDetails = ({ id, url }: any) => {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-(--8xl) flex flex-col justify-between items-center gap-5">
        <div className='w-full '>
          <div className='flex  flex-row items-center' onClick={() => router.back()}>
            <i className="fa-solid fa-arrow-left"></i>
            <button className="btn btn-link text-black"><p>ย้อนกลับ</p></button>
          </div>
        </div>
        <div className='w-full flex flex-col lg:flex-row gap-5'>
          <div className='w-full lg:w-[80%] flex flex-col gap-5'>
              <div className='flex  items-center  justify-center min-w-full bg-(--color-base-200) h-82 rounded-lg'>
                <Image
                  src="/depositphotos_89250312-stock-illustration-photo-picture-web-icon-in.jpg" // ที่อยู่รูปภาพ
                  alt="รูปแมวของฉันกำลังนอนหลับ"
                  className='rounded-lg'
                  width={182} // ความกว้างต้นฉบับ (หน่วยเป็น pixel)
                  height={222} // ความสูงต้นฉบับ (หน่วยเป็น pixel)
                />
              </div>
              <div className='flex flex-col gap-5'>
                <p className='text-5xl'>แนวทางการเรียนรู้ของเครื่องจักรขั้นสูงในการประมวลผลภาษาธรรมชาติ: การศึกษาวิจัยที่ครอบคลุม</p>
                <div className='flex gap-5'>
                  <div className="badge badge-success text-lg">วารสาร</div>
                  <p>เผยแพร่เมื่อวันที่ 15 มีนาคม 2568</p>
                </div>
                <p className='text-4xl my-5'>บทคัดย่อ</p>
                <div className='indent-4  text-justify p-10 min-w-full bg-(--color-base-200)/50 h-fit rounded-lg'>
                  งานวิจัยนี้นำเสนอการวิเคราะห์เชิงลึกเกี่ยวกับแนวทางการเรียนรู้ของเครื่องขั้นสูง ในการประมวลผลภาษาธรรมชาติ การศึกษานี้พิจารณาสถาปัตยกรรมการเรียนรู้เชิงลึก ที่หลากหลาย ซึ่งรวมถึงแบบจำลองทรานส์ฟอร์มเมอร์ กลไกการใส่ใจ และ การประยุกต์ใช้ในการจำแนกข้อความ การวิเคราะห์ความรู้สึก และการสร้างภาษา ผ่านการทดลอง และ การประเมินอย่างกว้างขวาง เราได้แสดงให้เห็นถึงประสิทธิภาพของแนวทางเหล่าน ี้ในการปรับปรุงความแม่นยำ และประสิทธิภาพในงาน NLP ที่หลากหลาย ผลการวิจัยของเรามีส่วนช่วยในการสร้างความเข้าใจเกี่ยวกับระเบียบวิธี AI สมัยใหม่และการนำไปใช้จริงในสถานการณ์จริง
                </div>
              </div>
              <p className='text-4xl my-5'>รายละเอียดบทความ</p>
              <div className='flex gap-10'>
                <div className='text-center'>
                  <p className='text-xl'>สถานะการตีพิมพ์</p>
                  <p>ไม่เผยเเพร่</p>
                </div>
                <div className='text-center'>
                  <p className='text-xl'>ประเภทบทความ</p>
                  <p>งานวิจัย</p>
                </div>
                
              </div>
              <div className='my-10'>
                <DownloadCard />
              </div>
          </div>
          <ContributorCard />
        </div>
      </div>
    </div>
  )
}

export default ArticleDetails;