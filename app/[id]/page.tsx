const ArticleDetailPage = async ({ params, }: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  return (
    <div>{id}</div>
  )
}

export default ArticleDetailPage;