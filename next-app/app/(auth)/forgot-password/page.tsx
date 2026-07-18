"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
  validateForm,
} from "@/schema/credentials-schema";
import { motion } from "motion/react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [step, setStep] = useState<"email" | "otp" | "newPassword">("email");
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { isValid, errors } = validateForm(forgotPasswordSchema, formData);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      if (step === "email") {
        await axios.post("/api/auth/forgot-password", {
          email: formData.email,
        });
        toast({
          description: "OTP sent to your email",
        });
        setStep("otp");
      } else if (step === "otp") {
        await axios.get("/api/auth/verify-email", {
          params: {
            email: formData.email,
            otp: formData.otp,
          },
        });
        toast({
          description: "OTP verified successfully",
        });
        setStep("newPassword");
      } else if (step === "newPassword") {
        await axios.post("/api/auth/reset-password", {
          email: formData.email,
          password: formData.password,
        });
        toast({
          description:
            "Password reset successfully! Login with your new password",
        });
        router.push("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          variant: "destructive",
          description:
            error.response.data.message || "An unexpected error occurred",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stepLabel = {
    email: "Send OTP",
    otp: "Verify OTP",
    newPassword: "Reset Password",
  }[step];

  const stepDescription = {
    email: "Enter your email to receive a one-time password.",
    otp: "Enter the OTP sent to your email.",
    newPassword: "Enter your new password.",
  }[step];

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
              Reset Your Password
            </h2>
            <p className="text-sm text-muted mt-1">{stepDescription}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            {step === "email" && (
              <div className="space-y-1.5">
                <label htmlFor="email" className="label-caps mb-1.5 block">
                  Email
                </label>
                <Input
                  className="w-full h-11 px-3 text-sm font-mono text-text bg-white border border-border rounded-xl placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-highlight transition-colors"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
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
            )}

            {step === "otp" && (
              <div className="space-y-1.5">
                <label htmlFor="otp" className="label-caps mb-1.5 block">
                  One-Time Password
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

            {step === "newPassword" && (
              <>
                <div className="space-y-1.5">
                  <label htmlFor="password" className="label-caps mb-1.5 block">
                    New Password
                  </label>
                  <Input
                    className="w-full h-11 px-3 text-sm font-mono text-text bg-white border border-border rounded-xl placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-highlight transition-colors"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    required
                    value={formData.password || ""}
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <p className="text-xs font-mono text-error mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="label-caps mb-1.5 block"
                  >
                    Confirm New Password
                  </label>
                  <Input
                    className="w-full h-11 px-3 text-sm font-mono text-text bg-white border border-border rounded-xl placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-highlight transition-colors"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    required
                    value={formData.confirmPassword || ""}
                    onChange={handleInputChange}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs font-mono text-error mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-press w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-6 font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {stepLabel}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
