import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

export async function GET(req: Request, context: { params: Record<string, string> } | Promise<{ params: Record<string, string> }>) {
  const ctx = await context
  const params = await ctx.params
  const id = Number(params.id)
  const user = await prisma.userAuthentication.findUnique({
    where: { id },
    include: { personal: { include: { user_type: true } } }
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PUT(req: Request, context: { params: Record<string, string> } | Promise<{ params: Record<string, string> }>) {
  const ctx = await context
  const params = await ctx.params
  const id = Number(params.id)
  const body = await req.json()

  try {
    // First, update the main user fields
    await prisma.userAuthentication.update({ where: { id }, data: { username: body.username, password: body.password } })

    // Handle Personal: check if Personal exists. Creating Personal requires user_typeid (schema enforces it)
    const existingPersonal = await prisma.personal.findUnique({ where: { userId: id } })
    if (existingPersonal) {
      await prisma.personal.update({
        where: { id: existingPersonal.id },
        data: {
          user_name: body.user_name ?? existingPersonal.user_name,
          user_fame: body.user_fame ?? existingPersonal.user_fame,
          ...(body.user_typeid ? { userTypeId: Number(body.user_typeid) } : {}),
          ...(body.age != null ? { age: Number(body.age) } : {})
        }
      })
    } else if (body.user_typeid) {
      // Only create a Personal if a user_typeid is supplied because user_type is required
      const created = await prisma.personal.create({
        data: {
          userId: id,
          user_name: body.user_name ?? '',
          user_fame: body.user_fame ?? '',
          userTypeId: Number(body.user_typeid)
        }
      })
      // If age provided, set it on the newly created Personal row
      if (body.age != null) {
        await prisma.personal.update({ where: { id: created.id }, data: { age: Number(body.age) } })
      }
    }

    // (age handled above as part of personal create/update)

  const updated = await prisma.userAuthentication.findUnique({ where: { id }, include: { personal: { include: { user_type: true } } } })

    return NextResponse.json(updated)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: { params: Record<string, string> } | Promise<{ params: Record<string, string> }>) {
  const ctx = await context
  const params = await ctx.params
  const id = Number(params.id)
  try {
    // delete dependent records first to avoid FK issues
    await prisma.personal.deleteMany({ where: { userId: id } })
  // login table no longer holds age; keep delete for legacy cleanup
  await prisma.login.deleteMany({ where: { userId: id } })
    await prisma.userAuthentication.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
