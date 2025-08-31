import LoginPage from '@/app/login/page';
import Link from 'next/link';

const HeaderPage = () => {
  return (
    <div className="w-full h-18 flex justify-center items-center bg-(--color-primary) px-4">
          <div className="w-full max-w-(--8xl) flex justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <i className="fa-solid fa-graduation-cap text-4xl text-(--color-base-herder) "></i>
              <p className="text-(--color-base-herder)">ผลงานตีพิมพ์อาจารย์ PSU</p>
            </div>
            <div>
              <Link href='/login'><button className="btn btn-success rounded-lg "><i className="fa-solid fa-user text-xl"></i> <p className="text-success-content"> เข้าสู่ระบบ</p></button></Link>
            </div>
          </div>
        </div>
        )
};

export default HeaderPage;