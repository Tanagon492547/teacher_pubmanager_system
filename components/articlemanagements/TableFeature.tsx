
type tableHerdersType = {
  index: number | undefined,
  title: string | undefined,
  uploadDate: string | undefined,
  publishYear: string | undefined,
  type: string | undefined,
  status: string | undefined,
  onView?: () => void,
  onEditStatus?: () => void,
  onEditArticle?: () => void,
  onDelete?: () => void,
}

const TableFeature = ({ index, title, uploadDate, publishYear, type, status, onView, onEditStatus, onEditArticle, onDelete }: tableHerdersType) => {
  const getButtonClass = (status: string | undefined) => {
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

  return (
    <tr key={index}>
      <td className="w-10 text-center">{index}</td>
      <td className="">{title}</td>
      <td className="w-10 text-center">{uploadDate}</td>
      <td className="w-10 text-center">{publishYear}</td>
      <td className="w-10 text-center">{type}</td>
      <td className="w-10 text-center"><span className={`w-30 p-2 rounded-full  ${getButtonClass(status)}`}>{status}</span></td>
      <td className="w-10 text-center"><button onClick={onView} className={`btn btn-ghost rounded-xl`}><i className="fa-solid fa-eye text-(--color-base-content)"></i></button></td>
      <td className="w-10 text-center"><button onClick={onEditStatus} className={`btn btn-ghost rounded-xl`}><i className="fa-solid fa-clipboard-check text-(--color-warning)/80"></i></button></td>
      <td className="w-10 text-center"><button onClick={onEditArticle} className={`btn btn-ghost rounded-xl ${status === 'เสร็จสิ้น' ? 'btn-disabled' : ''}`}><i className="fa-solid fa-pen text-(--color-warning)/80"></i></button></td>
      <td className="w-10 text-center"><button onClick={onDelete} className={`btn btn-ghost rounded-xl ${status === 'เสร็จสิ้น' ? 'btn-disabled' : ''} `}><i className="fa-solid fa-trash text-(--color-error)"></i></button></td>
    </tr>
  )
};

export default TableFeature;