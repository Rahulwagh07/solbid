import { NextAuthOptions, Session} from "next-auth";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signupSchema } from "@/schema/credentials-schema";
import prisma from "@/lib/db";
 
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
    async jwt({ token, account, trigger, user, session }) {
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.id = session.user.id;
        token.provider = session.user.provider;
        token.updated = true;
        return token;
      }
    
      if (account && user) {
        if (account.provider !== "credentials") {
          const foundUser = await prisma.user.findUnique({
            where: { email: user.email as string },
          });
          if (foundUser) {
            token.sub = foundUser.id.toString();
            token.provider = account.provider;
          }
        } else {
          token.id = user.id;
          token.provider = "credentials";
        }
      }
    
      return token;
    },
    async session({ session, token}: { session: Session, token: JWT}) {
      if (session.user) {
        session.user.id = token.id;
        session.user.provider = token.provider;
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? null;
  
        if (token.updated) {
          const user = await prisma.user.findUnique({
            where: { email: token.email?.toString() },
            select: { imageUrl: true },
          });
          session.user.image = user?.imageUrl ?? session.user.image;
        }
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