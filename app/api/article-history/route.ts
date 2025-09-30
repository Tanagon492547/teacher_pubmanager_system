import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // ตรวจสอบ userId จาก cookie
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ดึงข้อมูล user type
    const user = await prisma.userAuthentication.findUnique({
      where: { id: parseInt(userId) },
      include: {
        personal: {
          include: {
            user_type: true
          }
        }
      }
    })

    if (!user || !user.personal) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userTypeId = user.personal.userTypeId

    // ตรวจสอบว่าเป็น Staff (1), Admin (2), หรือ Teacher (3)
    const isStaffOrAdmin = userTypeId === 1 || userTypeId === 2
    const isTeacher = userTypeId === 3

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let articles: any[]

    if (isStaffOrAdmin) {
      // พนักงานและแอดมินเห็นทุกบทความ
      articles = await prisma.articleDB.findMany({
        include: {
          user: {
            include: {
              personal: true
            }
          },
          statusHistory: {
            include: {
              reviewer: {
                include: {
                  personal: true
                }
              }
            },
            orderBy: {
              save_history: 'desc'
            }
          }
        },
        orderBy: {
          id: 'desc'
        }
      })
    } else if (isTeacher) {
      // อาจารย์เห็นเฉพาะบทความของตัวเอง
      articles = await prisma.articleDB.findMany({
        where: {
          userId: parseInt(userId)
        },
        include: {
          user: {
            include: {
              personal: true
            }
          },
          statusHistory: {
            include: {
              reviewer: {
                include: {
                  personal: true
                }
              }
            },
            orderBy: {
              save_history: 'desc'
            }
          }
        },
        orderBy: {
          id: 'desc'
        }
      })
    } else {
      // ถ้าไม่ใช่ทั้ง 3 ประเภทให้ return บทความว่าง
      articles = []
    }

    // แปลงข้อมูลเป็นรูปแบบที่ใช้งานง่าย
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedArticles = articles.map((article: any) => {
      const latestHistory = article.statusHistory[0]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const completedHistory = article.statusHistory.find((h: any) => 
        h.article_status === 'ข้อมูลสมบูรณ์' || h.article_status === 'เสร็จสิ้น'
      )

      return {
        id: article.id,
        title: article.article_name,
        status: article.article_status || 'รอตรวจ',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        uploadDate: article.statusHistory.find((h: any) => h.article_status === 'รอตรวจ')?.save_history || latestHistory?.save_history,
        completedDate: completedHistory?.save_history || null,
        reviewer: latestHistory?.reviewer?.personal?.user_name || latestHistory?.reviewer?.personal?.user_fame || '-',
        reviewerNote: latestHistory?.reviewerNote || '',
        author: article.user.personal?.user_name || article.user.personal?.user_fame || article.user.username,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        statusHistory: article.statusHistory.map((h: any) => ({
          status: h.article_status,
          date: h.save_history,
          reviewer: h.reviewer?.personal?.user_name || h.reviewer?.personal?.user_fame || '-',
          note: h.reviewerNote || ''
        }))
      }
    })

    return NextResponse.json({
      articles: formattedArticles,
      userType: user.personal.user_type?.user_typename,
      userTypeId: userTypeId
    })

  } catch (error) {
    console.error('Error fetching article history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
