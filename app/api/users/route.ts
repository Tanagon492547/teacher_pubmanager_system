import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  const users = await prisma.userAuthentication.findMany({
    include: { personal: { include: { user_type: true } } }
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
      personal: {
        create: {
          user_name,
          user_fame,
          userTypeId: user_typeid
        }
      }
    },
    include: { personal: { include: { user_type: true } } }
  })

  // If age was provided, write it directly to the created Personal row
  if (age != null && user.personal) {
    await prisma.personal.update({ where: { id: user.personal.id }, data: { age: Number(age) } })
  }

  return NextResponse.json(user)
}
