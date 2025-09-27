import Image from "next/image";
import Link from "next/link";
import DownloadCard from "../DownloadCard";
import { useRouter } from "next/navigation";

type Users = {
  id: string  | undefined;
  title: string | undefined;
  athor: string | undefined;
  field: string | undefined;
  offset: string | undefined;
  url: string | undefined;
  abstract?: string;
  articleType?: string;
  publishedYear?: number
}

const SearchResultItem = ({id, title, athor, field, offset, url, abstract, articleType, publishedYear}: Users)  => {
  const router = useRouter(); 
  return (
    <td className="w-full  flex flex-col my-1">
        <div className="w-full flex flex-row border-1 border-(--color-border)/20 rounded-lg p-5 gap-5 h-(--1xl)">
              <div className=" w-3/4 xl:w-6xl  ">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 items-center">
                      <button className="btn btn-soft btn-primary">{articleType}</button>
                      <p>ปี {publishedYear? publishedYear:'2025'}</p>
                  </div>
                  <h2 className="text-2xl font-bold text-(--color-base-herder-content) line-clamp-1">{title}</h2>
                  <div className="flex flex-row gap-2 items-center text-xl">
                    <i className="fa-solid fa-user-graduate"></i>
                    <p className="text-(--color-base-content) line-clamp-1">{athor} {field} {offset}</p>
                  </div>
                  <p className="flex flex-col text-(--color-base-content w-full h-20 line-clamp-3 indent-8 text-justify  "> 
                    {abstract? abstract : 'ไม่มีขข้อมูล'}
                  </p>
                  <div className="flex flex-row gap-2 ">
                    <DownloadCard url={url} />
                    <button onClick={()=>router.replace(`/article-detail-page/${id}`)}>
                      <button className="btn btn-outline btn-sm text-lg rounded-sm px-10 py-5"><p className="text-black/60">ดูรายละเอียด</p></button>
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-w-full max-h-full flex justify-center items-center overflow-hidden mx-2">
                <div className="w-full h-full flex justify-center items-center">
                    <Image  
                      src="/depositphotos_89250312-stock-illustration-photo-picture-web-icon-in.jpg"
                      alt="แมวน่ารัก" 
                      width={196} 
                      height={229} 
                    />
                </div>
              </div>
        </div>
      </td>
  );
}

export default SearchResultItem;