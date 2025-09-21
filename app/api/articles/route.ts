import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  const articles = await prisma.articleDB.findMany({
    include: { articleType: true, contributor: true }
  })
  return NextResponse.json(articles)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { article_name, article_file, article_typeid, contributor_id, published_year } = body

  const article = await prisma.articleDB.create({
    data: {
      article_name,
      article_file,
      published_year,
      articleType: article_typeid ? { connect: { id: article_typeid } } : undefined,
      contributor: contributor_id ? { connect: { id: contributor_id } } : undefined
    }
  })

  return NextResponse.json(article)
}
