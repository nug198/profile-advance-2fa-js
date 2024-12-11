"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
    const router = useRouter()
    const [name, setName]=useState('')
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [error, setError]=useState('')

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(name,email,password)

        try{
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name: name
                })
            })

            const data = await response.json()

            if(!response.ok) {
                throw new Error(data.error)
            }

            router.push('/auth/login')
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-6">Register</h2>
                <div>
                    <label className="block mb-2"> Name </label>
                    <input
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

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