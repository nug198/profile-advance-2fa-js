'use client'

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Category, News } from "@prisma/client"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

interface NewsDetailProps {
  news: News & {
    category: Category | null;
    author: {
      name: string | null;
    }
  }
}

export default function NewsDetail({ news }: NewsDetailProps) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <Button onClick={() => router.back()} variant={'outline'}>
          Back
      </Button>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            {
              news.category ? (
                <Badge variant="outline">{news.category?.name}</Badge>
              ) : (<></>)
            }
            <div className="text-sm text-muted-foreground">
              {format(new Date(news.createdAt), "MMMM d, yyyy")}
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">{news.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            By {news.author.name || "Anonymous"}
          </div>
        </CardHeader>
        <CardContent>
          {news.imageUrl && (
            <div className="relative w-full h-[400px] mb-6">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
          <div className="prose max-w-none">
            {news.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}