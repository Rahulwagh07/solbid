import { z } from "zod";

export const nameSchema = z
  .string({ required_error: "Name is required" })
  .min(2, { message: "Name must be at least 2 characters" })
  .max(20, { message: "Name must be less than 20 characters" });

export const emailSchema = z
  .string({ required_error: "Email is required" })
  .email({ message: "Invalid email" });

export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(3, { message: "Password must be at least 3 characters" });

export const otpSchema = z
  .string({ required_error: "OTP is required" })
  .min(6, { message: "OTP must be at least 6 characters" })
  .max(6, { message: "OTP is max 6 characters" });

export const signupSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
  otp: otpSchema.optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  otp: otpSchema.optional(),
  password: passwordSchema.optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => !data.password || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const validateForm = <T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  data: T
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Partial<Record<keyof T, string>> = {};
      error.errors.forEach((err) => {
        const path = err.path[0];
        if (typeof path === 'string' && path in data) {
          errors[path as keyof T] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: {} };
  }
};