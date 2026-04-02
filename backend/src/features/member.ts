import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. ดึง  URL จากไฟล์ .env
const connectionString = process.env.DATABASE_URL;

// 2. สร้าง Connection Pool และ Adapter
const pool = new Pool({connectionString});
const adapter = new PrismaPg(pool);

// 3 ใส่ Adapter เข้าไปตอนสร้าง PrismaClient
const prisma = new PrismaClient({adapter});

export const memberRoutes = new Elysia({prefix: '/api/members'})
// API ดึงข้อมูลสมาชิกทั้งหมด
.get("/", async () => {
    const members = await prisma.member.findMany({
        include: {
            membership_level: true // ดึงข้อมูลส่วนลด level การซื้อสินค้า
        }
    });
    return members;
}, {
    detail: {
        tags: ["Members"],
        summary:"ดึงข้อมูลลูกค้า พร้อมเปอร์เซนต์การลด"
    }
})

 // API ดึงข้อมูลลูกค้าตาม ID
 .get("/:id", async ({ params: { id } }) => {
 return await prisma.member.findUnique({
    where: {member_id: Number(id) }
 });
}, {
    params: t.Object({
        id: t.String({description:'รหัสลูกค้า (ID)' })
    }),
    detail: {
        tags: ['Members'],
        summary: 'ค้นหาลูกค้าจากไอดี'
    }
})