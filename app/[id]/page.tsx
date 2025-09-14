import ArticleDetails from "@/components/homes/articledetails/ArticleDetails";

//เตรียมรับข้อมูลที่จะส่งมา
async function getArticleData(id: string) {
  const res = await fetch(`http://localhost:3000/api/articles/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

const ArticleDetailPage = async ({ params, }: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params;
  return (
    <ArticleDetails id={id} />
  )
}

export default ArticleDetailPage;