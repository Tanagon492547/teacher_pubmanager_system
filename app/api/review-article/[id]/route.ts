import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import { mkdir, writeFile, stat } from 'fs/promises';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const articleId = Number(params.id);
    if (isNaN(articleId)) {
      return NextResponse.json({ error: 'รหัสบทความไม่ถูกต้อง' }, { status: 400 });
    }

    const formData = await request.formData();
    const statusValue = (formData.get('status') as string) || '';
    const rights = (formData.get('rights') as string) || undefined;
    const comment = (formData.get('comment') as string) || '';
    const file = formData.get('article_file') as File | null;

    const article = await prisma.articleDB.findUnique({ where: { id: articleId } });
    if (!article) {
      return NextResponse.json({ error: 'ไม่พบบทความนี้' }, { status: 404 });
    }

  interface UpdateData { article_status?: string; publish_status?: string; article_file?: string; }
  const updateData: UpdateData = {};
    if (statusValue) updateData.article_status = statusValue;
    if (rights) updateData.publish_status = rights;

    if (file && file.size > 0 && rights === 'public') {
      const extension = path.extname(file.name);
      const newFileName = `${articleId}${extension}`;
      const uploadDir = path.join(process.cwd(), 'public', 'file', 'pdf');
  try { await stat(uploadDir); } catch (e) { const err = e as NodeJS.ErrnoException; if (err.code === 'ENOENT') { await mkdir(uploadDir, { recursive: true }); } else { throw err; } }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, newFileName);
      await writeFile(filePath, buffer);
      updateData.article_file = `/file/pdf/${newFileName}`;
    }

    await prisma.articleDB.update({ where: { id: articleId }, data: updateData });

    if (statusValue) {
      await prisma.articleStatusHistory.create({ data: { articleId, article_status: statusValue } });
    }

    if (comment.trim()) {
      await prisma.category.create({ data: { articleId, summary: comment.trim() } });
    }

    revalidatePath(`/articlevalidation/${articleId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Review Error:', error);
    return NextResponse.json({ error: 'ไม่สามารถบันทึกผลการตรวจสอบได้' }, { status: 500 });
  }
}