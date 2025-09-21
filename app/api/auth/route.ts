import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const user = await prisma.userAuthentication.findUnique({ where: { username } })
  if (!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 401 })
  if (user.password !== password) return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 })

  return NextResponse.json({ ok: true, userId: user.id })
}
