'use client'

import { signOut } from "next-auth/react"

export default function LogoutButton() {
    const handleLogout = async () => {
        await signOut()
    }

    return (
        <button 
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-6 rounded"
        > Logout </button>
    )
}