export default function Page() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6"> Dashboard </h1>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4"> Informasi Akun </h2>
                <div className="space-y-2">
                    <p><strong>Nama:</strong></p>
                    <p><strong>Email:</strong></p>
                    <p>
                        <strong>Status 2FA</strong> {''}
                        <span className="text-green-500"> Aktif </span>
                        <span className="text-red-500"> Tidak Aktif </span>
                    </p>
                </div>
            </div>
        </div>
    )
}
