import {t,Static } from "elysia"

// 1. กำหนด Schema สำหรับการรับค่า

//Schema สำหรับตอนสมัครสมาชิก
export const CreateMemberSchema = t.Object({
    username: t.String({description:'ชื่อผู้ใช้'}),
    email: t.String({description: 'อีเมล'}),
    password: t.String({description:'รหัส'})
});
// Schema สำหรับค่า ID จาก URL
export const MemberIdParamSchema = t.Object({
    id: t.Numeric({description:'รหัสลูกค้า (ID)'})
});
export const UpdateMemberSchema = t.Partial(t.Omit(CreateMemberSchema, ['password']));
//2. แปลง Schema เป็น typeScript interface 
export type ICreateMemberBody = Static<typeof CreateMemberSchema>;
export type IMemberIDParam = Static<typeof MemberIdParamSchema>;
export type IUpdateMember = Static<typeof UpdateMemberSchema>;
