import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

export async function GET(req: Request, context: any) {
  // context.params may be a promise in newer Next versions
  const params = await context.params
  const id = Number(params.id)
  const user = await prisma.userAuthentication.findUnique({
    where: { id },
    include: { personal: { include: { user_type: true } }, login: true }
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(user)
}
