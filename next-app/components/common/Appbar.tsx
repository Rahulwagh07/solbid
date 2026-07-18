"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { SolbidLogo } from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import "../../styles/wallet.css";

export default function Appbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();
  const session = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrolled = scrollY > 20;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-[400ms] ease-out pointer-events-none ${
        scrolled ? "pt-4 px-4 md:px-8" : "pt-0 px-4 md:px-8"
      }`}
    >
      <div
        className={`pointer-events-auto w-full max-w-7xl transition-all duration-[400ms] ease-out flex flex-col ${
          scrolled
            ? `border border-border bg-white/90 backdrop-blur-xl shadow-2xl ${isMenuOpen ? "rounded-[2rem]" : "rounded-full"}`
            : `border border-transparent bg-transparent ${isMenuOpen ? "rounded-[2rem]" : "rounded-full"}`
        }`}
      >
        <nav className="mx-auto flex w-full h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-2 group"
          >
            <span className="inline-flex items-center justify-center text-highlight">
              <SolbidLogo className="h-7 w-7" />
            </span>
            <span className="font-mono text-base font-semibold tracking-tight text-text transition-colors duration-150 group-hover:text-accent">
              SolBid
            </span>
          </motion.button>

          <div className="hidden md:flex items-center gap-2">
            {session.data?.user ? (
              <>
                <Link
                  href="/home"
                  className="rounded-lg px-4 py-2 font-mono text-sm text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-text"
                >
                  Games
                </Link>

                <WalletMultiButton className="wallet-button" />

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen((v) => !v)}
                    className="ml-1 rounded-full ring-2 ring-border transition-all duration-150"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.data.user.image ?? ""}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-accent text-white text-xs font-mono">
                        {session.data.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-44 surface overflow-hidden z-50"
                      >
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted font-mono hover:bg-surface-2 hover:text-text transition-colors"
                          >
                            <LayoutDashboard className="h-3.5 w-3.5 text-muted" />
                            Dashboard
                          </Link>
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted font-mono hover:bg-surface-2 hover:text-text transition-colors"
                          >
                            <LogOut className="h-3.5 w-3.5 text-muted" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 font-mono text-sm text-muted transition-colors duration-150 hover:text-text"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-press inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-6 font-semibold text-white shadow-accent hover:bg-accent-hover font-mono text-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center surface text-muted hover:text-text transition-colors"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden px-4 pb-5 pt-3 space-y-2 border-t border-border ${scrolled ? "bg-transparent rounded-b-[2rem]" : "surface"}`}
            >
              {session.data?.user ? (
                <>
                  <Link
                    href="/home"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 surface px-4 py-3 font-mono text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors rounded-lg"
                  >
                    Games
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 surface px-4 py-3 font-mono text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors rounded-lg"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 surface px-4 py-3 font-mono text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors rounded-lg"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center surface px-4 py-3 font-mono text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-press inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-6 font-semibold text-white shadow-accent hover:bg-accent-hover font-mono text-sm w-full"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
