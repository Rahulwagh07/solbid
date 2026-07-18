"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import axios from "axios";
import {
  signupSchema,
  SignupFormData,
  validateForm,
} from "@/schema/credentials-schema";
import { useSocket } from "@/context/socket-context";
import { motion } from "motion/react";

export default function SignupPage() {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [showOtpInput, setShowOtpInput] = useState(false);
  const router = useRouter();
  const { setUser } = useSocket();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { isValid, errors } = validateForm(signupSchema, formData);
    if (!isValid) {
      setErrors(errors);
      return;
    }
    setIsLoading(true);

    try {
      if (!showOtpInput) {
        const res = await axios.post("/api/auth/verify-email", {
          email: formData.email,
        });
        if (res.status === 200) {
          toast({
            title: "User exists",
            description: "Please login instead",
            variant: "default",
          });
          router.push("/login");
          return;
        }
        if (res.status === 201) {
          setShowOtpInput(true);
          toast({
            title: "OTP Sent",
            description: "Please check your email",
            variant: "default",
          });
          return;
        }
      } else {
        const res = await axios.get("/api/auth/verify-email", {
          params: {
            email: formData.email,
            otp: formData.otp,
          },
        });
        if (res.status === 200) {
          const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            name: formData.name,
            password: formData.password,
            isSignUp: "true",
          });
          if (result?.error === "409") {
            toast({
              title: "Email already exists",
              description: "Please login instead",
              variant: "destructive",
            });
            router.push("/login");
            return;
          }
          toast({
            title: "Signup Successful",
            description: "Welcome to our platform!",
            variant: "default",
          });
          router.push("/home");
          return;
        } else {
          throw new Error("OTP verification failed");
        }
      }
    } catch {
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoadingGoogle(true);
    try {
      await signIn("google", { callbackUrl: "/home" });
      const session = await getSession();
      setUser(session?.user || null);
    } catch {
      toast({
        title: "Signup Failed",
        description: "An error occurred during Google signup",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface border border-border shadow-xl rounded-xl p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
            <h2 className="font-display text-xl font-bold text-text">
              Create an account
            </h2>
            <p className="text-sm text-muted mt-1">
              {showOtpInput
                ? "Enter the OTP sent to your email to verify your account."
                : "Enter your details below to create your account or continue with Google."}
            </p>
          </div>

          {!showOtpInput && (
            <>
              <div className="mt-5">
                <button
                  type="button"
                  disabled={isLoadingGoogle || isLoading}
                  className="btn-press w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface font-medium text-text hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleGoogleSignup}
                >
                  {isLoadingGoogle ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FcGoogle className="h-4 w-4" />
                  )}{" "}
                  Continue with Google
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface px-3 text-xs text-muted uppercase tracking-widest">
                    or
                  </span>
                </div>
              </div>
            </>
          )}

          <form
            onSubmit={handleSubmit}
            className={`space-y-4 ${showOtpInput ? "mt-5" : ""}`}
          >
            {!showOtpInput ? (
              <>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="label-caps mb-1.5 block">
                    Email
                  </label>
                  <Input
                    className="w-full h-11 px-3 text-sm font-mono text-text bg-white border border-border rounded-xl placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-highlight transition-colors"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <p className="text-xs font-mono text-error mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="name" className="label-caps mb-1.5 block">
                    Name
                  </label>
                  <Input
                    className="w-full h-11 px-3 text-sm font-mono text-text bg-white border border-border rounded-xl placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-highlight transition-colors"
                    id="name"
                    name="name"
                    placeholder="Enter username"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="text-xs font-mono text-error mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="label-caps mb-1.5 block">
                    Password
                  </label>
                  <Input
                    className="w-full h-11 px-3 text-sm font-mono text-text bg-white border border-border rounded-xl placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-highlight transition-colors"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <p className="text-xs font-mono text-error mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor="otp" className="label-caps mb-1.5 block">
                  OTP
                </label>
                <Input
                  className="w-full h-11 px-3 text-sm font-mono text-text bg-white border border-border rounded-xl placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-highlight transition-colors"
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter OTP"
                  required
                  value={formData.otp || ""}
                  onChange={handleInputChange}
                />
                {errors.otp && (
                  <p className="text-xs font-mono text-error mt-1">
                    {errors.otp}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <p className="text-sm text-muted">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-text hover:underline font-medium"
                >
                  Login
                </Link>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-press w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-6 font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {showOtpInput ? "Verify OTP" : "Sign Up"}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
