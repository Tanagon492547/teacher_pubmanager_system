import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // ใช้ prisma client กลาง

// Type for dynamic where clause (narrow union of allowed filters)
interface ArticleListWhere {
  article_status?: string;
  published_year?: number;
  OR?: { article_name?: { contains: string; mode: 'insensitive' } ; abstract?: { contains: string; mode: 'insensitive' } }[];
}

// 1. สร้าง "เมนูอาหาร" (Type) ฉบับใหม่ของเรา!
//    นี่คือหน้าตาข้อมูลแบบจัดเต็มที่เราต้องการ
export type DetailedArticleListItem = {
  articleId: number;
  articleName: string;
  publishedYear: number | null;
  articleType: string | null;
  academicTitle: string | null;
  firstName: string;
  lastName: string;
  faculty: string | null;
  department: string | null;
  abstract: string | null;
  downloadPath: string | null;
  article_status: string | null; // current workflow status
};

// ฟังก์ชัน GET นี้จะทำงานเมื่อมีการเรียกมาที่ /api/articles-list
export async function GET(req: NextRequest) {
  try {
    // Pagination & filter params
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '50'))); // default 50
    const status = searchParams.get('status');
    const q = searchParams.get('q'); // free text search (simple LIKE)
    const year = searchParams.get('year');

  const where: ArticleListWhere = {};
    if (status) where.article_status = status;
    if (year) where.published_year = Number(year);
    if (q) {
      // Simple OR search across a few text columns
      where.OR = [
        { article_name: { contains: q, mode: 'insensitive' } },
        { abstract: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, articles] = await Promise.all([
      prisma.articleDB.count({ where }),
      prisma.articleDB.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'desc' },
        select: {
          id: true,
          article_name: true,
          published_year: true,
          articleType: true,
          article_status: true,
          article_file: true,
          abstract: true,
          contributor: { select: { contributor_name: true, academic_title: true } },
          user: { select: { personal: { select: { faculty: true, department: true } } } }
        }
      })
    ]);

    type ArticleRow = typeof articles[number];
    const formattedArticles: DetailedArticleListItem[] = articles.map((article: ArticleRow) => {
      const [firstName, lastName] = (article.contributor?.contributor_name || 'N/A').split(' ');
      const personalInfo = article.user?.personal;
      return {
        articleId: article.id,
        articleName: article.article_name,
        publishedYear: article.published_year,
        articleType: article.articleType,
        academicTitle: article.contributor?.academic_title ?? null,
        firstName: firstName || 'N/A',
        lastName: lastName || '',
        faculty: personalInfo?.faculty ?? null,
        department: personalInfo?.department ?? null,
        abstract: article.abstract,
        downloadPath: article.article_file,
        article_status: article.article_status ?? null,
      };
    });

    return NextResponse.json({
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      items: formattedArticles,
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดใน API /articles-list:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}

