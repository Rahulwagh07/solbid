import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/schema/credentials-schema";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    const emailValidation = signupSchema.shape.email.safeParse(email);
    if (!emailValidation.success) {
      return NextResponse.json({ message: "Invalid data" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: emailValidation.data },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: emailValidation.data },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
