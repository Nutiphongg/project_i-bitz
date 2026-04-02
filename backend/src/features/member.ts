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
        select: {
            member_id : true,
            username  : true,
            email     : true,
            status    : true,

            membership_level: {
               select:{
                level_name  :true,
                discount_rate :true,
               }
            } // ดึงข้อมูลส่วนลดการซื้อสินค้า
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

 .post("/", async ({ body }) => { 
    // เพิ่มข้อมูลลงใน Database ผ่าน prisma
    const newMember = await prisma.member.create({
        data : {
            username:body.username,
            email : body.email,
            password: body.password,
            role: "user",
            membership_level_id: 1

        }
    });
    return {
        status: "success",
        message: "สร้างสมาชิกใหม่สำเร็จ",
        member_id: newMember.member_id
    };
 },{
    body: t.Object({
        username: t.String({description: 'ชื่อผู้ใช้'}),
        email : t.String({ description: 'อีเมล'}),
        password: t.String({description:'รหัส'})
    }),
    detail:{
        tags: ['Member'],
        summary: 'สร้างสมาชิกใหม่ (สมัครสมาชิก)'
    }
   })

   .delete("/:id",async ({ params, set }) => {
     try{
        // ใช้ Prisma สั่งลบข้อมูลตาม ID 
        await prisma.member.delete({
           where: {
             member_id: Number(params.id)
           }
        });

        return {
            status:"success",
            message: 'ลบข้อมูลลูกค้ารหัส ${params.id}'
        };
     } catch (error) {
        //ดัก ID ที่ไม่มีหรือ ID ซ้ำ
        set.status = 404;
        return {
            status:"error",
            message: 'ไม่พบข้อมูลลูกค้ารหัส ${params.id} ในระบบ'
        };
     }
   },{
    params: t.Object({
        id:t.String({description: 'รหัสลูกค้า (ID) ที่ต้องการลบ'})
    }),
    detail:{
        tags:['Members'],
        summary:'ลบข้อมูลูกค้าออกจากระบบ'
    }
   })
 