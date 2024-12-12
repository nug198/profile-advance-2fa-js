import { getSession } from "@/lib/auth"

const session = await getSession()

export default async function Page() {    
    // if (!session || !session.user.name || !session.user.email){
    //     return null
    // }

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
            </div>
        </div>
    )
}
