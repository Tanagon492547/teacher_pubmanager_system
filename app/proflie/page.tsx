import React from "react";

const ProfilePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center py-8">
        {/* รูปโปรไฟล์ */}
        <div className="relative">
          <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center">
            {/* สามารถใส่ <img src="..." /> ได้ */}
          </div>
          <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow">
            <span role="img" aria-label="edit">✏️</span>
          </button>
        </div>

        {/* กล่องรายละเอียด */}
        <div className="mt-8 w-full max-w-xl">
          <div className="bg-white rounded-xl shadow p-6 mb-6 relative">
            <h2 className="text-lg font-semibold mb-2 border-b pb-2">รายละเอียด</h2>
            <button className="absolute top-4 right-4 text-gray-500">
              <span role="img" aria-label="edit">✏️</span>
            </button>
            <div className="grid grid-cols-2 gap-y-2">
              <div>ชื่อ</div>
              <div className="font-medium">ดร. ชาราห์ ออห์นสัน</div>
              <div>เพศ</div>
              <div className="font-medium">หญิง</div>
              <div>ตำแหน่งทางวิชาการ</div>
              <div className="font-medium">ดร.พันตรีตำรวจหญิง</div>
              <div>คณะ/ภาควิชา</div>
              <div className="font-medium">วิทยาศาสตร์</div>
              <div>สาขาความเชี่ยวชาญ</div>
              <div className="font-medium">ชีววิทยา</div>
            </div>
          </div>

          {/* กล่องช่องทางการติดต่อ */}
          <div className="bg-white rounded-xl shadow p-6 relative">
            <h2 className="text-lg font-semibold mb-2 border-b pb-2">ช่องทางการติดต่อ</h2>
            <button className="absolute top-4 right-4 text-gray-500">
              <span role="img" aria-label="edit">✏️</span>
            </button>
            <div className="grid grid-cols-2 gap-y-2">
              <div>เบอร์โทร</div>
              <div className="font-medium">0959599955</div>
              <div>อีเมล</div>
              <div className="font-medium">sarahhha@psu.ac.th</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;