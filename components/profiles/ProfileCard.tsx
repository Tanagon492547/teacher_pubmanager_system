"use client"
import { useEffect, useState } from "react";
import Image from 'next/image';

type props = {
  academic_user?: string,
  fname_user?: string,
  lname_user?: string,
  gender_user?: string,
  faculty_user?: string,
  department_user?: string,
  numberPhone_user?: string,
  email_user?: string,
  image_user?: string,
}

const ProfileCard = (props: props) => {
  const [academic, setAcademic] = useState(props.academic_user); //Academic ตำเเหน่งอะน้อง
  const [fname, setFname] = useState(props.fname_user);
  const [lname, setLname] = useState(props.lname_user)
  const [gender, setGender] = useState(props.gender_user);
  const [faculty, setFaculty] = useState(props.faculty_user);
  const [department, setDepartment] = useState(props.department_user); //สาขา
  const [numberPhone, setNumberPhone] = useState(props.numberPhone_user);
  const [email, setEmail] = useState(props.email_user);
  const [nameFull, setNameFull] = useState('')

  useEffect(()=>{
    setNameFull(academic + ' ' + fname + ' ' + lname)
  },[])
  return (
    <div className="flex flex-col items-center py-8">
      {/* รูปโปรไฟล์ */}
      <div className="relative">
        <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          {/* สามารถใส่ <img src="..." /> ได้ */}
          {props.image_user && (
            <Image
              src={props.image_user} // <-- เปลี่ยนตรงนี้เลย!
              alt="Picture of the author"
              width={500}
              height={500} 
            />
              )}
        </div>
        <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow">
          <span role="img" aria-label="edit">✏️</span>
        </button>
      </div>

      {/* กล่องรายละเอียด */}
      <div className="mt-8 w-full max-w-xl">
        <div className="bg-white rounded-xl shadow p-6 mb-6 relative">
          <h2 className="text-lg font-semibold mb-2 border-b pb-2">รายละเอียด</h2>
          <button className="absolute top-4 right-4 text-gray-500">
            <span role="img" aria-label="edit">✏️</span>
          </button>
          <div className="grid grid-cols-2 gap-y-2">
            <div>ชื่อ</div>
            <div className="font-medium">{nameFull}</div>
            <div>เพศ</div>
            <div className="font-medium">{gender}</div>
            <div>ตำแหน่งทางวิชาการ</div>
            <div className="font-medium">{academic}</div>
            <div>คณะ/ภาควิชา</div>
            <div className="font-medium">{faculty}</div>
            <div>สาขาความเชี่ยวชาญ</div>
            <div className="font-medium">{department}</div>
          </div>
        </div>

        {/* กล่องช่องทางการติดต่อ */}
        <div className="bg-white rounded-xl shadow p-6 relative">
          <h2 className="text-lg font-semibold mb-2 border-b pb-2">ช่องทางการติดต่อ</h2>
          <button className="absolute top-4 right-4 text-gray-500">
            <span role="img" aria-label="edit">✏️</span>
          </button>
          <div className="grid grid-cols-2 gap-y-2">
            <div>เบอร์โทร</div>
            <div className="font-medium">{numberPhone}</div>
            <div>อีเมล</div>
            <div className="font-medium">{email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard;