"use client";

import React from 'react';

// สร้าง Type สำหรับ props ที่จะรับเข้ามา
type props = {
  url?: string // url อาจจะเป็น null ได้ ถ้าไม่มีไฟล์ให้อัปโหลด
};

const DownloadCard = ({ url }:props ) => {
  console.log("URL สำหรับดาวน์โหลด:", url);

  // 1. ถ้าไม่มี url (เป็น null) ก็ให้แสดงปุ่มที่กดไม่ได้
  if (!url) {
    return (
      <button className="btn btn-success btn-sm text-lg rounded-sm px-10 py-5 btn-disabled w-[var(--width-button-lock)]">
        <i className="fa-solid fa-lock"></i>
      </button>
    );
  }

  // 2. ถ้ามี url ก็ให้สร้างลิงก์ที่ดาวน์โหลดได้
  return (
    // **หัวใจของการดาวน์โหลด!** //
    // เราใช้แท็ก <a> ที่มี attribute 'download'
    <a 
      href={url} // path ไปยังไฟล์ของเราในโฟลเดอร์ public
      download   // attribute นี้จะสั่งให้เบราว์เซอร์ "ดาวน์โหลด" แทนที่จะ "เปิด" ไฟล์
      className="btn btn-success btn-sm text-lg rounded-sm px-10 py-5"
    >
      Download PDF
    </a>
  );
};

export default DownloadCard;