"use client"; // เหมือนบอกว่า component นี้ใช้ client-side rendering

import { useState } from "react";

const SearchForm = () => {


  const [publicationType, setPublicationType] = useState("0");
  const [teacherRole, setTeacherRole] = useState("0");


  return (
     <div className="w-full rounded-xl border-(--color-border)/20  flex flex-col justify-center items-center my-10 border-2">
        <form action="" className="w-full p-5">
          <div className="w-full flex flex-row h-auto">
            <div className="w-full">
              <div className="w-full flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="">คำค้นหา</label>
                  <input type="text"
                    className="input input-(--color-border)/5  p-5 w-full line-clamp-1"
                    placeholder="กรอกคำสำคัญ ชื่อเรื่อง ชื่ออาจารย์ เเละอื่นๆ " />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row">
                    <div className="mr-10">
                      <label htmlFor="">ปีที่พิมพ์</label>
                      <div className="flex flex-row gap-2 items-center">
                        <input type="number"
                          className="input validator input-(--color-border)/5  p-5 w-full max-w-(--2xs) flex text-center line-clamp-1"
                          placeholder="เริ่มต้น"
                          min="1000"
                        />
                        <p>ถึง</p>
                        <input type="number"
                          className="input  validator input-(--color-border)/5  p-5 w-full max-w-(--2xs) flex text-center line-clamp-1"
                          placeholder="สิ้นสุด"
                          min="1001"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <label htmlFor="">ประเภทผลงาน</label>
                      <fieldset className="fieldset ">
                        <select className="select px-5 w-full"  value={publicationType} onChange={(e) => setPublicationType(e.target.value)}>
                          <option  value='0' disabled >ทุกประเภท</option>
                          <option   value='1'>Chrome</option>
                          <option  value='2'>FireFox</option>
                          <option  value='3'>Safari</option>
                        </select>
                      </fieldset>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="">ตำเเหน่งอาจารย์</label>
                  <fieldset className="fieldset ">
                    <select className="select px-5 w-full" value={teacherRole} onChange={(e) => setTeacherRole(e.target.value)}>
                      <option value='0' disabled >ทุกตำเเหน่ง</option>
                      <option value='1' >Chrome</option>
                      <option value='2' >FireFox</option>
                      <option value='3' >Safari</option>
                    </select>
                  </fieldset>
                </div>
              </div>
            </div>
            <div className="md:w-150 bg-base-300/20 rounded-2xl max-h-fit ml-5 px-5 flex flex-col justify-center items-center gap-4">
                  <div className="flex justify-start w-full text-3xl text-(--color-base-herder-content)"><p>ตัวกรองด่วน</p></div>
                  <button className="btn btn-neutral btn-outline w-full justify-start">ตีพิมพ์ล่าสุด</button>
                  <button className="btn btn-neutral btn-outline w-full justify-start">ดาวน์โหลดมากสุด</button>
                  <button className="btn btn-neutral btn-outline w-full justify-start">บทความวารสาร</button>
                  <button className="btn btn-neutral btn-outline w-full justify-start">หนังสือ เเละตำราเรียน</button>
            </div>
          </div>
          <div className="w-full flex justify-between mt-5">
            <button className="btn btn-success px-20">ค้นหา</button>
            <button className="btn btn-link flex justify-center items-center no-underline text-(--color-border)"><i className="fa-solid fa-rotate-left flex"></i> <p>รีเซ็ตตัวกรอง</p></button>
          </div>
        </form>
      </div>
  );
}

export default SearchForm;