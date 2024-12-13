"use client"
// komponen ini akan kita tambahkan menggunakan shadcn

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistance } from "date-fns"
import { useRouter } from "next/navigation"
import { Category, News, PrismaClient } from "@prisma/client"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Router } from "next/router"

interface NewsTableProps {
  news: {
    title: string
    id: string
    content: string
    imageUrl: string | null
    categoryID: string | null
    authorID: string
    createdAt: Date
    updatedAt: Date
    category: {
      name: string
      id: string
    } | null
  }[]
}

export default function NewsTable({ news }: NewsTableProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm("Are you surre to delete this news items?")) {
      try {
        const response = await fetch(`/api/news/${id}`, {
          method: "DELETE"
        })
  
        if (response.ok) {
          router.refresh()
        } else {
          alert("Failed to delete news item")
        }
      } catch (error) {
        alert("An Error Occured")
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <h1 className="text-xl">List News</h1>
        </div>
        <Button onClick={() => router.push("/dashboard/news/create")}>
          Create News
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Link className="underline" href={`/news/${item.id}`}>
                  {item.title}
                </Link>
              </TableCell>
              <TableCell>
                {formatDistance(new Date(item.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost">...</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/news/edit/${item.id}`)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
