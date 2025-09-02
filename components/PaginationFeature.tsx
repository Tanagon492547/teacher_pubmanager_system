import { Pagination } from "@mui/material";
import TableFeature from "./articlemanagements/TableFeature";
import { Suspense, useEffect, useState } from "react";
import SearchResultItem from "./homes/SearchResultItem";
import HistiryTableFeature from "./myhistorys/HistiryTableFeature";
import TeacherArticeTableFeature from "./articlevalidations/TeacherArticeTableFeature";
import ManagementTableFeature from "./usermanagements/ManagementTableFeature";
import Loading from "@/app/loading";

type data = {
  mockData: object,
  pathName: string | undefined,
  rowsValue: number,
}

const paginationFeature = ({ mockData, pathName, rowsValue }: data) => {
  const [tablePage, setTablePage] = useState(1); // หน้าเริ่มต้นของตาราง
  const [rowsPerPage, setRowsPerPage] = useState(10); // จำนวนเเถวต่อหน้า 
  const arrData = Object.values(mockData); // แปลง object เป็น array ของ values
  const varlueResult = arrData.slice((tablePage - 1) * rowsPerPage, tablePage * rowsPerPage);


  useEffect(() => {
    setRowsPerPage(rowsValue)
  })

  const tableBorder = (pathName: any) => {
    if (pathName !== '/' && pathName !== '/articlevalidation' && pathName !== '/usermanagement') {
      return 'overflow-x-auto  border-2 border-(--color-primary)/50 rounded-xl';
    } else {
      return '';
    };
  }


  return (
    <div className="w-full min-h-screen">
      <Suspense fallback={<Loading />}>
        <div className={`${tableBorder(pathName)} w-full min-h-screen`}>
          {pathName === '/articlemanagement' && (
            <table className="table">
              <thead>
                <tr>
                  <th className="w-10 text-center align-top"><p>ลำดับ</p></th>
                  <th className="w-xl align-top">หัวข้อ</th>
                  <th className="w-32 text-center align-top"><p>วันที่อัปโหลด</p></th>
                  <th className=" w-24 text-center align-top"><p>ปีที่พิมพ์</p></th>
                  <th className="w-24 text-center align-top"><p>ประเภท</p></th>
                  <th className="w-30 text-center align-top"><p>สถานะ</p></th>
                  <th className="w-12 text-center align-top"><p>เเก้ไข</p></th>
                  <th className="w-12 text-center align-top"><p>ลบ</p></th>
                </tr>
              </thead>
              <tbody >
                {varlueResult.map((value, index) => {
                  return <TableFeature key={index} index={index + 1} title={value.หัวข้อ} uploadDate={value.วันที่อัปโหลด} publishYear={value.ปีที่พิมพ์} type={value.ประเภท} status={value.สถานะ} pathName={pathName} />
                })}
              </tbody>
            </table>
          )
          }

          {pathName === '/myhistory' && (
            <table className="table ">
              <thead>
                <tr>

                  <th className="w-xl align-top">หัวข้อ</th>
                  <th className="w-30 text-center align-top"><p>สถานะ</p></th>
                  <th className="w-32 text-center align-top"><p>วันที่อัปโหลด</p></th>
                  <th className=" w-24 text-center align-top"><p>วันที่บทความสมบูรณ์</p></th>
                  <th className="w-24 text-center align-top"><p>ผู้ตรวจ</p></th>

                </tr>
              </thead>
              <tbody>
                {varlueResult.map((value, index) => {
                  return <HistiryTableFeature key={index} index={index + 1} title={value.หัวข้อ} uploadDate={value.วันที่อัปโหลด} successDate={value.วันที่บทความสมบูรณ์} inspector={value.ผู้ตรวจ} status={value.สถานะ} pathName={pathName} />
                })}
              </tbody>
            </table>
          )}

          {pathName === '/' && (
            <table className=" w-full">
              <tbody className="w-full">
                {/* slice เเบ่งหน้า */}
                {varlueResult.map((value, key) => (
                  <tr key={key} className="w-full">
                    <SearchResultItem title={value.title} athor={value.athor} field={value.field} offset={value.offset} url={value.url} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pathName === '/articlevalidation' && (
            <table className=" w-full">
              <tbody className="w-full">
                {/* slice เเบ่งหน้า */}
                {varlueResult.map((value, key) => (
                  <tr key={key} className="w-full">
                    <TeacherArticeTableFeature title={value.title} athor={value.athor} field={value.field} offset={value.offset} url={value.url} status={value.status} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pathName === '/usermanagement' && (
            <div className="overflow-x-auto">
              <table className="table ">
                {/* head */}
                <thead>
                  <tr>
                    <th className="w-70 ">บัญชีผู้ใช้</th>
                    <th className="w-10 text-center" >ประเภท</th>
                    <th className="w-10 text-center">รายละเอียด</th>
                    <th className="w-10  text-center">เข้าสู่ระบบล่าสุด</th>
                    <th className="w-10 text-center">เเก้ไขข้อมูล</th>
                    <th className="w-10 text-center">ลบ</th>
                  </tr>
                </thead>


                <tbody className="w-full">
                  {/* slice เเบ่งหน้า */}
                  {varlueResult.map((value, key) => (

                    <ManagementTableFeature key={key} name={value.ชื่ออาจารย์} email={value.อีเมล์} type={value.ประเภท} description={value.รายละเอียด} loginDate={value.เข้าสู่ระบบล่าสุด} />

                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </Suspense>
      <div className="flex w-full my-10 justify-between items-center">
        <div>
          <p className="text-lg">แสดง {rowsPerPage} จาก {Object.entries(mockData).length} รายการ</p>
        </div>
        <Pagination
          count={Math.ceil(Object.entries(mockData).length / rowsPerPage)} // จำนวนหน้า
          page={tablePage}
          onChange={(_, value) => setTablePage(value)}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
}

export default paginationFeature;

