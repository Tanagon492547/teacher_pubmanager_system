"use client"; 

import React, { useState } from "react";

// --- ไอคอน (SVG) ---
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg> );
const FilterIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg> );
const ResetIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg> );


const AdvancedSearchForm = () => {
  const [publicationType, setPublicationType] = useState("0");
  const [teacherRole, setTeacherRole] = useState("0");

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 my-5">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
        <FilterIcon />
        <h2 className="text-xl font-semibold text-gray-800">ตัวกรองการค้นหาขั้นสูง</h2>
      </div>

      <form action="" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Filters (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label htmlFor="search-keyword" className="block text-sm font-medium text-gray-700 mb-1">
                คำค้นหา
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input 
                  type="text"
                  id="search-keyword"
                  className="input input-bordered w-full pl-10"
                  placeholder="กรอกชื่อเรื่อง, ชื่อผู้เขียน, บทคัดย่อ..." 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ปีที่ตีพิมพ์</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    className="input input-bordered w-full text-center"
                    placeholder="เริ่มต้น"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                  <span className="text-gray-500">ถึง</span>
                  <input 
                    type="number"
                    className="input input-bordered w-full text-center"
                    placeholder="สิ้นสุด"
                    min="1901"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pub-type" className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภทผลงาน
                </label>
                <select 
                  id="pub-type" 
                  className="select select-bordered w-full" 
                  value={publicationType} 
                  onChange={(e) => setPublicationType(e.target.value)}
                >
                  <option value='0' disabled>ทุกประเภท</option>
                  <option value='research'>บทความวิจัย (Research)</option>
                  <option value='review'>บทความทบทวน (Review)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="teacher-role" className="block text-sm font-medium text-gray-700 mb-1">
                ตำแหน่งทางวิชาการ
              </label>
              <select 
                id="teacher-role" 
                className="select select-bordered w-full" 
                value={teacherRole} 
                onChange={(e) => setTeacherRole(e.target.value)}
              >
                <option value='0' disabled>ทุกตำแหน่ง</option>
                <option value='prof'>ศาสตราจารย์</option>
                <option value='assoc'>รองศาสตราจารย์</option>
                <option value='asst'>ผู้ช่วยศาสตราจารย์</option>
              </select>
            </div>
          </div>

          {/* Quick Filters (Right Column) */}
          <div className="lg:col-span-1 bg-gray-50 rounded-lg p-6 space-y-3 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">ตัวกรองด่วน</h3>
            <button type="button" className="btn btn-ghost justify-start">ตีพิมพ์ล่าสุด</button>
            <button type="button" className="btn btn-ghost justify-start">ดาวน์โหลดมากสุด</button>
            <button type="button" className="btn btn-ghost justify-start">บทความวารสาร</button>
            <button type="button" className="btn btn-ghost justify-start">หนังสือ และตำราเรียน</button>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button type="button" className="btn btn-link gap-2 no-underline text-gray-500 hover:text-gray-700">
            <ResetIcon />
            <span>รีเซ็ตตัวกรอง</span>
          </button>
          <button type="submit" className="btn btn-primary btn-wide mt-4 sm:mt-0">
            <SearchIcon />
            <span>ค้นหา</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdvancedSearchForm;
