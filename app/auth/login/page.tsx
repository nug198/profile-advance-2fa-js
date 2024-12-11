"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
    const router = useRouter()
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [error, setError]=useState('')

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // console.log(email,password)

        try{
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
        })

        if (result?.error) {
            return setError(result.error)
        }

        router.push('/dashboard')

        }catch (error){
            setError('Terjadi kesalahan')
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <div>
                    <label className="block mb-2"> Email </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2"> Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Lanjutkan 
                </button>
            </form>
        </div>
    )
}