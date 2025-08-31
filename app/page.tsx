import SearchForm from "@/components/homes/SearchForm";
import SearchResult from "@/components/homes/SearchResult";


const Home = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-(--8xl) flex flex-col justify-between items-center">
        <div className="w-full flex flex-col">
          <h1 className="text-4xl font-bold text-(--color-base-herder-content) ">
            ค้นหาผลงานอาจารย์
          </h1>
          <p className="text-(--color-base-herder-content)">ค้นหาผลงานวิชาการ เอกสารวิจัย เเละผลงานวิชาการของคณาจารย์ของเรา</p>
        </div>

        <SearchForm />

        <SearchResult />
      </div>


    </div>
  );
}

export default Home;