import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import {cors} from "@elysiajs/cors";
import { globalErrorHandler } from "./setup/error";
import { productRoutes } from "./features/products/product";
import { memberRoutes } from "./features/ีusers/member";

const app = new Elysia()
  //ดัก Error เพื่อครอบคลุม Route ทั้งหมด
  .use(globalErrorHandler)
  // เปิดใช้งาน Cors , Swagger สำหรับทำ API Docs ให้ฝั่ง Frontend ดึงไปดู
  .use(cors())
  .use(swagger({
    path: '/api-docs',
    documentation: {
      info: {
        title: 'Rental System API',
        version: '1.0.0',
        description: 'API สำหรับระบบเช่าอุปกรณ์',
      },
      tags: [
        { name: 'Members', description: 'จัดการข้อมูลลูกค้า ' },
        { name: 'Products', description: 'จัดการข้อมูลสินค้า' }
      ]
    }
  }))
  
  // 2. เรียกใช้งาน Route สินค้า
  .use(productRoutes)
  // เรียกใช้งาน Route ลูกค้า
  .use(memberRoutes)
  
  .get("/", () => "Hello, ElysiaJS is working!")
  
  .listen(3000);

console.log(` Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(` Swagger API Docs is available at http://${app.server?.hostname}:${app.server?.port}/api-docs`);

  
 