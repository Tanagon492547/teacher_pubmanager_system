const ContributorCard =()=>{
  return(
    <div className='w-full lg:w-[20%] flex flex-col gap-5'>
            <div className='flex flex-col gap-2 p-5  border-2 rounded-lg border-(--color-border)/20'>
              <p>เจ้าของบทความ</p>
              <div className='flex items-center gap-2'>
                <i className="fa-regular fa-face-smile text-4xl"></i>
                <p className='text-(--color-base-herder-content)/60'>ดร. ซาราห์ จอห์นสัน</p>
              </div>
              <p className='text-(--color-base-herder-content)/60'>สาขา วิทยยาการคอมพิวเตอร์</p>
              <p className='text-(--color-base-herder-content)/60'>คณะ วิทยาศศาสตร์</p>
              <p className='text-(--color-base-herder-content)/60'>มหาวิทยาลัย สงขลานครินทร์</p>
            </div>
            <div className='flex flex-col gap-2 p-5  border-2 rounded-lg border-(--color-border)/20'>
              <p>ผู้ร่วมบทความ</p>
              <div className='flex'>
                <i className="fa-regular fa-face-smile text-4xl"></i>
                <p className='text-(--color-base-herder-content)/60'>ดร. ซาราห์ จอห์นสัน</p>
              </div>
            </div>
          </div>
  )
}

export default ContributorCard;