import LogoutButton from "@/components/logout-buttons"
import { authOptions, getSession } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"

// const session = await getSession()
const session = await getServerSession(authOptions)

export default async function Page() {    
    if (!session || !session.user|| !session.user.email){
        return null
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6"> Dashboard </h1>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4"> Informasi Akun </h2>
                <div className="space-y-2">
                    <p><strong>Nama:</strong> {session?.user.name} </p>
                    <p><strong>Email:</strong> {session?.user.email} </p>
                    <p>
                        <strong>Status 2FA</strong> &nbsp; 
                        {
                            session?.user.twoFactorEnabled ? (
                            <span className="bg-black text-green-500 font-bold rounded p-2"> Aktif </span>
                            ) : (
                            <span className="bg-yellow-200 text-red-500 font-bold rounded p-2"> Tidak Aktif </span>
                            )
                        }
                    </p>
                </div>

                {
                 !session?.user.twoFactorEnabled && (
                    <div className="mt-6">
                        <Link className="bg-blue-500 text-white px-4 py-2 rounded" href={'/dashboard/settings'}>
                            Aktifkan 2FA
                        </Link>
                    </div>
                 )   
                }

            </div>
            
            <LogoutButton/>
        </div>
    )
}
