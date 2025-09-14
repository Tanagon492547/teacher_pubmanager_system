"use client";

import { useRouter } from 'next/navigation';
import ContributorCard from './ContributorCard';
import Image from 'next/image';
import DownloadCard from '@/components/DownloadCard';

type Article = {
  imageUrl?: string;
  title?: string;
  type?: string;
  publishedDate?: string;
  abstract?: string;
  status?: string;
  category?: string;
  fileUrl?: string;
};

const ArticleDetails = ({ article }: { article?: Article }) => {
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
                  src={article?.imageUrl || "/depositphotos_89250312-stock-illustration-photo-picture-web-icon-in.jpg"}
                  alt={article?.title || "รูปบทความ"}
                  className='rounded-lg'
                  width={182}
                  height={222}
                />
              </div>
              <div className='flex flex-col gap-5'>
                <p className='text-5xl'>{article?.title || "ไม่มีชื่อบทความ"}</p>
                <div className='flex gap-5'>
                  <div className="badge badge-success text-lg">{article?.type || "วารสาร"}</div>
                  <p>เผยแพร่เมื่อวันที่ {article?.publishedDate || "-"}</p>
                </div>
                <p className='text-4xl my-5'>บทคัดย่อ</p>
                <div className='indent-4  text-justify p-10 min-w-full bg-(--color-base-200)/50 h-fit rounded-lg'>
                  {article?.abstract || "ไม่มีบทคัดย่อ"}
                </div>
              </div>
              <p className='text-4xl my-5'>รายละเอียดบทความ</p>
              <div className='flex gap-10'>
                <div className='text-center'>
                  <p className='text-xl'>สถานะการตีพิมพ์</p>
                  <p>{article?.status || "ไม่เผยเเพร่"}</p>
                </div>
                <div className='text-center'>
                  <p className='text-xl'>ประเภทบทความ</p>
                  <p>{article?.category || "งานวิจัย"}</p>
                </div>
              </div>
              <div className='my-10'>
                <DownloadCard url={article?.fileUrl} />
              </div>
          </div>
          <ContributorCard />
        </div>
      </div>
    </div>
  )
}

export default ArticleDetails;