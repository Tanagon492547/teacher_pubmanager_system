
type tableHerdersType = {
  pathName: string | undefined, // จะทำตัวเช็คหน้าที่ส่งเข้ามา
  index: number | undefined,
  title: string | undefined,
  uploadDate: string | undefined,
  publishYear: string | undefined,
  type: string | undefined,
  status: string | undefined,
}

const TableFeature = ({ pathName, index, title, uploadDate, publishYear, type, status }: tableHerdersType) => {
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

  return (
    <tr key={index}>
      <td className="w-10 text-center">{index}</td>
      <td className="">{title}</td>
      <td className="w-10 text-center">{uploadDate}</td>
      <td className="w-10 text-center">{publishYear}</td>
      <td className="w-10 text-center">{type}</td>
      <td className="w-10 text-center"><span className={`w-30 p-2 rounded-full  ${getButtonClass(status)}`}>{status}</span></td>
      <td className="w-10 text-center"><button className={`btn btn-ghost rounded-xl ${status === 'เสร็จสิ้น' ? 'btn-disabled' : ''}`}><i className="fa-solid fa-pen text-(--color-warning)/80"></i></button></td>
      <td className="w-10 text-center"><button onClick={() =>alert('ลบข้อมูลสำเร็จ') } className={`btn btn-ghost rounded-xl ${status === 'เสร็จสิ้น' ? 'btn-disabled' : ''} `}><i className="fa-solid fa-trash text-(--color-error)"></i></button></td>
    </tr>
  )
};

export default TableFeature;