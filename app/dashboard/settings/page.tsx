"use client"

// digunakan untuk membuat setting-an 2FA

import Error from "next/error";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    // buat qrcode disini
    const [qrcode, setQrcode] = useState('')
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
                setError(data.error)
                throw new Error(data.error)
            }

            setQrcode(data.qrCode)
            setSecret(data.secret)
            
            console.log(qrcode)

        } catch (error) {
            setError('Gagal mengatur 2FA')
        }
    }

    const verify2FA = async() => {
        try {
            setError('')

            const response = await fetch('/api/2fa/verify', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({code:verificationCode})
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error)
                throw new Error(data.error)
            }

            setSuccess('2FA berhasil diaktifkan')
            setQrcode('')
            setSecret('')
            setVerificationCode('')

        } catch (error) {
            console.log(error)
            setError('Kode verifikasi tidak valid')
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 bg-center">Pengaturan Two-Factor Authentication</h1>
    
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
                            <Image src={qrcode} alt="QR Code" width={200} height={200}/>
                            <p className="mt-2 text-sm w-full">
                                Atau Masukkan kode ini secara manual: {secret}
                            </p>
                        </div>
                    
                        <div>
                            <label className="block mb-2">
                                Masukkan Kode Verifikasi:
                            </label>
                            
                            <input
                                type="number"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="000000"
                            />
                        </div>

                        <button onClick={verify2FA} className="bg-green-500 text-white px-4 py-2 rounded">
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