import { Elysia } from "elysia";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { CreateMemberSchema, MemberIdParamSchema, UpdateMemberSchema } from "./member.schema";

// 1. ดึง URL จากไฟล์ .env
const connectionString = process.env.DATABASE_URL;
// 2. สร้าง Connection Pool และ Adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
// 3. ใส่ Adapter เข้าไปตอนสร้าง PrismaClient
const prisma = new PrismaClient({ adapter });

export const memberRoutes = new Elysia({ prefix: '/api/members' })
    
    //  Global Error Handler 
    .onError(({ code, error, set }) => {
        // กรณี Validate ไม่ผ่าน 
        if (code === 'VALIDATION') {
            set.status = 400;
            return {
                status: "error",
                message: "ข้อมูลที่ส่งมาไม่ถูกต้องตามรูปแบบ",
                details: error.all 
            };
        }

        // กรณี Error จาก Prisma (Database)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // P2025 = หาข้อมูลไม่เจอ ช่น ลบ อัปเดต ID ที่ไม่มี
            if (error.code === 'P2025') {
                set.status = 404;
                return {
                    status: "error",
                    message: "ไม่พบข้อมูลที่ต้องการดำเนินการในระบบ"
                };
            }
            // P2002 = ข้อมูลซ้ำ (เช่น Email ซ้ำ)
            if (error.code === 'P2002') {
                set.status = 409; 
                return {
                    status: "error",
                    message: "ไม่สามารถบันทึกได้ เนื่องจากข้อมูลนี้มีซ้ำในระบบแล้ว"
                };
            }
        }

        // กรณี Error อื่นๆ  
        console.error(error); // ปริ้นลง Console เพื่อให้เราตรวจสอบได้
        set.status = 500;
        return {
            status: "error",
            message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง"
        };
    })

 

    // [GET] ดึงข้อมูลสมาชิกทั้งหมด
    .get("/", async () => {
        const members = await prisma.member.findMany({
            select: {
                member_id: true,
                username: true,
                email: true,
                status: true,
                membership_level: {
                    select: {
                        level_name: true,
                        discount_rate: true,
                    }
                }
            }
        });
        return members;
    }, {
        detail: {
            tags: ["Members"],
            summary: "ดึงข้อมูลลูกค้า พร้อมเปอร์เซนต์การลด"
        }
    })

    // [GET] ดึงข้อมูลลูกค้าตาม ID
    .get("/:id", async ({ params: { id }, set }) => {
        const member = await prisma.member.findUnique({
            where: { member_id: id }, 
            select: {
                member_id: true,
                username: true,
                email: true,
                status: true,
                role: true,
                membership_level: {
                    select: {
                        level_name: true,
                        discount_rate: true,
                    }
                }
            }
        });

        //  ดักเคสหาข้อมูลไม่เจอ
        if (!member) {
            set.status = 404;
            return {
                status: "error",
                message: `ไม่พบข้อมูลลูกค้ารหัส ${id} ในระบบ`
            };
        }

        return member;
    }, {
        params: MemberIdParamSchema,
        detail: {
            tags: ['Members'],
            summary: 'ค้นหาลูกค้าจากไอดี'
        }
    })

    // [POST] สร้างสมาชิกใหม่
    .post("/", async ({ body, set }) => {
        const newMember = await prisma.member.create({
            data: {
                username: body.username,
                email: body.email,
                password: body.password,
                role: "user",
                membership_level_id: 1
            }
        });
        
        // ตั้งค่า Status เป็น 201 Created
        set.status = 201;
        return {
            status: "success",
            message: "สร้างสมาชิกใหม่สำเร็จ",
            member_id: newMember.member_id
        };
    }, {
        body: CreateMemberSchema,
        detail: {
            tags: ['Members'],
            summary: 'สร้างสมาชิกใหม่ (สมัครสมาชิก)'
        }
    })

    // [DELETE] ลบข้อมูลลูกค้า
    .delete("/:id", async ({ params }) => {
        await prisma.member.delete({
            where: { member_id: params.id }
        });

        return {
            status: "success",
            message: `ลบข้อมูลลูกค้ารหัส ${params.id} สำเร็จ`
        };
    }, {
        params: MemberIdParamSchema,
        detail: {
            tags: ['Members'],
            summary: 'ลบข้อมูลลูกค้าออกจากระบบ'
        }
    })

    // [PUT] แก้ไขข้อมูลลูกค้า
    .put("/:id", async ({ params, body }) => {
        const updatedMember = await prisma.member.update({
            where: { member_id: params.id },
            data: body, 
            select: {
                member_id: true,
                username: true,
                email: true,
                status: true,
            }
        });

        return {
            status: "success",
            message: `อัปเดตข้อมูลลูกค้า ${params.id} สำเร็จ`,
            data: updatedMember
        };
    }, {
        params: MemberIdParamSchema,
        body: UpdateMemberSchema,
        detail: {
            tags: ['Members'],
            summary: 'แก้ไขข้อมูลลูกค้า'
        }
    });