import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  const users = await prisma.userAuthentication.findMany({
    include: { login: true }
  })
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, password, user_name, user_fame, user_typeid, age } = body

  const user = await prisma.userAuthentication.create({
    data: {
      username,
      password,
      login: { create: { age } },
      personal: {
        create: {
          user_name,
          user_fame,
          userType: { connect: { id: user_typeid } }
        }
      }
    },
    include: { login: true, personal: true }
  })

  return NextResponse.json(user)
}
