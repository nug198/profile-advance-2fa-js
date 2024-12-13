import Header from "@/components/headers";
import { getSession } from "@/lib/auth";
import React from "react";

export default async function RootLayout({children} : Readonly<{children: React.ReactNode;}>) {
    const session = await getSession()

    // if (!session) {
    //     return null
    // }

   return (
        <>
            <Header user={session?.user} />
            <main> {children} </main>
        </>
    )
}