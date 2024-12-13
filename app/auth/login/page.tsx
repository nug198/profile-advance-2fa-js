"use client"

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
    const router = useRouter()
    const [step, setStep]=useState(1)
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [twoFactorCode, setTwoFactorCode]=useState('')
    const [requires2FA, setRequires2FA]=useState(false)
    const [error, setError]=useState('')

    const {data:session, status} = useSession()

    if (status === 'authenticated') {
        router.push('/dashboard')
    }

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try{
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            if (result?.error) {
                if (result.error.includes('2FA')) {
                    setRequires2FA(true)
                    setStep(2)
                } else {
                    setError(result.error)
                }
            } else if (!requires2FA) {
                router.push('/auth/login')
            }

        } catch (error){
                setError('Terjadi kesalahan Saat Login')
        }
    }
    
    const handle2FASubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        setError('')

        try{
            const result = await signIn('credentials', {
                email,
                password,
                twoFactorCode,
                redirect: false
            })

            if (result?.error) {
                if (result.error.includes('2FA')) {
                    setRequires2FA(true)
                    setStep(2)
                } else {
                    setError(result.error)
                }
            } else if (!requires2FA) {
                router.push('/login')
            }

            // router.push('/dashboard')

        } catch (error){
                setError('Terjadi kesalahan')
        }        
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            
            {
                step === 1 ? (
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
                ) : (
                    <form onSubmit={handle2FASubmit} className="space-y-4 w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            Verifikasi 2FA
                        </h2>
                        <div>
                            <label className="black mb-2">
                                Kode Autentikasi
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={twoFactorCode}
                                onChange={(e) => setTwoFactorCode(e.target.value)}
                                required
                            />

                            {error && <div className="text-red-500">{error}</div>}
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Lanjutkan 
                        </button>
                    </form>
                )
            }

            
        </div>
    )
}