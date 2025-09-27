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
  uploadDate: string | undefined,
  publishYear: string | undefined,
  type: string | undefined,
  status: string | undefined,
  articleId?: number,
}

const TableFeature = ({ pathName, index, title, uploadDate, publishYear, type, status, articleId }: tableHerdersType) => {
    const router =  useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleConfirmDelete = async () => {

    // if(articleId){
    //   const result = await getDeleteForm(articleId);
    // }
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

  return (
    <tr key={index}>
      <td className="w-10 text-center">{index}</td>
      <td className="">{title}</td>
      <td className="w-10 text-center">{uploadDate}</td>
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
        <button  onClick={async () => {
            // 1. แสดงกล่องคำถามขึ้นมาก่อน
            const confirmed = window.confirm(
              `คุณแน่ใจจริงๆ หรือว่าจะลบบทความ "${title}"?`
            );

            // 2. ถ้าผู้ใช้กด "OK" (confirmed === true)
            if (confirmed) {
              // 3. ก็ให้เรียก Server Action เพื่อลบข้อมูลได้เลย
              if(articleId){
                const result = await getDeleteForm(articleId);

              // 4. (ทางเลือก) แสดง alert ง่ายๆ บอกผลลัพธ์
              if (result.success) {
                alert(result.message);
              } else {
                alert(`เกิดข้อผิดพลาด: ${result.error}`);
              }
              }
            }
          }} className={`btn btn-ghost rounded-xl ${status === 'เสร็จสิ้น' ? 'btn-disabled' : ''} `}><i className="fa-solid fa-trash text-(--color-error)"></i></button></td>
    </tr>
  )
};

export default TableFeature;