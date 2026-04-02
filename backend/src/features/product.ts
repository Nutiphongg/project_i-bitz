import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. ดึง URL จากไฟล์ .env
const connectionString = process.env.DATABASE_URL;

// 2. สร้าง Connection Pool และ Adapter 
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 3. ใส่ Adapter เข้าไปตอนสร้าง PrismaClient
const prisma = new PrismaClient({ adapter });

export const productRoutes = new Elysia({ prefix: '/api/products' })
  // API ดึงข้อมูลสินค้าทั้งหมด
  .get("/", async () => {
    const products = await prisma.product.findMany({
      include: {
        categories: true // ดึงชื่อหมวดหมู่มาด้วย
      }
    });
    return products;
  }, {
    detail: {
      tags: ['Products'],
      summary: 'ดึงข้อมูลสินค้าทั้งหมด พร้อมหมวดหมู่'
    }
  })
  
  // API ดึงข้อมูลสินค้าตาม ID
  .get("/:id", async ({ params: { id } }) => {
    return await prisma.product.findUnique({
      where: { product_id: Number(id) }
    });
  }, {
    params: t.Object({
      id: t.String({ description: 'รหัสสินค้า (ID)' })
    }),
    detail: {
      tags: ['Products'],
      summary: 'ค้นหาสินค้าจาก ID'
    }
  });