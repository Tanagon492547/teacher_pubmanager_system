import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center px-4 py-10 bg-base-200">
      <div className="w-lg flex flex-col justify-between items-center rounded-2xl gap-6 py-20 bg-base-100 px-10 shadow-lg">
        <div className="w-16 h-16 flex justify-center items-center rounded-xl bg-(--color-primary)/90 text-(--color-primary-content) text-2xl">
          <i className="fa-solid fa-lock "></i>
        </div>

        <div className="w-full flex flex-col justify-center items-center gap-1">
          <p className="text-xl font-bold">ระบบบริหารจัดการผลงานตีพิมพ์</p>
          <p className="text-md">กรอก username เเละ password ของคุณ</p>
        </div>

        <div className="w-6/7 flex flex-col justify-center items-center">
          <form action="" className="w-full flex flex-col gap-2">
            <label htmlFor="usernamea or Emmail" className="text-xs font-medium">Username หรือ Email</label>
            <div className="w-full relative">
              <div className="flex justify-center items-center w-14 h-full  absolute z-99">
                <i className="fa-solid fa-user text-(--color-border)/40 "></i>
              </div>
              <input type="text"
                className="input input-(--color-border)/5  py-5  pl-14 w-full"
                placeholder="กรอก Username หรือ Email ของคุณ "
              />
            </div>
            <label htmlFor="Password" className="text-xs font-medium">Password</label>
            <div className="w-full relative">
              <div className="flex justify-center items-center w-14 h-full  absolute z-99">
                <i className="fa-solid fa-lock text-(--color-border)/40 "></i>
              </div>
              <input type="text"
                className="input input-(--color-border)/5  py-5  pl-14 w-full "
                placeholder="กรอก Password ของคุณ "
              />
            </div>

            <div className="w-full flex justify-between items-center mt-2">
              <div className="flex flex-row items-center gap-2">
                <input type="checkbox" className="checkbox checkbox-md" />
                <p className="text-xs font-medium">จดจำฉัน</p>
              </div>
              <Link href="#" className="text-xs font-medium ">ลืมรหัสผ่าน?</Link>
            </div>

            <button className="btn btn-success w-full mt-4 rounded-2xl text-(--color-primary-content)">เข้าสู่ระบบ</button>
          </form>

         <div className="w-full flex flex-col justify-center items-center my-8 relative bg-base-100">
            <div className="bg-inherit flex justify-center items-center absolute z-1 mb-1 w-15">
              <p className="text-md">หรือ</p>
              </div>
            <div className="w-full flex flex-col justify-center items-center  bg-black absolute z-0">
              <hr  />
            </div>
         </div>

         <div className="w-full flex flex-row justify-between items-center">
            <button className="btn btn-outline  rounded-2xl text-(--color-border) w-39">
              <i className="fa-brands fa-google text-xl"></i> 
              <p className="text-(--color-border)">Google</p>
            </button>
            <button className="btn btn-outline  rounded-2xl text-(--color-border) w-39">
              <i className="fa-brands fa-facebook text-xl"></i> 
              <p className="text-(--color-border)">Facebook</p>
            </button>
         </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;