import { NextAuthOptions, Session} from "next-auth";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signupSchema } from "@/schema/credentials-schema";
import prisma from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    provider?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        name: { type: "text" },
        isSignUp: { type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const emailValidation = signupSchema.shape.email.safeParse(credentials.email);
        if (!emailValidation.success) {
          throw new Error("Invalid email");
        }

        const passwordValidation = signupSchema.shape.password.safeParse(credentials.password);
        if (!passwordValidation.success) {
          throw new Error(passwordValidation.error.issues[0].message);
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: emailValidation.data }
          });

          if (credentials.isSignUp === "true") {
            // Sign Up
            if (user) {
              throw new Error("409");
            }

            if (!credentials.name) {
              throw new Error("Name is required for sign up");
            }

            const nameValidation = signupSchema.shape.name.safeParse(credentials.name);
            if (!nameValidation.success) {
              throw new Error(nameValidation.error.issues[0].message);
            }

            const hashedPassword = await bcrypt.hash(passwordValidation.data, 10);
            const newUser = await prisma.user.create({
              data: {
                email: emailValidation.data,
                name: nameValidation.data,
                password: hashedPassword,
                provider: "Credentials"
              }
            });
            return {
              id: newUser.id.toString(),
              email: newUser.email,
              name: newUser.name,
            }; 
          } else {
            // Sign In
            if (!user || !user.password) {
              throw new Error("404");
            }
           
            const passwordVerification = await bcrypt.compare(passwordValidation.data, user.password);
            if (!passwordVerification) {
              throw new Error("401");
            }

            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              image:user.imageUrl,
            };
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    })
  ],
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // This runs only at initial login
      if (account && user) {
        const foundUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });
        if (foundUser) {
          token.id = foundUser.id.toString(); // Save Prisma ID at login
          token.provider = account.provider;
        }
      } else if (token.email) {
        // Runs on every request to ensure `token.id` has Prisma `id`
        const foundUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (foundUser) {
          token.id = foundUser.id.toString();
        }
      }
  
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      return session;
    },
    async signIn({ account, profile }) {
      try {
        if (account?.provider === "google" && profile?.email) {
          const user = await prisma.user.findUnique({
            where: { email: profile.email }
          });

          if (!user) {
            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || undefined,
                provider: "Google",
              }
            });
          }
        }
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }
};