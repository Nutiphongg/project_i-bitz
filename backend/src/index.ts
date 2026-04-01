import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { productRoutes } from "./features/product";

const app = new Elysia()
  // 1. เปิดใช้งาน Swagger สำหรับทำ API Docs
  .use(swagger({
    path: '/api-docs', // กำหนด URL สำหรับเข้าดู API Docs
    documentation: {
      info: {
        title: 'Rental System API',
        version: '1.0.0',
        description: 'API Documentation สำหรับระบบเช่าอุปกรณ์ (ElysiaJS + Supabase)',
      },
      tags: [
        { name: 'Products', description: 'จัดการข้อมูลสินค้า' }
      ]
    }
  }))
  
  // 2. เรียกใช้งาน Route ที่เราแยกไว้
  .use(productRoutes)
  
  .get("/", () => "Welcome to Rental System API!")
  
  .listen(3000);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📖 API Docs is available at http://${app.server?.hostname}:${app.server?.port}/api-docs`);