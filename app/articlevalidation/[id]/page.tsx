import ReviewArticleForm from '@/components/articlevalidations/ReviewArticleForm';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getArticle(id: number) {
  const article = await prisma.articleDB.findUnique({
    where: { id },
    include: { contributor: true, coAuthors: true },
  });
  return article;
}

const ReviewPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params; // keep pattern with existing code style
  console.log('[articlevalidation] visiting id param =', id);
  const numericId = Number(id);
  if (isNaN(numericId)) notFound();
  const article = await getArticle(numericId);
  if (!article) notFound();

  const mapped = {
    id: article.id,
    article_name: article.article_name,
    articleType: article.articleType,
    published_year: article.published_year,
    abstract: article.abstract,
    publish_status: article.publish_status,
    article_status: article.article_status,
    article_file: article.article_file,
    contributor: article.contributor ? {
      contributor_name: article.contributor.contributor_name,
      academic_title: article.contributor.academic_title,
    } : null,
    coAuthors: Array.isArray(article.coAuthors) && article.coAuthors.length > 0 ? article.coAuthors.map((c: any) => ({
      academic_title: c.academic_title,
      firstname: c.firstname,
      lastname: c.lastname,
    })) : [],
  };

  return (
    <div className="w-full flex justify-center py-10 px-4">
      <ReviewArticleForm article={mapped} />
    </div>
  );
};

export default ReviewPage;
