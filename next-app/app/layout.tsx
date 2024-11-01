import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css"
import { Providers } from "@/components/provider";
import Appbar from "@/components/common/Appbar";
import { Suspense } from "react";
import "../styles/wallet.css"
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Solbid",
  description: "An Online, Competitive Bidding Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >  
        <Providers>
          <Suspense fallback={<></>}>
          <Appbar/>
          </Suspense>
          {children} 
        </Providers>
        <Toaster/>
      </body>
    </html>
  );
}
