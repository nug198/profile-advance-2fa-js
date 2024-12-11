import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt"
import { console } from "inspector";

const prisma = new PrismaClient()

export async function POST(req:Request) {
    try {
        const {name, email, password} = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json(
                {error: 'Semua Field Harus Terisi'},
                {status: 400}
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if (existingUser) {
            return NextResponse.json(
                {error:'Email sudah Terdaftar'},
                {status:400}
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        
        return NextResponse.json({
            message: 'Registrasi Berhasil',
            userid: user.id,
            email: user.email,
            name: user.name
        });

    } catch (error) {
        console.error('Registration errlr:',error);
        
        return NextResponse.json(
            {error: 'terjadi kesalahan saat registrasi'},
            {status: 500},    
        );
    }
}