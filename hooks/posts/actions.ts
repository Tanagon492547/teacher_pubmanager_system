'use server';

import prisma from '@/lib/prisma';
import { mkdir, writeFile, stat } from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import path from 'path';
import { cookies } from 'next/headers'; // <-- Import cookies มาใช้!

// =================================================================
//   ACTION: ดึงข้อมูลโปรไฟล์ผู้ใช้
// =================================================================
export async function getProfile(userId: string) {
  try {
    console.log('ID:', userId);
    const id = Number(userId);

    if (isNaN(id)) {
      throw new Error('User ID ไม่ถูกต้อง');
    }

    const userProfile = await prisma.userAuthentication.findUnique({
      where: { id: id },
      // **ส่วนที่แก้ไข!** // เราแค่ include: personal ก็พอแล้ว
      // เพราะ userType ย้ายมาเป็น field ธรรมดาใน personal แล้ว
      include: {
        personal: true,
      },
    });

    if (!userProfile) {
      throw new Error('ไม่พบข้อมูลผู้ใช้');
    }

    const { password, ...safeUserProfile } = userProfile;
    return { success: true, data: safeUserProfile };

  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการดึงโปรไฟล์:", error.message);
    return { success: false, error: error.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้' };
  }
}

// --- Type Definitions (เหมือนเดิม) ---
type CoAuthor = {
  academic_title: string;
  firstname: string;
  lastname: string;
};

// --- Helper Function: สร้างโฟลเดอร์ (เหมือนเดิม) ---
const UPLOAD_DIR = path.join(process.cwd(), 'file/pdf');
async function ensureUploadDirExists() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("ไม่สามารถสร้างโฟลเดอร์สำหรับอัปโหลดได้:", error);
    throw new Error("เกิดข้อผิดพลาดในการตั้งค่าเซิร์ฟเวอร์");
  }
}

// =================================================================
//   **ผู้ช่วยคนใหม่!** ฟังก์ชันสำหรับจัดการไฟล์โดยเฉพาะ
// =================================================================
async function handleFileUpload(file: File, fileName: string): Promise<string> {
  // 1. กำหนดที่อยู่ของ "โกดัง" ของเราให้ชัดเจน
  const uploadDir = path.join(process.cwd(), 'public', 'file', 'pdf');

  // 2. เช็คก่อนว่า "โกดัง" ของเรามีอยู่จริงมั้ย ถ้าไม่มีก็ให้สร้างเลย!
  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === 'ENOENT') { // ENOENT = Error No Entity (file or directory)
      console.log(`โฟลเดอร์ ${uploadDir} ยังไม่มี, กำลังจะสร้าง...`);
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error("เกิดข้อผิดพลาดตอนเช็คโฟลเดอร์:", e);
      throw new Error("ไม่สามารถสร้างโฟลเดอร์สำหรับอัปโหลดได้");
    }
  }

  // 3. เตรียมไฟล์ให้พร้อม
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(uploadDir, fileName);

  // 4. เอาไฟล์ไปเก็บใน "โกดัง"
  await writeFile(filePath, buffer);
  console.log(`อัปโหลดไฟล์สำเร็จ! เก็บไว้ที่: ${filePath}`);

  // 5. คืน "ป้ายบอกทาง" (URL) สำหรับเอาไปบันทึกในฐานข้อมูล
  return `/file/pdf/${fileName}`;
}


// =================================================================
//   ACTION 1: สำหรับ "สร้าง" บทความใหม่
// =================================================================
export async function addArticle(formData: FormData): Promise<{ error?: string } | void> {
  console.log('ได้รับข้อมูลจากฟอร์มแล้ว กำลังเริ่มบันทึกบทความ...');
  let newArticleId: number | undefined = undefined;

  try {
    // --- (ส่วนที่แก้ไข!) ดึง userId จาก Cookie ---
    const cookieStore = await cookies()
    const userIdCookie = cookieStore.get('userId');
    if (!userIdCookie) {
      throw new Error("ไม่พบข้อมูลผู้ใช้, กรุณาเข้าสู่ระบบ");
    }
    const currentUserId = Number(userIdCookie.value);
    // ------------------------------------------

    // ... (ดึงข้อมูลอื่นๆ จาก formData เหมือนเดิม) ...
    const rights = formData.get('rights') as string;
    const articleFile = formData.get('article_file') as File;
    const articleName = formData.get('article_name') as string;
    const articleTypeName = formData.get('article_type') as string;
    const publishedDate = new Date(formData.get('published_year') as string);
    const abstract = formData.get('abstract') as string;
    const author = {
      academic_title: formData.get('author_academic_title') as string,
      firstname: formData.get('author_firstname') as string,
      lastname: formData.get('author_lastname') as string,
    };
    const coAuthors: CoAuthor[] = JSON.parse(formData.get('coAuthors') as string);


    // --- จัดการข้อมูลผู้เขียน (เหมือนเดิม) ---
    const mainContributorName = `${author.firstname} ${author.lastname}`;
    let mainContributor = await prisma.contributor.findFirst({ where: { contributor_name: mainContributorName } });
    if (!mainContributor) {
      mainContributor = await prisma.contributor.create({
        data: { contributor_name: mainContributorName, academic_title: author.academic_title },
      });
    }
    // ... (จัดการ coAuthors) ...


    // --- สร้างบทความใน DB ก่อน เพื่อเอา ID ---
    const newArticle = await prisma.articleDB.create({
      data: {
        article_name: articleName,
        published_year: publishedDate.getFullYear(),
        abstract: abstract,
        publish_status: rights,
        article_status: 'pending',
        articleType: articleTypeName,
        contributor: { connect: { id: mainContributor.id } },
        user: { connect: { id: currentUserId } } // <-- (ส่วนที่แก้ไข!) เชื่อมกับ User ที่ Login อยู่
      },
    });
    newArticleId = newArticle.id;
    console.log(`สร้างบทความในฐานข้อมูลสำเร็จ! ได้ ID: ${newArticleId}`);

    // --- จัดการไฟล์โดยใช้ ID ที่ได้มา (เหมือนเดิม) ---
    let dbFilePath: string | undefined = undefined;
    if (rights === 'public' && articleFile && articleFile.size > 0) {
      const extension = path.extname(articleFile.name);
      const newFileName = `${newArticleId}${extension}`;
      dbFilePath = await handleFileUpload(articleFile, newFileName);

      // --- อัปเดตบทความใน DB ด้วย path ของไฟล์ ---
      await prisma.articleDB.update({
        where: { id: newArticleId },
        data: { article_file: dbFilePath },
      });
      console.log(`อัปเดต path ของไฟล์ในฐานข้อมูลสำเร็จ`);
    }

  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มบทความ:", error);
    return { error: 'ไม่สามารถบันทึกบทความได้ กรุณาตรวจสอบข้อมูลและลองอีกครั้ง' };
  }

  // --- (ส่วนที่แก้ไข!) เมื่อสำเร็จแล้ว ให้ไปที่หน้าบทความใหม่ ---
  if (newArticleId) {
    revalidatePath(`/articlemanagement/${newArticleId}`);
    redirect(`/articlemanagement/${newArticleId}`);
  }
}

// =================================================================
//   ACTION 2: สำหรับ "แก้ไข" บทความที่มีอยู่แล้ว
// =================================================================
export async function updateArticle(articleId: number, formData: FormData): Promise<{ error?: string } | void> {
  console.log(`กำลังเริ่มแก้ไขบทความ ID: ${articleId}`);
  try {

    const cookieStore = await cookies()
    const userIdCookie = cookieStore.get('userId');
    if (!userIdCookie) {
      throw new Error("ไม่พบข้อมูลผู้ใช้, กรุณาเข้าสู่ระบบ");
    }
    const currentUserId = Number(userIdCookie.value);
    const rights = formData.get('rights') as string;
    const newArticleFile = formData.get('article_file') as File;
    let dbFilePath: string | undefined = undefined;

    if (newArticleFile && newArticleFile.size > 0) {
      const newFileName = `${articleId}${path.extname(newArticleFile.name)}`;
      dbFilePath = await handleFileUpload(newArticleFile, newFileName);
    }
    

    const articleFile = formData.get('article_file') as File;
    const articleName = formData.get('article_name') as string;
    const articleTypeName = formData.get('article_type') as string;
    const publishedDate = new Date(formData.get('published_year') as string);
    const abstract = formData.get('abstract') as string;
    const author = {
      academic_title: formData.get('author_academic_title') as string,
      firstname: formData.get('author_firstname') as string,
      lastname: formData.get('author_lastname') as string,
    };
    const coAuthors: CoAuthor[] = JSON.parse(formData.get('coAuthors') as string);

    const mainContributorName = `${author.firstname} ${author.lastname}`;
    let mainContributor = await prisma.contributor.findFirst({ where: { contributor_name: mainContributorName } });
    if (!mainContributor) {
      mainContributor = await prisma.contributor.create({
        data: { contributor_name: mainContributorName, academic_title: author.academic_title },
      });
    }
    
    await prisma.articleDB.update({
      where: { id: articleId },
      data: {
        article_name: articleName,
        published_year: publishedDate.getFullYear(),
        abstract: abstract,
        publish_status: rights,
        article_status: 'pending',
        articleType: articleTypeName,
        contributor: { connect: { id: mainContributor.id } },
        user: { connect: { id: currentUserId } }, // <-- (ส่วนที่แก้ไข!) เชื่อมกับ User ที่ Login อยู่
        ...(dbFilePath && { article_file: dbFilePath }),
      },
    });
    console.log(`อัปเดตข้อมูลบทความ ID: ${articleId} สำเร็จ`);

  } catch (error) {
    console.error(`เกิดข้อผิดพลาดในการแก้ไขบทความ ID: ${articleId}`, error);
    return { error: 'ไม่สามารถแก้ไขบทความได้' };
  }

  // --- (ส่วนที่แก้ไข!) เมื่อสำเร็จแล้ว ให้ไปที่หน้าบทความที่เพิ่งแก้ไข ---
  revalidatePath(`/articlemanagement/${articleId}`);
  redirect(`/articlemanagement/${articleId}`);
}

export async function getDeleteForm(id: number) {
  console.log(`ได้รับคำสั่งให้ลบบทความ ID: ${id}`);
  try {
    // 1. **สำคัญมาก!** เราต้องลบข้อมูลที่เชื่อมกันอยู่ (ลูก) ก่อน
    //    เพื่อป้องกันไม่ให้ฐานข้อมูลของเราเกิด Error นะเหมียว
    await prisma.articleStatusHistory.deleteMany({
      where: { articleId: id },
    });
    await prisma.category.deleteMany({
      where: { articleId: id },
    });

    // 2. พอจัดการ "ลูก" หมดแล้ว ก็ค่อยมาลบ "แม่" (บทความหลัก)
    await prisma.articleDB.delete({
      where: { id: id },
    });

    // 3. สั่งให้ Next.js โหลดข้อมูลหน้านี้ใหม่ เพื่อให้ UI อัปเดต
    //    พี่ข้าวจะสมมติว่าหน้าที่แสดงตารางของเราอยู่ที่ path '/articlemanagement' นะ
    revalidatePath('/articlemanagement');

    return { success: true, message: `ลบบทความ ID: ${id} สำเร็จ!` };

  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบบทความ:", error);
    return { success: false, error: 'ไม่สามารถลบบทความได้' };
  }
}

// (await cookies()).get('userId');

export async function getArticleForEdit(articleId: number) {
  // 1. เช็ค Cookie เพื่อหาคนที่ Login อยู่
  const cookie = await cookies()
  const userIdCookie = cookie.get('userId')

  if (!userIdCookie) {
    // ถ้าไม่มีบัตร ก็ถือว่าไม่มีสิทธิ์ ส่งไปหน้า Login เลย!
    redirect('/login');
  }
  const loggedInUserId = Number(userIdCookie.value);

  // 2. ไปหาข้อมูลบทความจากฐานข้อมูล พร้อมกับข้อมูลผู้เขียน
  const article = await prisma.articleDB.findUnique({
    where: { id: articleId },
    include: {
      contributor: true, // <-- ดึงข้อมูล Contributor มาด้วยนะ!
    }
  });

  // 3. ถ้าหาบทความไม่เจอ ก็ให้ไปที่หน้า 404
  if (!article) {
    notFound();
  }

  // 4. (สำคัญที่สุด!) เช็คว่าคนที่ Login อยู่ เป็นเจ้าของบทความหรือไม่
  if (article.userId !== loggedInUserId) {
    // ถ้าไม่ใช่เจ้าของ ก็ถือว่าไม่มีสิทธิ์! ส่งกลับไปหน้าแรกเลย
    console.warn(`[AUTH] User ${loggedInUserId} tried to edit article ${articleId} owned by ${article.userId}. Access denied.`);
    redirect('/');
  }

  // 5. ถ้าทุกอย่างผ่านฉลุย ก็ส่งข้อมูลบทความกลับไป
  return article;
}

// =================================================================
//   ACTION 3: สำหรับ "อนุมัติ / ส่งกลับแก้ไข" บทความ (กระบวนการตรวจสอบ)
// =================================================================
// statusValue: 'approved' | 'revision' (หรือค่าอื่นๆ ตามที่ UI ส่งมา)
// comment: ความคิดเห็นของเจ้าหน้าที่ (เก็บไว้ในตาราง Category ชั่วคราว)
// rights: public | private (ถ้า reviewer ปรับเปลี่ยนสิทธิ์)
// newFile: อัปโหลดไฟล์ใหม่ (เฉพาะเมื่อ rights === 'public')
export async function reviewArticle(
  articleId: number,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId');
    if (!userIdCookie) {
      return { error: 'ไม่พบสิทธิ์ผู้ใช้งาน (กรุณาเข้าสู่ระบบ)' };
    }

    const statusValue = (formData.get('status') as string) || '';
    const rights = (formData.get('rights') as string) || undefined; // public | private | undefined
    const comment = (formData.get('comment') as string) || '';
    const file = formData.get('article_file') as File | null;

    // 1. ตรวจสอบว่าบทความมีอยู่จริง
    const article = await prisma.articleDB.findUnique({ where: { id: articleId } });
    if (!article) {
      return { error: 'ไม่พบบทความนี้' };
    }

    // 2. เตรียมข้อมูลอัปเดต
    const updateData: any = {};
    if (statusValue) updateData.article_status = statusValue;
    if (rights) updateData.publish_status = rights;

    // 3. ถ้ามีไฟล์ใหม่และสิทธิ์ = public -> อัปโหลดแทนที่
    if (file && file.size > 0 && rights === 'public') {
      const extension = path.extname(file.name);
      const newFileName = `${articleId}${extension}`; // ใช้ชื่อไฟล์ตาม ID เดิม
      const uploadDir = path.join(process.cwd(), 'public', 'file', 'pdf');
      try {
        await stat(uploadDir);
      } catch (e: any) {
        if (e.code === 'ENOENT') {
          await mkdir(uploadDir, { recursive: true });
        } else {
          throw e;
        }
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, newFileName);
      await writeFile(filePath, buffer);
      updateData.article_file = `/file/pdf/${newFileName}`;
    }

    // 4. อัปเดตบทความหลัก
    await prisma.articleDB.update({ where: { id: articleId }, data: updateData });

    // 5. บันทึกประวัติสถานะ (ArticleStatusHistory)
    if (statusValue) {
      await prisma.articleStatusHistory.create({
        data: {
          articleId: articleId,
          article_status: statusValue,
        },
      });
    }

    // 6. ถ้ามี comment -> เก็บลง Category.summary (ใช้เป็น note ชั่วคราว)
    if (comment.trim()) {
      await prisma.category.create({
        data: {
          articleId: articleId,
          summary: comment.trim(),
        },
      });
    }

    // 7. Refresh path หน้ารายละเอียด (ถ้าผู้ใช้เปิดอยู่) - เผื่อในอนาคตใช้
    revalidatePath(`/articlevalidation/${articleId}`);

    return { success: true };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบบทความ:', error);
    return { error: 'ไม่สามารถบันทึกผลการตรวจสอบได้' };
  }
}
