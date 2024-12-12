import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function POST() {
  const session = await getServerSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const secret = speakeasy.generateSecret({
    name: `articles-app:${session.user.email}`
  })

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

  await prisma.user.update({
    where: { email: session.user.email },
    data: { 
      twoFactorSecret: secret.base32,
      twoFactorEnabled: true
    }
  })

  return NextResponse.json({ 
    secret: secret.base32,
    qrCode: qrCodeUrl
  })
}