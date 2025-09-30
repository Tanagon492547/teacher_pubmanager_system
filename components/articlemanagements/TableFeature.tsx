'use client';

import { useState } from "react";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { getDeleteForm } from "@/hooks/posts/actions";
import { useRouter } from "next/navigation";

type tableHerdersType = {
  key?: number,
  pathName: string | undefined, // จะทำตัวเช็คหน้าที่ส่งเข้ามา
  index: number | undefined,
  title: string | undefined,
  athor?: string | undefined,
  uploadDate: string | undefined,
  publishYear: string | undefined,
  type: string | undefined,
  status: string | undefined,
  articleId?: number,
}

const TableFeature = ({ pathName, index, title, athor, uploadDate, publishYear, type, status, articleId }: tableHerdersType) => {
    const router =  useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleConfirmDelete = async () => {
      // Called when user confirms deletion in the modal
      if (!articleId) {
        setIsModalOpen(false);
        return;
      }
      try {
        const result = await getDeleteForm(articleId);
        if (result.success) {
          alert(result.message);
          try {
            router.refresh();
          } catch (e) {
            console.warn('router.refresh() failed', e);
          }
        } else {
          alert(`เกิดข้อผิดพลาด: ${result.error}`);
        }
      } catch (e) {
        console.error('Delete failed', e);
        alert('เกิดข้อผิดพลาดในการลบ');
      } finally {
        setIsModalOpen(false);
      }
    };
  const getButtonClass = (status: any) => {
    if (status === 'กำลังตรวจ') {
      return "btn bg-[var(--color-warning)]/70 text-[var(--color-success-content)]";
    } else if (status === 'ต้องเเก้ไข') {
      return "btn bg-[var(--color-error)] text-[var(--color-success-content)]";
    } else if (status === 'ข้อมูลสมบูรณ์') {
      return "btn bg-[var(--color-success)] text-[var(--color-success-content)]";
    } else if (status === 'เสร็จสิ้น') {
      return "btn bg-[var(--color-success)] btn-disabled text-[var(--color-success-content)]";
    }
    return "btn";
  };


  const  getFormId = () =>{
    return console.log('กำลังไป หน้าเเก้ไข')
    
    // router.replace(`/editArticle/${articleId}`)
  }

  // Format ISO/Date string into Thailand time (Asia/Bangkok) without seconds/milliseconds
  const formatUploadDateToBangkok = (iso?: string | null) => {
    if (!iso) return '—';
    try {
      const dt = new Date(iso);
      if (isNaN(dt.getTime())) return '—';
      // Use Intl.DateTimeFormat to convert to Asia/Bangkok and omit seconds
      return new Intl.DateTimeFormat('th-TH', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dt);
    } catch (e) {
      return '—';
    }
  };

  return (
    <tr key={index}>
      <td className="w-10 text-center">{index}</td>
      <td className="">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{(athor) || 'ไม่ระบุ'}</div>
      </td>
  <td className="w-10 text-center">{formatUploadDateToBangkok(uploadDate)}</td>
      <td className="w-10 text-center">{publishYear}</td>
      <td className="w-10 text-center overflow-hidden text-ellipsis whitespace-nowrap">{type}</td>
      <td className="w-10 text-center"><span className={`w-30 p-2 rounded-full  ${getButtonClass(status)}`}>{status}</span></td>
      <td className="w-10 text-center">
        <button 
          onClick={() => {router.replace(`/editArticle/${articleId}`)}}
          className={`btn btn-ghost rounded-xl ${status === 'เสร็จสิ้น' ? 'btn-disabled' : ''}`}
                
        >
          <i className="fa-solid fa-pen text-(--color-warning)/80"></i>
        </button>
      </td>
      <td className="w-10 text-center">
        <button onClick={() => setIsModalOpen(true)} className={`btn btn-ghost rounded-xl ${status === 'เสร็จสิ้น' ? 'btn-disabled' : ''} `}>
          <i className="fa-solid fa-trash text-(--color-error)"></i>
        </button>
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="ยืนยันการลบ"
          message={`คุณแน่ใจจริงๆ หรือว่าจะลบบทความ "${title}"?`}
        />
      </td>
    </tr>
  )
};

export default TableFeature;