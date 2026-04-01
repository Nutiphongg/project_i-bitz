"use client"

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 1. ฟังก์ชันดึงข้อมูลจาก Database 
const fetchMembersFromSupabase = async () => {
  const { data, error } = await supabase
    .from('member') // ชื่อตารางใน Supabase ของอ๊อด
    .select('*')
  
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export default function HomePage() {
  // 2. ใช้ TanStack Query จัดการสถานะการดึงข้อมูล
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembersFromSupabase,
  })

  // 3. จัดการหน้าจอตอนกำลังโหลด
  if (isLoading) {
    return <div className="p-10 text-center">กำลังเชื่อมต่อกับฐานข้อมูล...</div>
  }

  if (isError) {
    return (
      <div className="p-10 text-red-500 text-center">
        เกิดข้อผิดพลาด: {(error as Error).message}
      </div>
    )
  }

  return (
    <main className="p-10 container mx-auto">
      <h1 className="text-2xl font-bold mb-6">รายชื่อสมาชิก</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>ข้อมูลล่าสุดจากตาราง member</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {}
            {data && data.length > 0 ? (
              data.map((member: any) => (
                <TableRow key={member.member_id}>
                  <TableCell className="font-medium">{member.member_id}</TableCell>
                  <TableCell>{member.username}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded bg-slate-100 text-xs font-semibold">
                      {member.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={member.status === 'active' ? 'text-green-600' : 'text-red-500'}>
                      {member.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  ยังไม่มีข้อมูลสมาชิกในตาราง
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}