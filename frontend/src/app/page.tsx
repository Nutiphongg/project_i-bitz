"use client" // ต้องเป็น Client Component เพื่อใช้ useQuery

import { useQuery } from "@tanstack/react-query"
import { mockMembers } from "@/data/mock_user" 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function HomePage() {
  // 1. ใช้ TanStack Query ดึงข้อมูล (จำลอง)
  const { data, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800)) // หลอกว่าโหลดอยู่ 0.8 วิ
      return mockMembers
    },
  })

  if (isLoading) return <div className="p-10">กำลังโหลดข้อมูลสมาชิก...</div>

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-5">รายชื่อสมาชิก (Mock Data)</h1>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((user: any) => (
              <TableRow key={user.member_id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}