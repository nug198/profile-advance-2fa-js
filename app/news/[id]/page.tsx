import { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import NewsDetail from "@/components/news/news-detail"

interface NewsPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const news = await prisma.news.findUnique({
    where: { id: params.id },
  })

  if (!news) {
    return {
      title: "News Not Found",
    }
  }

  return {
    title: news.title,
    description: news.content.substring(0, 160),
  }
}

export default async function NewsPage({ params }: NewsPageProps) {
  const news = await prisma.news.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!news) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <NewsDetail news={news} />
    </div>
  )
}