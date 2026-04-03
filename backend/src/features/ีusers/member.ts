import { Elysia } from "elysia";
import {  prisma } from "../../setup/db";
import { CreateMemberSchema, MemberIdParamSchema, UpdateMemberSchema } from "./member.schema";


export const memberRoutes = new Elysia({ prefix: '/api/members' })

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