import Image from "next/image";
import Link from "next/link";

type Users = {
  id: string  | undefined;
  title: string | undefined;
  athor: string | undefined;
  field: string | undefined;
  offset: string | undefined;
  url: string | undefined;
}

const SearchResultItem = ({id, title, athor, field, offset, url}: Users)  => {
  return (
    <td className="w-full  flex flex-col my-1">
        <div className="w-full flex flex-row border-1 border-(--color-border)/20 rounded-lg p-5 gap-5 h-(--1xl)">
              <div className=" w-3/4 xl:w-6xl ">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 items-center">
                      <button className="btn btn-soft btn-primary">วารสาร</button>
                      <button className="btn btn-soft  btn-error">วิชาการ</button>
                      <p>ปี 2025</p>
                  </div>
                  <h2 className="text-2xl font-bold text-(--color-base-herder-content) line-clamp-1">{title}</h2>
                  <div className="flex flex-row gap-2 items-center text-xl">
                    <i className="fa-solid fa-user-graduate"></i>
                    <p className="text-(--color-base-content) line-clamp-1">{athor} {field} {offset}</p>
                  </div>
                  <p className="text-(--color-base-content w-full h-(--2xxs) line-clamp-3 indent-8 text-justify"> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum maiores consequatur in adipisci necessitatibus, reiciendis pariatur aspernatur vitae neque! Deserunt, quam. Ducimus, atque. Velit dolorem, nihil quibusdam in rerum iure.
                  Ea, ipsum eveniet eius sequi nobis a similique facilis repellat aperiam harum ex accusantium ad quis, officiis officia. Assumenda ad expedita rerum saepe ipsa quasi sint animi vero ratione velit?
                  Libero nihil architecto, voluptates autem culpa nobis, dolorum recusandae mollitia, eveniet ipsa ea veniam aperiam enim impedit molestias corrupti debitis cum distinctio et ipsam itaque. Laboriosam maxime fuga alias illum.
                  Officia esse cum quibusdam vitae nostrum odit, mollitia reprehenderit, nobis obcaecati qui pariatur! Soluta beatae iste harum, enim ut quos ipsam ab aspernatur distinctio? Enim vel voluptatibus quidem debitis esse.
                  Fugiat provident itaque nobis adipisci! Necessitatibus, cum at praesentium nobis fugit temporibus nesciunt sequi tempora eos sed ab non dignissimos vitae corporis illum, ea pariatur. Omnis voluptate obcaecati quisquam aliquid?</p>
                  <div className="flex flex-row gap-2 ">
                    <button className={`btn btn-success btn-sm text-lg rounded-sm px-10 py-5 ${url === undefined ? 'btn-disabled w-(--width-button-lock)' : ''}`}>
                      {url === undefined ?  (<i className="fa-solid fa-lock"></i>) : ('Download PDF')}
                    </button>
                    <Link href={`/${id}`}>
                      <button className="btn btn-outline btn-sm text-lg rounded-sm px-10 py-5"><p className="text-black/60">ดูรายละเอียด</p></button>
                    </Link>
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