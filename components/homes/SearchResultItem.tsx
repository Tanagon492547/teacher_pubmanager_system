"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DownloadCard from '../DownloadCard';

type Users = {
  id: string  | undefined;
  title: string | undefined;
  athor: string | undefined;
  field: string | undefined;
  offset: string | undefined;
  url: string | undefined;
  abstract?: string;
  articleType?: string;
  publishedYear?: number
}

const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg> );
const CalendarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg> );
const BookIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.887 3.112-.752 1.234.124 2.503.523 3.388.893v9.746c-.915-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015 1.284 5.687 1 4.388 1 1.54 1 0 2.236 0 3.837v8.968c0 .533.224.994.658 1.302 1.054.733 2.665.709 3.656-.039 1.065-.8 2.565-.774 3.615.039a1.02 1.02 0 0 0 1.302-.001c.99-.74 2.596-.828 3.615-.039a.99.99 0 0 0 .658-1.302V3.837C16 2.236 14.46 1 12.612 1 11.313 1 9.985 1.284 9 1.783z"/></svg> );


const SearchResultItem = ({id, title, athor, field, offset, url, abstract, articleType, publishedYear}: Users)  => {
  const router = useRouter(); 
  return (
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300  my-2"
    >
      <div className="flex flex-col md:flex-row">
        
        {/* **ส่วนที่ 2: เนื้อหาหลัก** */}
        <div className="flex-grow p-6 flex flex-col">
          {/* ส่วนบน: ประเภทและปี */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-100 text-blue-700 font-semibold">
              <BookIcon /> {articleType || 'N/A'}
            </span>
            <div className="flex items-center gap-1.5">
              <CalendarIcon />
              <span>ปี {publishedYear || 'N/A'}</span>
            </div>
          </div>

          {/* ชื่อเรื่อง */}
          <h2 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight">
            {title || 'ไม่มีชื่อเรื่อง'}
          </h2>
          
          {/* ข้อมูลผู้เขียน */}
          <div className="flex items-center gap-2 text-base text-gray-600 mt-2">
            <UserIcon />
            <p className="line-clamp-1">
              <span>{athor || 'N/A'}</span>
              <span className="text-gray-400 mx-1">|</span>
              <span className="text-gray-500">{field || 'N/A'}</span>
            </p>
          </div>
          
          {/* บทคัดย่อ */}
          <p className="w-full text-gray-500 mt-4 line-clamp-3 text-justify leading-relaxed indent-4"> 
            {abstract ? abstract : 'ไม่มีข้อมูลบทคัดย่อ'}
          </p>

          {/* ปุ่มต่างๆ */}
          <div className="mt-auto pt-6 flex flex-wrap items-center gap-3">
            <DownloadCard url={url} />
            <button
              type="button"
              onClick={() => router.push(`/article-detail-page/${id}`)}
              className="btn btn-outline btn-sm rounded-md px-6"
            >
              ดูรายละเอียด
            </button>
          </div>
        </div>

        {/* **ส่วนที่ 3: รูปภาพ** */}
        <div className="w-full md:w-56 flex-shrink-0">
          <Image
            src="/depositphotos_89250312-stock-illustration-photo-picture-web-icon-in.jpg"
            alt="ภาพประกอบบทความ" 
            width={196} 
            height={229}
            className="w-full h-full object-cover rounded-r-xl"
          />
        </div>
        
      </div>
    </motion.div>
  );
}

export default SearchResultItem;