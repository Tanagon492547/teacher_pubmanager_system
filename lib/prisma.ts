import { PrismaClient } from '@prisma/client'

// Diagnostic: Warn early if DATABASE_URL not present (common cause of Prisma errors)
if (!process.env.DATABASE_URL) {
  console.error('[Prisma] DATABASE_URL is not set. Please create .env with DATABASE_URL="file:./prisma/dev.db" (SQLite default).');
}

declare global {
  // allow global prisma across hot-reloads in dev
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
