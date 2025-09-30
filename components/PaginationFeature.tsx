import { Pagination } from "@mui/material";
import TableFeature from "./articlemanagements/TableFeature";
import { Suspense, useEffect, useState } from "react";
import SearchResultItem from "./homes/SearchResultItem";
import HistiryTableFeature from "./myhistorys/HistiryTableFeature";
import TeacherArticeTableFeature from "./articlevalidations/TeacherArticeTableFeature";
import ManagementTableFeature from "./usermanagements/ManagementTableFeature";
import Loading from "@/app/loading";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type data = {
  mockData: object,
  pathName: string | undefined,
  rowsValue: number,
}

const PaginationFeature = ({ mockData, pathName, rowsValue }: data) => {
  const [tablePage, setTablePage] = useState(1); // หน้าเริ่มต้นของตาราง
  const [rowsPerPage, setRowsPerPage] = useState(10); // จำนวนเเถวต่อหน้า 
  const arrData = Object.values(mockData); // แปลง object เป็น array ของ values
  const varlueResult = arrData.slice((tablePage - 1) * rowsPerPage, tablePage * rowsPerPage);
  const pathname = usePathname();

  useEffect(() => {
    setRowsPerPage(rowsValue)
  }, [rowsValue])

  const tableBorder = (pathName: string | undefined) => {
    const isArticleManagement = pathname.startsWith('/articlemanagement');
    if (pathName !== '/' && !isArticleManagement && pathName !== '/usermanagement') {
      return 'overflow-x-auto  border-2 border-(--color-primary)/50 rounded-xl';
    } else {
      return '';
    };
  }


  return (
    <div className="w-full min-h-screen">
      <Suspense fallback={<Loading />}>
        <div className={`${tableBorder(pathName)} w-full min-h-screen`}>
          {pathname.startsWith('/articlemanagement') && (
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
                  return <TableFeature key={index} articleId={value.articleId} index={index + 1} title={value.article_name} uploadDate={value.uploadDate} publishYear={value.published_year} type={value.articleType} status={value.article_status} pathName={pathName} />
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
            <table className="w-full">
              <tbody className="w-full">
                {varlueResult.map((value, index) => ( // <-- เปลี่ยน key เป็น index เพื่อใช้หน่วงเวลา
                  // 1. เปลี่ยน <tr> ธรรมดา ให้เป็น motion.tr
                  <motion.tr
                    key={value.id || index} // <-- ใช้ id ที่ไม่ซ้ำกันจะดีที่สุดนะ
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }} // 2. ใช้ whileInView เพื่อให้ทำงานตอน scroll มาเจอ
                    viewport={{ once: true }} // 3. ตั้งค่าให้ animation ทำงานแค่ครั้งเดียว
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05 // 4. (เทคนิคพิเศษ!) หน่วงเวลาแต่ละแถวเล็กน้อย
                    }}
                    className="w-full  "
                  >
                    {/* 5. SearchResultItem ต้อง return <td>...</td> ออกมานะ */}
                    <SearchResultItem
                      id={value.id}
                      title={value.title}
                      athor={value.athor}
                      field={value.field}
                      offset={value.offset}
                      url={value.url}
                      abstract={value.abstract}
                      articleType={value.articleType}
                      publishedYear={value.publishedYear}
                    />
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}

          {pathName === '/articlevalidation' && (
            <table className=" w-full">
              <tbody className="w-full">
                {/* slice เเบ่งหน้า */}
                {varlueResult.map((value: { articleId?: number; id?: number; title?: string; article_name?: string; athor?: string; field?: string; offset?: string; url?: string; status?: string; article_status?: string }, key) => (
                  <tr key={value.articleId || value.id || key} className="w-full">
                    <TeacherArticeTableFeature articleId={value.articleId || value.id} title={value.title || value.article_name} athor={value.athor} field={value.field} offset={value.offset} url={value.url} status={value.status || value.article_status} />
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

                    <ManagementTableFeature 
                    key={value.userId ?? key} 
                    id={value.userId ?? key} 
                    name={value.name} 
                    email={value.email? 
                    value.email : 'ไม่มีข้อมูลอีเมล์'}  
                    type={value.type} 
                    description={value.detail} 
                    loginDate={value.login_check_date? value.login_check_date:'ไม่มีข้อมูลเข้าใช้'} />

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

export default PaginationFeature;

