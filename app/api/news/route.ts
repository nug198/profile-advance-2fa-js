import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, content, imageUrl, categoryId } = await req.json()  

    const news = await prisma.news.create({
      data: {
        title, 
        content, 
        imageUrl: imageUrl || null,
        categoryID: categoryId || null,
        authorID: session.user.id || '',
      },
    })

    return NextResponse.json({
      message: 'Berhasil menambahkan berita',
      news: news
    });
  } catch (error) {
    console.error(error);
    
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambah data' },
      { status: 500 }
    );
  }
}