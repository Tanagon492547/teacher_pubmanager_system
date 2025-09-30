
type tableHerdersType = {
  pathName: string | undefined, // จะทำตัวเช็คหน้าที่ส่งเข้ามา
  index: number | undefined,
  title: string | undefined,
  uploadDate: string | undefined,
  successDate : string | undefined,
  inspector : string | undefined,
  status: string | undefined,
  onViewDetail?: () => void,
}

const HistiryTableFeature = ({ pathName, index, title, uploadDate, successDate,  inspector ,status, onViewDetail }: tableHerdersType) => {
  const getButtonClass = (status: any) => {
    if (status === 'กำลังตรวจ' || status === 'รอตรวจ') {
      return "badge bg-[var(--color-warning)]/70 text-[var(--color-success-content)]";
    } else if (status === 'ต้องเเก้ไข') {
      return "badge bg-[var(--color-error)] text-[var(--color-success-content)]";
    } else if (status === 'ข้อมูลสมบูรณ์') {
      return "badge bg-[var(--color-success)] text-[var(--color-success-content)]";
    } else if (status === 'เสร็จสิ้น') {
      return "badge bg-[var(--color-success)] text-[var(--color-success-content)]";
    }
    return "badge";
  };

  return (
    <tr key={index}>
      <td className="">{title}</td>
      <td className="w-10 text-center"><span className={`w-30 p-2 rounded-full  ${getButtonClass(status)}`}>{status}</span></td>
      <td className="w-10 text-center">{uploadDate}</td>
      <td className="w-10 text-center">{successDate}</td>
      <td className="w-10 text-center">{inspector}</td>
      <td className="w-10 text-center">
        {onViewDetail && (
          <button 
            onClick={onViewDetail}
            className="btn btn-sm btn-ghost"
          >
            ดูรายละเอียด
          </button>
        )}
      </td>
    </tr>
  )
};

export default HistiryTableFeature;