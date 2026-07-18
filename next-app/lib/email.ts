import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Email Verification",
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    html: `<b>Your OTP is: ${otp}. It will expire in 5 minutes.</b>`,
  });
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
