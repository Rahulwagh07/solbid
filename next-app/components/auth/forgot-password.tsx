'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { forgotPasswordSchema, ForgotPasswordFormData, validateForm } from "@/schema/credentials-schema"

export default function ForgotPasswordModal() {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  })
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({})
  const [step, setStep] = useState<"email" | "otp" | "newPassword">("email")
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

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
        await axios.post("/api/auth/forgot-password", { email: formData.email });
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
          description: "Password reset successfully! Login with your new password",
        });
        router.push("?modal=login");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          variant: "destructive",
          description: error.response.data.message || "An unexpected error occurred",
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
  

  return (
    <Dialog open={isOpen} onOpenChange={() => router.push('/')}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-[0.5px] border-slate-600">
        <DialogHeader>
          <DialogTitle>Reset Your Password</DialogTitle>
          <DialogDescription>
            {step === "email" && "Enter your email to receive a one-time password."}
            {step === "otp" && "Enter the OTP sent to your email."}
            {step === "newPassword" && "Enter your new password."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {step === "email" && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className='bg-gray-800 border-slate-700'
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
          )}
          {step === "otp" && (
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input
                className='bg-gray-800 border-slate-700'
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter OTP"
                required
                value={formData.otp || ''}
                onChange={handleInputChange}
              />
              {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
            </div>
          )}
          {step === "newPassword" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  className='bg-gray-800 border-slate-700'
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                  required
                  value={formData.password || ''}
                  onChange={handleInputChange}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  className='bg-gray-800 border-slate-700'
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  required
                  value={formData.confirmPassword || ''}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {step === "email" ? "Send OTP" : step === "otp" ? "Verify OTP" : "Reset Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}