import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // ใช้ prisma client กลาง

// Type for dynamic where clause
interface ArticleListWhere {
  article_status?: string; // <-- สถานะเป็น optional: ถ้ามีจะกรองตามสถานะ ถ้าไม่มีจะใช้ default
  published_year?: number;
  OR?: { article_name?: { contains: string; mode: 'insensitive' } ; abstract?: { contains: string; mode: 'insensitive' } }[];
}

// ... (Type DetailedArticleListItem เหมือนเดิม) ...
export type DetailedArticleListItem = {
  articleId: number;
  articleName: string;
  publishedYear: number | null;
  articleType: string | null;
  academicTitle: string | null;
  firstName: string;
  lastName: string;
  contributorName?: string | null;
  faculty: string | null;
  department: string | null;
  abstract: string | null;
  downloadPath: string | null;
  article_status: string | null;
};


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '50')));
    const q = searchParams.get('q');
    const year = searchParams.get('year');

    // หาก client ส่ง ?status=... มา ให้ใช้ค่านั้นเป็นเงื่อนไขการกรอง
    // ถ้าไม่มี ให้ใช้ default 'approved' (เพื่อไม่กระทบหน้าอื่นๆ ที่เรียก API นี้)
    const status = searchParams.get('status');
    const where: ArticleListWhere = {};
    if (status) {
      where.article_status = status;
    } else {
      where.article_status = 'approved';
    }

    // ส่วนการกรองอื่นๆ ยังทำงานได้เหมือนเดิมนะ
    if (year) where.published_year = Number(year);
    if (q) {
      where.OR = [
        { article_name: { contains: q, mode: 'insensitive' } },
        { abstract: { contains: q, mode: 'insensitive' } },
      ];
    }

    // --- ส่วนที่เหลือของโค้ดทำงานเหมือนเดิมเป๊ะๆ เลยจ้ะ ---
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
      // helper: safely parse contributor_name into first/last while sanitizing literal 'null' strings
      const parseName = (name?: string | null) => {
        if (!name) return ['', ''];
        const parts = name.trim().split(/\s+/).map(p => (String(p).toLowerCase() === 'null' || String(p).toLowerCase() === 'undefined' ? '' : p));
        const first = parts[0] || '';
        const last = parts.slice(1).join(' ') || '';
        return [first, last];
      };

      const [firstName, lastName] = parseName(article.contributor?.contributor_name ?? '');
      const contributorName = article.contributor?.contributor_name ?? '';
      const personalInfo = article.user?.personal;
      return {
        articleId: article.id,
        articleName: article.article_name,
        publishedYear: article.published_year,
        articleType: article.articleType,
        academicTitle: article.contributor?.academic_title ?? null,
        firstName: firstName || '',
        lastName: lastName || '',
        contributorName: contributorName || null,
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

