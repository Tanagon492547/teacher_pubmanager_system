"use client";

import React from 'react';
import { motion } from 'framer-motion';

// --- ไอคอน (SVG) ---
const TeacherIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM8 10.43l6.21-2.486A.5.5 0 0 1 15 8.5v.01a.5.5 0 0 1-.21.402l-6.5 2.6a.5.5 0 0 1-.58 0l-6.5-2.6A.5.5 0 0 1 1 8.5V8.5a.5.5 0 0 1 .29-.459L8 5.43l5.21 2.086a.5.5 0 0 1 .29.459v0" /></svg> );
const StaffIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg> );
const AdminIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2zm3 4V3a3 3 0 0 0-6 0v2H3.5a1 1 0 0 0-1 1v1.222a.5.5 0 0 0 .146.354l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 .146-.354V5h3zm-3 5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5zm-3 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5zm6 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5z"/></svg> );
const DownloadIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/></svg> );

// สร้าง "พจนานุกรม" สำหรับเก็บข้อมูลของแต่ละ Role
const userManuals = {
  Teacher: {
    title: 'คู่มือสำหรับอาจารย์',
    description: 'เรียนรู้วิธีการเพิ่มและจัดการผลงานตีพิมพ์ของคุณ',
    icon: <TeacherIcon />,
    file: '/manuals/teacher_manual.pdf',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  Staff: {
    title: 'คู่มือสำหรับเจ้าหน้าที่',
    description: 'เรียนรู้วิธีการตรวจสอบและอนุมัติผลงานตีพิมพ์',
    icon: <StaffIcon />,
    file: '/manuals/staff_manual.pdf',
    color: 'bg-green-500 hover:bg-green-600',
  },
  admin: {
    title: 'คู่มือสำหรับผู้ดูแลระบบ',
    description: 'เรียนรู้วิธีการจัดการผู้ใช้และตั้งค่าระบบทั้งหมด',
    icon: <AdminIcon />,
    file: '/manuals/admin_manual.pdf',
    color: 'bg-indigo-500 hover:bg-indigo-600',
  },
  guest: { // สำหรับกรณีที่ยังไม่ได้ Login
    title: 'กรุณาเข้าสู่ระบบ',
    description: 'คุณต้องเข้าสู่ระบบก่อน ถึงจะสามารถดาวน์โหลดคู่มือได้',
    icon: <StaffIcon />,
    file: null, // ไม่มีไฟล์ให้โหลด
    color: 'bg-gray-400 cursor-not-allowed',
  }
};

const ManualDownloader = ({ userType }: { userType: string | null }) => {
  // 1. หาข้อมูลคู่มือที่ตรงกับ userType ของเรา
  //    ถ้าหาไม่เจอ หรือ userType เป็น null ก็ให้ใช้ 'guest' แทน
  const manual = userManuals[userType as keyof typeof userManuals] || userManuals.guest;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center"
    >
      <div className="flex justify-center text-gray-700">{manual.icon}</div>
      
      <h1 className="text-2xl font-bold text-gray-800 mt-4">
        {manual.title}
      </h1>
      
      <p className="text-gray-600 mt-2 mb-6">
        {manual.description}
      </p>

      {/* 2. สร้างปุ่มดาวน์โหลด (หรือปุ่มที่กดไม่ได้) */}
      <a
        href={manual.file || '#'} // ถ้าไม่มีไฟล์ ก็ไม่ต้องไปไหน
        download={!!manual.file}   // สั่งให้ download ก็ต่อเมื่อมีไฟล์เท่านั้น
        className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300 ${manual.color}`}
      >
        <DownloadIcon />
        <span>{manual.file ? 'ดาวน์โหลดคู่มือ' : 'ไม่สามารถดาวน์โหลดได้'}</span>
      </a>
    </motion.div>
  );
};

export default ManualDownloader;
