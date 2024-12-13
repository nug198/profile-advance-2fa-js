import { AuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import speakeasy from 'speakeasy'

const prisma = new PrismaClient()

const authOptions: AuthOptions = {
  useSecureCookies:false,
  
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text", optional: true }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password diperlukan')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('User tidak ditemukan')
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        
        if (!passwordMatch) {
          throw new Error('Password salah')
        }

        if (user.twoFactorEnabled) {
          if (!credentials.twoFactorCode) {
            throw new Error('Kode 2FA diperlukan')
          }

          const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret!,
            encoding: 'base32',
            token: credentials.twoFactorCode
          })

          if (!verified) {
            throw new Error('Kode 2FA tidak valid')
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
    
        console.log(session)
        
      if (!session || !session.user || !session.user.email) {
        return session
      }

      const userByEmail = await prisma.user.findUnique({
        where: { email: session.user?.email },
      })

      session.user.id = userByEmail?.id
      session.user.name = userByEmail?.name
      session.user.twoFactorEnabled = userByEmail?.twoFactorEnabled
            
      return session
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/login'
  }
}

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }