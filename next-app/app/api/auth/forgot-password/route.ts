import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { generateOtp, sendVerificationEmail } from '@/lib/email'
import { signupSchema } from '@/schema/credentials-schema';
 
export async function POST(req:Request) {
  const { email } = await req.json();
  try {
    const emailValidation = signupSchema.shape.email.safeParse(email);
    if(!emailValidation.success){
      return NextResponse.json({ message: 'Invalid data' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({ where: { email:emailValidation.data } })
    if (!user) {
      return NextResponse.json({message: 'User not found'}, {status : 404})
    }

    const otp = generateOtp()
    await prisma.oTP.create({
      data: {
        email,
        otp,
      },
    })

    await sendVerificationEmail(email, otp)
    return NextResponse.json({message: 'OTP sent to your email'}, {status : 200})

  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  } 
}