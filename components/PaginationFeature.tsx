import { Pagination } from "@mui/material";
import TableFeature from "./articlemanagements/TableFeature";
import { Suspense, useEffect, useMemo, useState } from "react";
import SearchResultItem from "./homes/SearchResultItem";
import HistiryTableFeature from "./myhistorys/HistiryTableFeature";
import TeacherArticeTableFeature from "./articlevalidations/TeacherArticeTableFeature";
import ManagementTableFeature from "./usermanagements/ManagementTableFeature";
import Loading from "@/app/loading";

type ArticleRow = {
  หัวข้อ: string;
  วันที่อัปโหลด: string;
  ปีที่พิมพ์: string;
  ประเภท: string;
  สถานะ: string;
};

const isArticleRow = (v: unknown): v is ArticleRow => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o['หัวข้อ'] === 'string' &&
    typeof o['วันที่อัปโหลด'] === 'string' &&
    typeof o['ปีที่พิมพ์'] === 'string' &&
    typeof o['ประเภท'] === 'string' &&
    typeof o['สถานะ'] === 'string'
  );
};

type HomeSearchItem = {
  id: string | number;
  title: string;
  athor: string;
  field: string;
  offset: string;
  url: string;
};

const isHomeSearchItem = (v: unknown): v is HomeSearchItem => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    (typeof o.id === 'string' || typeof o.id === 'number') &&
    typeof o.title === 'string' &&
    typeof o.athor === 'string' &&
    typeof o.field === 'string' &&
    typeof o.offset === 'string' &&
    typeof o.url === 'string'
  );
};

type ValidationItem = {
  title: string;
  athor: string;
  field: string;
  offset: string;
  url: string;
  status: string;
};

const isValidationItem = (v: unknown): v is ValidationItem => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.title === 'string' &&
    typeof o.athor === 'string' &&
    typeof o.field === 'string' &&
    typeof o.offset === 'string' &&
    typeof o.url === 'string' &&
    typeof o.status === 'string'
  );
};

type HistoryRow = {
  หัวข้อ: string;
  วันที่อัปโหลด: string;
  วันที่บทความสมบูรณ์: string;
  ผู้ตรวจ: string;
  สถานะ: string;
};

const isHistoryRow = (v: unknown): v is HistoryRow => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o['หัวข้อ'] === 'string' &&
    typeof o['วันที่อัปโหลด'] === 'string' &&
    typeof o['วันที่บทความสมบูรณ์'] === 'string' &&
    typeof o['ผู้ตรวจ'] === 'string' &&
    typeof o['สถานะ'] === 'string'
  );
};

type UserRow = {
  ชื่ออาจารย์: string;
  อีเมล์: string;
  ประเภท: string;
  รายละเอียด: string;
  เข้าสู่ระบบล่าสุด: string;
};

const isUserRow = (v: unknown): v is UserRow => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o['ชื่ออาจารย์'] === 'string' &&
    typeof o['อีเมล์'] === 'string' &&
    typeof o['ประเภท'] === 'string' &&
    typeof o['รายละเอียด'] === 'string' &&
    typeof o['เข้าสู่ระบบล่าสุด'] === 'string'
  );
};

type data = {
  mockData: unknown[] | Record<string, unknown>,
  pathName?: string,
  rowsValue: number,
}

const STORAGE_KEY = 'myArticles';

const PaginationFeatureComponent = ({ mockData, pathName, rowsValue }: data) => {
  const [tablePage, setTablePage] = useState(1); // หน้าเริ่มต้นของตาราง
  const [rowsPerPage, setRowsPerPage] = useState(10); // จำนวนเเถวต่อหน้า 
  const initialList: unknown[] = Array.isArray(mockData)
    ? mockData
    : Object.values(mockData as Record<string, unknown>);
  const [dataList, setDataList] = useState<unknown[]>(initialList);
  const arrData = dataList; // ใช้ state เพื่ออัปเดตหลังลบ/แก้ไข
  const varlueResult = useMemo(() => arrData.slice((tablePage - 1) * rowsPerPage, tablePage * rowsPerPage), [arrData, tablePage, rowsPerPage]);

  // สถานะสำหรับ ดู/แก้ไขแยก: ดู, แก้ไขสถานะ, แก้ไขบทความ
  const [viewing, setViewing] = useState<ArticleRow | null>(null);
  const [editingStatus, setEditingStatus] = useState<ArticleRow | null>(null);
  const [statusDraft, setStatusDraft] = useState<string>('กำลังตรวจ');
  const [editingArticle, setEditingArticle] = useState<ArticleRow | null>(null);
  const [articleDraft, setArticleDraft] = useState<ArticleRow | null>(null);


  useEffect(() => {
    setRowsPerPage(rowsValue)
  }, [rowsValue])

  // sync เมื่อ mockData (props) เปลี่ยน เช่น หลังจาก parent โหลดข้อมูลจาก localStorage เสร็จ
  useEffect(() => {
    const nextList: unknown[] = Array.isArray(mockData)
      ? mockData
      : Object.values(mockData as Record<string, unknown>);
    setDataList(nextList);
    setTablePage(1);
  }, [mockData]);

  // ฟังก์ชันลบรายการเฉพาะหน้า /articlemanagement เท่านั้น
  const handleDelete = (row: unknown) => {
    if (pathName !== '/articlemanagement') return;
    if (!isArticleRow(row)) return;
    // ลบจาก localStorage
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      const stored = raw ? (JSON.parse(raw) as unknown[]) : [];
      // match ตามฟิลด์หลัก
      const nextStored = stored.filter((r) => {
        if (!isArticleRow(r)) return true;
        return !(
          r.หัวข้อ === row.หัวข้อ &&
          r.วันที่อัปโหลด === row.วันที่อัปโหลด &&
          r.ปีที่พิมพ์ === row.ปีที่พิมพ์
        );
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStored));
      }
    } catch { /* ignore */ }

    // อัปเดต state ปัจจุบัน ให้หายจากตารางทันที
    setDataList((prev) => prev.filter((r) => {
      if (!isArticleRow(r)) return true;
      return !(
        r.หัวข้อ === row.หัวข้อ &&
        r.วันที่อัปโหลด === row.วันที่อัปโหลด &&
        r.ปีที่พิมพ์ === row.ปีที่พิมพ์
      );
    }));
  };

  // ดูบทความ
  const handleStartView = (row: unknown) => {
    if (pathName !== '/articlemanagement') return;
    if (!isArticleRow(row)) return;
    setViewing(row);
  };

  // แก้ไขสถานะ
  const handleStartEditStatus = (row: unknown) => {
    if (pathName !== '/articlemanagement') return;
    if (!isArticleRow(row)) return;
    setEditingStatus(row);
    setStatusDraft(row.สถานะ);
  };

  const handleSaveStatus = () => {
    if (!editingStatus) return;
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      const stored = raw ? (JSON.parse(raw) as unknown[]) : [];
      const nextStored = stored.map((r) => {
        if (!isArticleRow(r)) return r;
        if (
          r.หัวข้อ === editingStatus.หัวข้อ &&
          r.วันที่อัปโหลด === editingStatus.วันที่อัปโหลด &&
          r.ปีที่พิมพ์ === editingStatus.ปีที่พิมพ์
        ) {
          return { ...r, สถานะ: statusDraft } as ArticleRow;
        }
        return r;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStored));
      }
    } catch { /* ignore */ }
    // update view
    setDataList((prev) => prev.map((r) => {
      if (!isArticleRow(r)) return r;
      if (
        r.หัวข้อ === editingStatus.หัวข้อ &&
        r.วันที่อัปโหลด === editingStatus.วันที่อัปโหลด &&
        r.ปีที่พิมพ์ === editingStatus.ปีที่พิมพ์
      ) {
        return { ...r, สถานะ: statusDraft } as ArticleRow;
      }
      return r;
    }));
    setEditingStatus(null);
  };

  const handleCancelStatus = () => setEditingStatus(null);

  // แก้ไขบทความ (ไม่รวมสถานะ)
  const handleStartEditArticle = (row: unknown) => {
    if (pathName !== '/articlemanagement') return;
    if (!isArticleRow(row)) return;
    setEditingArticle(row);
    setArticleDraft({ ...row });
  };

  const handleSaveArticle = () => {
    if (!editingArticle || !articleDraft) return;
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      const stored = raw ? (JSON.parse(raw) as unknown[]) : [];
      const nextStored = stored.map((r) => {
        if (!isArticleRow(r)) return r;
        if (
          r.หัวข้อ === editingArticle.หัวข้อ &&
          r.วันที่อัปโหลด === editingArticle.วันที่อัปโหลด &&
          r.ปีที่พิมพ์ === editingArticle.ปีที่พิมพ์
        ) {
          // เขียนทับเฉพาะฟิลด์บทความ (คงค่า สถานะ เดิม)
          return {
            ...r,
            หัวข้อ: articleDraft.หัวข้อ,
            วันที่อัปโหลด: articleDraft.วันที่อัปโหลด,
            ปีที่พิมพ์: articleDraft.ปีที่พิมพ์,
            ประเภท: articleDraft.ประเภท,
          } as ArticleRow;
        }
        return r;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStored));
      }
    } catch { /* ignore */ }
    setDataList((prev) => prev.map((r) => {
      if (!isArticleRow(r)) return r;
      if (
        r.หัวข้อ === editingArticle.หัวข้อ &&
        r.วันที่อัปโหลด === editingArticle.วันที่อัปโหลด &&
        r.ปีที่พิมพ์ === editingArticle.ปีที่พิมพ์
      ) {
        return {
          ...r,
          หัวข้อ: articleDraft.หัวข้อ,
          วันที่อัปโหลด: articleDraft.วันที่อัปโหลด,
          ปีที่พิมพ์: articleDraft.ปีที่พิมพ์,
          ประเภท: articleDraft.ประเภท,
        } as ArticleRow;
      }
      return r;
    }));
    setEditingArticle(null);
    setArticleDraft(null);
  };

  const handleCancelArticle = () => {
    setEditingArticle(null);
    setArticleDraft(null);
  };

  const tableBorder = (pathName: string | undefined) => {
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
                  <th className="w-12 text-center align-top"><p>ดู</p></th>
                  <th className="w-20 text-center align-top"><p>แก้ไขสถานะ</p></th>
                  <th className="w-20 text-center align-top"><p>แก้ไขบทความ</p></th>
                  <th className="w-12 text-center align-top"><p>ลบ</p></th>
                </tr>
              </thead>
              <tbody >
                {varlueResult.map((value, index) => {
                  // เฉพาะหน้า articlemanagement เท่านั้นที่มีปุ่มลบ
                  return (
                    <TableFeature
                      key={isArticleRow(value) ? `${value.หัวข้อ}-${value.วันที่อัปโหลด}-${value.ปีที่พิมพ์}` : index}
                      index={(tablePage - 1) * rowsPerPage + index + 1}
                      title={isArticleRow(value) ? value.หัวข้อ : undefined}
                      uploadDate={isArticleRow(value) ? value.วันที่อัปโหลด : undefined}
                      publishYear={isArticleRow(value) ? value.ปีที่พิมพ์ : undefined}
                      type={isArticleRow(value) ? value.ประเภท : undefined}
                      status={isArticleRow(value) ? value.สถานะ : undefined}
                      onView={isArticleRow(value) ? (() => handleStartView(value)) : undefined}
                      onEditStatus={isArticleRow(value) ? (() => handleStartEditStatus(value)) : undefined}
                      onEditArticle={isArticleRow(value) ? (() => handleStartEditArticle(value)) : undefined}
                      onDelete={isArticleRow(value) ? (() => handleDelete(value)) : undefined}
                    />
                  )
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
                {varlueResult.map((value, index) => (
                  isHistoryRow(value) ? (
                    <HistiryTableFeature
                      key={index}
                      index={index + 1}
                      title={value.หัวข้อ}
                      uploadDate={value.วันที่อัปโหลด}
                      successDate={value.วันที่บทความสมบูรณ์}
                      inspector={value.ผู้ตรวจ}
                      status={value.สถานะ}
                      pathName={pathName}
                    />
                  ) : null
                ))}
              </tbody>
            </table>
          )}

          {pathName === '/' && (
            <table className=" w-full">
              <tbody className="w-full">
                {/* slice เเบ่งหน้า */}
                {varlueResult.map((value, key) => (
                  isHomeSearchItem(value) ? (
                    <tr key={key} className="w-full">
                      <SearchResultItem id={value.id} title={value.title} athor={value.athor} field={value.field} offset={value.offset} url={value.url} />
                    </tr>
                  ) : null
                ))}
              </tbody>
            </table>
          )}

          {pathName === '/articlevalidation' && (
            <table className=" w-full">
              <tbody className="w-full">
                {/* slice เเบ่งหน้า */}
                {varlueResult.map((value, key) => (
                  isValidationItem(value) ? (
                    <tr key={key} className="w-full">
                      <TeacherArticeTableFeature title={value.title} athor={value.athor} field={value.field} offset={value.offset} url={value.url} status={value.status} />
                    </tr>
                  ) : null
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
                    isUserRow(value) ? (
                      <ManagementTableFeature
                        key={key}
                        name={value.ชื่ออาจารย์}
                        email={value.อีเมล์}
                        type={value.ประเภท}
                        description={value.รายละเอียด}
                        loginDate={value.เข้าสู่ระบบล่าสุด}
                      />
                    ) : null
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </Suspense>
      <div className="flex w-full my-10 justify-between items-center">
        <div>
          <p className="text-lg">แสดง {varlueResult.length} จาก {dataList.length} รายการ</p>
        </div>
        <Pagination
          count={Math.ceil(dataList.length / rowsPerPage)} // จำนวนหน้า
          page={tablePage}
          onChange={(_, value) => setTablePage(value)}
          variant="outlined"
          shape="rounded"
        />
      </div>

      {/* View Modal */}
      {pathName === '/articlemanagement' && viewing && (
        <dialog className="modal" open>
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">รายละเอียดบทความ</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">หัวข้อ:</span> {viewing.หัวข้อ}</p>
              <p><span className="font-semibold">วันที่อัปโหลด:</span> {viewing.วันที่อัปโหลด}</p>
              <p><span className="font-semibold">ปีที่พิมพ์:</span> {viewing.ปีที่พิมพ์}</p>
              <p><span className="font-semibold">ประเภท:</span> {viewing.ประเภท}</p>
              <p><span className="font-semibold">สถานะ:</span> {viewing.สถานะ}</p>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setViewing(null)}>ปิด</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setViewing(null)}>close</button>
          </form>
        </dialog>
      )}

      {/* Edit Status Modal */}
      {pathName === '/articlemanagement' && editingStatus && (
        <dialog className="modal" open>
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">แก้ไขสถานะ</h3>
            <div className="form-control gap-3">
              <label className="label">
                <span className="label-text">สถานะ</span>
              </label>
              <select
                className="select select-bordered"
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value)}
              >
                <option value="กำลังตรวจ">กำลังตรวจ</option>
                <option value="ต้องเเก้ไข">ต้องเเก้ไข</option>
                <option value="ข้อมูลสมบูรณ์">ข้อมูลสมบูรณ์</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
              </select>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={handleCancelStatus}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={handleSaveStatus}>บันทึก</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCancelStatus}>close</button>
          </form>
        </dialog>
      )}

      {/* Edit Article Modal */}
      {pathName === '/articlemanagement' && editingArticle && articleDraft && (
        <dialog className="modal" open>
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">แก้ไขบทความ</h3>
            <div className="form-control gap-3">
              <label className="label">
                <span className="label-text">หัวข้อ</span>
              </label>
              <input
                className="input input-bordered"
                value={articleDraft.หัวข้อ}
                onChange={(e) => setArticleDraft({ ...articleDraft, หัวข้อ: e.target.value })}
              />

              <label className="label">
                <span className="label-text">วันที่อัปโหลด (dd/mm/yyyy)</span>
              </label>
              <input
                className="input input-bordered"
                value={articleDraft.วันที่อัปโหลด}
                onChange={(e) => setArticleDraft({ ...articleDraft, วันที่อัปโหลด: e.target.value })}
              />

              <label className="label">
                <span className="label-text">ปีที่พิมพ์ (yyyy)</span>
              </label>
              <input
                className="input input-bordered"
                value={articleDraft.ปีที่พิมพ์}
                onChange={(e) => setArticleDraft({ ...articleDraft, ปีที่พิมพ์: e.target.value })}
              />

              <label className="label">
                <span className="label-text">ประเภท</span>
              </label>
              <input
                className="input input-bordered"
                value={articleDraft.ประเภท}
                onChange={(e) => setArticleDraft({ ...articleDraft, ประเภท: e.target.value })}
              />
            </div>
            <div className="modal-action">
              <button className="btn" onClick={handleCancelArticle}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={handleSaveArticle}>บันทึก</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCancelArticle}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
export default PaginationFeatureComponent;

