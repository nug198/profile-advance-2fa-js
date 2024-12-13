import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import speakeasy from 'speakeasy'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { code } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user?.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA belum diatur' },
        { status: 400 }
      )
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code
    })

    console.log(verified)

    if (!verified) {
      return NextResponse.json(
        { error: 'Kode tidak valid' },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { twoFactorEnabled: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}