"use client"

// digunakan untuk membuat setting-an 2FA

import Error from "next/error";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    // buat qrcode disini
    const [qrcode, setQRcode] = useState('')
    const [secret, setSecret] = useState('')
    const [verificationCode, setVerificationCode]= useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const setup2FA = async() => {
        try {
            const response = await fetch('/api/2fa/setup', {
                method: 'POST'
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error)
            }

            setQRcode(data.qrcode)
            setSecret(data.secret)
            

        } catch (error) {
            setError('Gagal mengatur 2FA')
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Pengaturan Two-Factor Authentication</h1>

            {
                !qrcode ? (
                    <button onClick={setup2FA} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Aktifkan 2FA
                    </button>              
                ) : (
                    <div className="space-y-4">
                        <div className="border p-4 rounded">
                            <p className="mb-2">
                                Scan QR Code ini dengan aplikasi authenticator:
                            </p>
                            <Image src={'qrcode'} alt="QR Code" width={200} height={200}/>
                            <p className="mt-2 text-sm w-full">
                                Atau Masukkan kode ini secara manual: {''}
                            </p>
                        </div>
                    
                        <div>
                            <label className="block mb-2">
                                Masukkan kode verifikasi:
                            </label>
                            
                            <input
                                type="text"
                                value={''}
                                className="w-full p-2 border rounded"
                                placeholder="000000"
                            />
                        </div>

                        <button className="bg-green-500 text-white px-4 py-2 rounded">
                            Verifikasi
                        </button>
                    </div>
                )   
            }

            {error && (
                <div className="mt-4 text-red-500">{error}</div>
            )}

            {success && (
                <div className="mt-4 text-green-500">{success}</div>
            )}
        </div>
    )
}