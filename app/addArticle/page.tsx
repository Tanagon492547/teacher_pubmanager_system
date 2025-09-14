"use client";
import { usePathname } from 'next/navigation'
import PaginationFeature from "@/components/PaginationFeature"

const ArticlemanagementPage = () => {
    const pathName = usePathname();
    return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 px-4 py-10">
      <div className="w-full max-w-4xl bg-base-100 rounded-2xl shadow-lg p-8 md:p-10">
        
        <div className="w-full flex justify-left mb-6">
          <p className="text-xl font-bold">เพิ่มบทความ</p>
        </div>


        <div className="w-6/7 flex flex-col justify-center items-center">

          <form action="" className="w-full flex flex-col gap-2">
            {/* อาจารย์เจ้าของบทความ */}
            <div>
            <label className="text-xs font-medium">
                อาจารย์เจ้าของบทความ <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="input input-bordered w-full"
                placeholder="ชื่อ"  
              />
              <input
                className="input input-bordered w-full"
                placeholder="นามสกุล" 
              />
            </div>
          </div>

            {/* ผู้ร่วมบทความ */}
            <div>
            <label className="text-xs font-medium">
                ผู้ร่วมบทความ <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="input input-bordered w-full"
                placeholder="ชื่อ"  
              />
              <input
                className="input input-bordered w-full"
                placeholder="นามสกุล" 
              />
            </div>
          </div>

            {/* ปุ่มเพิ่มผู้ร่วมบทความ */}
          <div >
            <button type="button" className="btn btn-ghost mt-2 gap-2"
            >เพิ่มผู้ร่วมบทความ
            </button>
         </div>

            {/* ชื่อบทความ */}
            <label  className="text-xs font-medium">
                ชื่อบทความ<span className="text-error">*</span>
            </label>
            <div className="w-full relative">
              <input type="text"
                className="input input-bordered w-full"
              />
            </div>
            
            {/* ประเภทงาน */}
            <label  className="text-xs font-medium">ประเภทงาน<span className="text-error">*</span></label>
            <div className="w-full relative">
              <select className="select select-bordered w-full" required>
              <option value="">— เลือกประเภทงาน —</option>
              <option>บทความวิจัย (Research Article)</option>
              <option>บทความทบทวน (Review Article)</option>
              <option>บทความประชุมวิชาการ (Proceedings)</option>
              <option>อื่น ๆ</option>
            </select>
            </div>

            {/* ตำเเหน่งอาจารย์ */}
            <label  className="text-xs font-medium">ตำเเหน่งอาจารย์<span className="text-error">*</span></label>
            <div className="w-full relative">
              <input type="text"
                className="input input-bordered w-full"
              />
            </div>

            {/* วัน เดือน ปี */}
            <label  className="text-xs font-medium">วัน เดือน ปี<span className="text-error">*</span></label>
            <div className="w-full relative">
              <input type="date"
                className="input input-bordered w-full pr-10"
              />
            </div>

            {/* บทคัดย่อ */}
            <label  className="text-xs font-medium">บทคัดย่อ<span className="text-error">*</span></label>
            <div className="w-full relative">
              <textarea
              className="textarea textarea-bordered w-full min-h-36"
            />
            </div>

            {/* สิทธิ์การเผยแพร่บทความ */}
            <div>
            <label className="text-xs font-medium">
              <span className="label-text text-sm font-medium">
                สิทธิ์ในการเผยแพร่บทความ
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <label className="label cursor-pointer gap-2">
                <input type="radio" name="rights" className="radio" defaultChecked />
                <span className="label-text">เผยแพร่</span>
              </label>
              <label className="label cursor-pointer gap-2">
                <input type="radio" name="rights" className="radio" />
                <span className="label-text">ไม่เผยแพร่</span>
              </label>
            </div>
          </div>

          {/* อัปโหลดไฟล์ */}
          <div>
            <label className="label">
              <span className="label-text text-sm font-medium">อัปโหลดไฟล์บทความ</span>
            </label>
            <label className="w-full">
              <div className="flex items-center gap-3 border border-base-300 rounded-xl p-3 hover:bg-base-200 cursor-pointer">
                
                <div className="flex-1">
                  <p className="text-sm">อัปโหลดไฟล์บทความ</p>
                  <p className="text-xs opacity-60">รองรับ .pdf</p>
                </div>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
              </div>
            </label>
          </div>

            {/* ปุ่มบันทึก ยกเลิก */}
          <div className="pt-4 flex flex-col md:flex-row gap-3 md:gap-6 md:justify-center">
            <button type="button"  className="btn btn-success md:min-w-48 rounded-2xl text-base-100">
              บันทึก
            </button>
            <button type="button" className="btn btn-error md:min-w-48 rounded-2xl text-base-100">
              ยกเลิก
            </button>
          </div>
          
          </form>

   

 
        </div>

      </div>
    </div>
     );
};
export default ArticlemanagementPage;