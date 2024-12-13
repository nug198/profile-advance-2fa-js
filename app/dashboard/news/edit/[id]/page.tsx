import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import NewsForm from "@/components/news/news-form"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EditNewsPageProps {
  params: { id: string }
  searchParams: { success?: string }
}

export default async function EditNewsPage({ params, searchParams }: EditNewsPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/login")
  }

  const [news, categories] = await Promise.all([
    prisma.news.findUnique({
      where: { id: params.id },
      include: { category: true },
    }),
    prisma.category.findMany(),
  ])

  if (!news) {
    notFound()
  }

  // Check if user is the author
  if (news.authorID !== session.user.id) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Edit News</h1>
      
      {searchParams.success && (
        <Alert className="mb-6 bg-green-50">
          <AlertDescription>
            News updated successfully!
          </AlertDescription>
        </Alert>
      )}

      <NewsForm news={news} categories={categories} />
    </div>
  )
}