import { Elysia } from "elysia";
import { Prisma } from "@prisma/client";
// plugin
export const globalErrorHandler = new Elysia({ name: 'global-error-handler' })
    .onError(({ code, error, set }) => {
        if (code === 'VALIDATION'){
            set.status = 400;
            return {status: "error", message: "ข้อมูลไม่ถูกต้อง", details: error.all };
        }
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            if(error.code === 'P2025') {
                set.status = 404;
                return {status: "error", message: "ไม่พบข้อมูลในระบบ" };
            }
            if(error.code === 'P2002') {
                set.status = 409;
                return {status: 'error', message:"ข้อมูลนี้ซ้ำในระบบแล้ว"};
            }
        }

        console.error(error);
        set.status = 500;
        return {status: "error", message:"เซิร์ฟเวอร์ error"}
    })