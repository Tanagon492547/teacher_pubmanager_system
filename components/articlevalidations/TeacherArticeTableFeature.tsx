type Users = {
  title: string | undefined;
  athor: string | undefined;
  field: string | undefined;
  offset: string | undefined;
  url: string | undefined;
  status: string | undefined;
}

const TeacherArticeTableFeature = ({title, athor, field, offset, status}: Users)  => {
  const statusValidation = (status : string | undefined) =>{
    if(status  === 'รอการตรวจสอบ'){
      return  "badge badge-warning";
    }else if(status  === 'รอการยืนยัน'){
      return  "badge badge-success ";
    }
    return  "badge badge-primary";
  }
  return (
    <td className="w-full  flex flex-col my-1">
        <div className="w-full  border-2 p-5 rounded-xl flex flex-row border-(--color-border)/20  justify-between items-center">
          <div className="flex  flex-col  gap-2">
            <div  className="flex flex-row gap-5">
              <p>{title}</p>
              <div><div className={`${statusValidation(status)}`}>{status}</div></div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
                <i className ="fa-solid fa-face-smile"></i>
                <p>{athor} {field} {offset}</p>
                <p className="badge badge-primary">วารสาร</p>
            </div>
          </div>
          <button className="btn btn-primary  flex flex-row items-center"><p>ตรวจรายละเอียด</p><i className="fa-solid fa-eye"></i></button>
        </div>
    </td>
  );
}

export default TeacherArticeTableFeature;