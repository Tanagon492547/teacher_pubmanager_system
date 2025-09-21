This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# teacher_pubmanager_system

## Local Prisma + SQLite setup (Windows `cmd.exe`)

1. Install dependencies:

```cmd
npm install
```

2. Generate Prisma client:

```cmd
npm run prisma:generate
```

3. Create the SQLite database and run migrations (this will create `prisma/dev.db`):

```cmd
npx prisma migrate dev --name init
```

4. Seed or reset DB (if needed):

```cmd
npm run setup-db
```

5. Start dev server:

```cmd
npm run dev
```

API endpoints (app router):

- `POST /api/auth` - body `{ username, password }` -> basic auth check
- `GET|POST /api/users` - list users / create user
- `GET|POST /api/articles` - list articles / create article

Notes:
- Passwords are stored in plaintext in this starter; add hashing (bcrypt) before production.
- Prisma client is in `lib/prisma.ts`.

วิธีติดตั้ง SQLite
ตามหาไฟล์ .env ในไดร์ฟของต้องห้าม เเล้วนำไปไว้ในโปรเจคระดับเดียวกับ .json

1.npm install
2.npx prisma generate
3.npx prisma migrate dev --name init
4.npm run seed
5.npx prisma studio
6.npm run dev