import { NextResponse } from 'next/server'
import prisma from '@/lib/db';
import { signupSchema } from '@/schema/credentials-schema'
import { generateOtp, sendVerificationEmail } from '@/lib/email';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const otp = url.searchParams.get('otp');

    const emailValidation = signupSchema.shape.email.safeParse(email);
    const otpValidation = signupSchema.shape.otp.safeParse(otp);
    if (!emailValidation.success || !otpValidation.success) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 })
    }
    const otpRecord = await prisma.oTP.findFirst({
      where: { 
        email:emailValidation.data,
        otp:otpValidation.data,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000)  
        }
      }
    })

    if (!otpRecord) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 401  })
    }
    
    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 })

  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { email} = await req.json()

    const emailValidation = signupSchema.shape.email.safeParse(email);

    const user = await prisma.user.findUnique({
      where: { email: emailValidation.data }
    });
    if(user){
      return NextResponse.json({message: "User already exist"}, {status : 200})
    }
    
    if (!emailValidation.success) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 })
    }
    const otp = generateOtp()
    await sendVerificationEmail(emailValidation.data, otp)

    await prisma.oTP.create({
      data: { 
        email:emailValidation.data,
        otp,
      }
    })
    
    return NextResponse.json({ message: 'OTP verification email send' }, {status: 201})
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

 