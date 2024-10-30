"use client";  
import { useSession } from "next-auth/react";
import {useRouter, useSearchParams } from "next/navigation";
import LoginModal from "@/components/auth/login-modal";
import SignupModal from "@/components/auth/signup-modal";
import ForgotPassword from "@/components/auth/forgot-password";

export default function AuthModals() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get('modal');
 
 
  if (status === "authenticated") {
     router.push("/")
  }

  return (
    <>
      {modal === 'login' && <LoginModal />}
      {modal === 'signup' && <SignupModal />}
      {modal === 'forgot-password' && <ForgotPassword />}
    </>
  );
}
 
