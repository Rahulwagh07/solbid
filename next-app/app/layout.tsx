import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "@/components/provider";
import Appbar from "@/components/common/Appbar";
import { Suspense } from "react";
import "../styles/wallet.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "SolBid - Competitive Bidding Game on Solana",
  description:
    "An online, competitive bidding game. Stake your claim, earn royalties, be the last to win. Built on Solana.",
  openGraph: {
    title: "SolBid - Competitive Bidding on Solana",
    description: "Stake your claim, earn royalties, be the last to win.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolBid - Competitive Bidding on Solana",
    description: "Stake your claim, earn royalties, be the last to win.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head></head>
      <body className="antialiased bg-background text-text min-h-full">
        <Providers>
          <Suspense fallback={<></>}>
            <Appbar />
          </Suspense>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
