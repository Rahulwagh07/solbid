"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Loader, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import {
  loginSchema,
  LoginFormData,
  validateForm,
} from "@/schema/credentials-schema";
import { useSocket } from "@/context/socket-context";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";

export default function LoginPage() {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "rahulwagh3774@gmail.com",
    password: "test@#1234",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
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
    const { isValid, errors } = validateForm(loginSchema, formData);
    if (!isValid) {
      setErrors(errors);
      return;
    }
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (result?.error) {
        if (result.error === "401") {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Incorrect password",
          });
        } else if (result.error === "404") {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "User does not exist, please sign up",
          });
          router.push("/signup");
          return;
        } else {
          throw new Error(result.error);
        }
      } else {
        const session = await getSession();
        setUser(session?.user || null);
        router.push("/home");
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    try {
      await signIn("google", { callbackUrl: "/home", redirect: true });
      const session = await getSession();
      setUser(session?.user || null);
      router.push("/home");
    } catch {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An error occurred during Google login",
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
              Login to your account
            </h2>
            <p className="text-sm text-muted mt-1">
              Enter your credentials below to login or continue with Google.
            </p>
          </div>

          {/* Google OAuth button */}
          <div className="mt-5">
            <button
              type="button"
              disabled={isLoadingGoogle || isLoading}
              className="btn-press w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface font-medium text-text hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoogleLogin}
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

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex justify-between items-center">
              <Link
                href="/forgot-password"
                className="text-sm text-text font-medium hover:underline"
              >
                Forgot password?
              </Link>
              <p className="text-sm text-muted">
                No account?{" "}
                <Link
                  href="/signup"
                  className="text-text hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-press w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-6 font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader className="h-4 w-4 animate-spin" />}
              Login
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
