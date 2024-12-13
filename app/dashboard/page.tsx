import NewsTable from "@/components/news/news-table";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth/login")
    }

    const news = await prisma.news.findMany({
        where: {
            authorID:session.user.id || ''
        },
        
        include: {
            category: true,
        },
        orderBy: { createdAt: "desc"}
    })

    return (
        <div className="container mx-auto py-10 px-6">
            <NewsTable news={news || []}/>
        </div>
    )
}

// kita akan membuat tabel diluar yang ada dari halaman utama