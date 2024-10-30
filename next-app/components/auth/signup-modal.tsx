'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSession, signIn } from "next-auth/react"
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
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import axios from "axios"
import { signupSchema, SignupFormData, validateForm } from "@/schema/credentials-schema"
import { useSocket } from "@/context/socket-context"

export default function SignupModal() {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isOpen, _setIsOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    name: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<SignupFormData>>({})
  const [showOtpInput, setShowOtpInput] = useState(false)
  const router = useRouter()
  const {setUser} = useSocket()
  const {toast} = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const { isValid, errors } = validateForm(signupSchema, formData)
    if (!isValid) {
      setErrors(errors)
      return
    }
    setIsLoading(true)

    try {
      if (!showOtpInput) {
        const res = await axios.post("/api/auth/verify-email", { email: formData.email })
        if (res.status === 200) {
          toast({
            title: "User exists",
            description: "Please login instead",
            variant: "default",
          })
          router.push("?modal=login")
          return
        }
        if (res.status === 201) {
          setShowOtpInput(true)
          toast({
            title: "OTP Sent",
            description: "Please check your email",
            variant: "default",
          })
          return
        }
      } else {
        const res = await axios.get("/api/auth/verify-email", {
          params: {
            email: formData.email,
            otp: formData.otp,
          },
        })
        if (res.status === 200) {
          const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            name: formData.name,
            password: formData.password,
            isSignUp: "true",
          })
          if (result?.error === "409") {
            toast({
              title: "Email already exists",
              description: "Please login instead",
              variant: "destructive",
            })
            router.push("?modal=login")
            return
          }
          toast({
            title: "Signup Successful",
            description: "Welcome to our platform!",
            variant: "default",
          })
          router.push("/home")
          return
        } else {
          throw new Error("OTP verification failed")
        }
      }
    } catch {
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoadingGoogle(true)
    try {
      await signIn("google", { callbackUrl: '/home' })
      const session = await getSession();
      setUser(session?.user || null);
    } catch {
      toast({
        title: "Signup Failed",
        description: "An error occurred during Google signup",
        variant: "destructive",
      })
    } finally {
      setIsLoadingGoogle(false)
    }
  }

  return (
    <Dialog  open={isOpen} onOpenChange={() => router.push('/')}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 border-[0.5px] border-slate-600">
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
          <DialogDescription>
            {showOtpInput
              ? "Enter the OTP sent to your email to verify your account."
              : "Enter your details below to create your account or continue with Google."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {!showOtpInput ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className='bg-gray-800 border-slate-700'
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  className='bg-gray-800 border-slate-700'
                  id="name"
                  name="name"
                  placeholder="Enter username"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  className='bg-gray-800 border-slate-700'
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
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
          <div className="flex justify-end">
            <Link href="?modal=login" className="text-sm text-primary hover:underline">
              Already have an account? Login
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {showOtpInput ? 'Verify OTP' : 'Sign Up'}
          </Button>
        </form>
        {!showOtpInput && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={isLoadingGoogle || isLoading}
              className="w-full dark:bg-gray-900 dark:hover:bg-gray-950 dark:border-slate-700"
              onClick={handleGoogleSignup}
            >
              {isLoadingGoogle ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FcGoogle className="mr-2 h-4 w-4" />
              )}{" "}
              Google
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}