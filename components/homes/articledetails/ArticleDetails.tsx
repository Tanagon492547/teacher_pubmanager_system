"use client";

import { useRouter } from 'next/navigation';
import ContributorCard from './ContributorCard';
import Image from 'next/image';
import DownloadCard from '@/components/DownloadCard';
import { motion } from 'framer-motion';

const ArticleDetails = ({ article }: any) => {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="w-full flex flex-col justify-center items-center px-4 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-full max-w-(--8xl) flex flex-col justify-between items-center gap-5"
        variants={itemVariants}
      >
        <motion.div
          className='w-full'
          variants={itemVariants}
        >
          <div className='flex flex-row items-center' onClick={() => router.back()}>
            <i className="fa-solid fa-arrow-left"></i>
            <motion.button
              className="btn btn-link text-black"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <p>ย้อนกลับ</p>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className='w-full flex flex-col lg:flex-row gap-5'
          variants={itemVariants}
        >
          <motion.div
            className='w-full lg:w-[80%] flex flex-col gap-5'
            variants={containerVariants}
          >
            <motion.div
              className='flex items-center justify-center min-w-full bg-(--color-base-200) h-82 rounded-lg'
              variants={itemVariants}
            >
              <Image
                src={article?.imageUrl || "/depositphotos_89250312-stock-illustration-photo-picture-web-icon-in.jpg"}
                alt={article?.title || "รูปบทความ"}
                className='rounded-lg'
                width={182}
                height={222}
              />
            </motion.div>

            <motion.div
              className='flex flex-col gap-5'
              variants={itemVariants}
            >
              <motion.p
                className='text-5xl'
                variants={itemVariants}
              >
                {article?.title || "ไม่มีชื่อบทความ"}
              </motion.p>
              <motion.div
                className='flex gap-5'
                variants={itemVariants}
              >
                <motion.div
                  className="badge badge-success text-lg"
                  variants={itemVariants}
                >
                  {article?.type || "วารสาร"}
                </motion.div>
                <motion.p
                  variants={itemVariants}
                >
                  เผยแพร่เมื่อวันที่ {article?.publishedDate || "-"}
                </motion.p>
              </motion.div>
              <motion.p
                className='text-4xl my-5'
                variants={itemVariants}
              >
                บทคัดย่อ
              </motion.p>
              <motion.div
                className='indent-4 text-justify p-10 min-w-full bg-(--color-base-200)/50 h-fit rounded-lg'
                variants={itemVariants}
              >
                {article?.abstract || "ไม่มีบทคัดย่อ"}
              </motion.div>
            </motion.div>

            <motion.p
              className='text-4xl my-5'
              variants={itemVariants}
            >
              รายละเอียดบทความ
            </motion.p>
            <motion.div
              className='flex gap-10'
              variants={itemVariants}
            >
              <motion.div
                className='text-center'
                variants={itemVariants}
              >
                <p className='text-xl'>สถานะการตีพิมพ์</p>
                <p>{article?.publish_status || "ไม่เผยเเพร่"}</p>
              </motion.div>
              <motion.div
                className='text-center'
                variants={itemVariants}
              >
                <p className='text-xl'>ประเภทบทความ</p>
                <p>{article?.articleType || "งานวิจัย"}</p>
              </motion.div>
            </motion.div>

            <motion.div
              className='my-10'
              variants={itemVariants}
            >
              <DownloadCard url={article.article_file} />
            </motion.div>
          </motion.div>
          <ContributorCard />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ArticleDetails;