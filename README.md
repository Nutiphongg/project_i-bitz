### Tech Stack ที่ใช้
```text
Framework: Next.js
Language: TypeScript
Database: Supabase
Styling: Tailwind CSS
UI Component: Shadcn UI
Package: Bun
backend
framework api: Elysiajs
ORM: Prisma
API Docs: Swagger

```

### วิธีรันโปรเจกต์ (Frontend)

1. เข้าไปที่โฟลเดอร์ frontend และติดตั้ง Library:
```bash
cd frontend
bun install
```

2. สร้างไฟล์ `.env.local` ไว้ที่ `frontend/` และใส่โค้ด:
```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

3. เริ่มรันโปรเจกต์:
```bash
bun dev
```

### วิธีรันโปรเจค(backend)
1. เข้าที่ folder backend  พร้อมสร้างไฟล์ .env
```bash
cd backend
```
```text
DATABASE_URL="ใส่ URL ของ Supabase ที่มีรหัสผ่าน"
```
2. ติดตั้งเครื่องมือ
``` bash
bun install
```
3. อัปเดต prisma generate 
```bash
bunx prisma generate
```
4.รันเซิร์ฟเวอร์ backend 
```bash
bun run --watch src/index.ts

