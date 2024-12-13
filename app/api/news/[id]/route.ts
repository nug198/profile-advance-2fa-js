import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const existingNews = await prisma.news.findUnique({
    where: { id: params.id },
  })

  if (!existingNews || existingNews.authorID !== session.user.id) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const json = await req.json()
  const news = await prisma.news.update({
    where: { id: params.id },
    data: json,
  })

  return NextResponse.json(news)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params || !params.id) {
      return new NextResponse("Invalid request", { status: 400 })
    }

    console.log(params.id);

    const news = await prisma.news.delete({ where: { id: params.id } })

    console.log(news);
    

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Failed to delete news item", 
      message: error.message 
    }, { status: 500 }
  )
  }
}
