"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import "../../styles/wallet.css"

export default function Appbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);
  const [scrollY, setScrollY] = useState(0)
  const router = useRouter()
  const session = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined"){
      const handleScroll = () => setScrollY(window.scrollY)
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navbarBackground = scrollY > 20 ? "bg-slate-900/90 backdrop-blur-md" : "bg-slate-900/30"

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBackground}`}>
      <nav className="w-full xl:w-11/12 mx-auto py-3 flex justify-between items-center pl-4 md:px-4 lg:px-8 xl:px-0">
        <motion.div 
          className="text-2xl font-bold font-serif bg-clip-text cursor-pointer text-transparent text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => router.push("/")}
        >
          SolBid
        </motion.div>
        <div className="md:hidden">
          <Button variant={"ghost"} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
        <AnimatePresence>
          {(isMenuOpen || windowWidth  > 768) && (
            <motion.ul 
              className={`md:flex md:space-x-6 items-center ${isMenuOpen ? 'flex flex-col absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md p-4' : 'hidden'} md:relative md:p-0 md:bg-transparent`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
            {session.data?.user ? (
              <li className='flex flex-col md:flex-row gap-8 items-center'>
               <Link
                  href="/home"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white font-semibold rounded-[5px] px-6 py-2.5
                    bg-slate-800 border border-slate-700 hover:bg-zinc-900/50
                    "
                >
                  Games
                </Link>
                <WalletMultiButton className="wallet-button"/>
                <div className='hidden md:block relative' ref={dropdownRef}>
                  <Avatar 
                    className="cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <AvatarImage src={session?.data?.user?.image || ""} alt="ProfileIcon" />
                    <AvatarFallback>{session?.data.user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 rounded-md z-100 bg-white border-slate-600 dark:bg-slate-700/50 border-[0.5px]">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <Link onClick={(() => setIsDropdownOpen(false))} href="/dashboard" className="flex items-center px-4 py-2 text-sm dark:text-gray-200 text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-600">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex items-center w-full px-4 py-2 text-sm dark:text-gray-200 text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className='md:hidden flex items-center justify-center'>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center py-2 px-3 text-sm sm:text-lg text-white rounded hover:bg-gray-100 
                 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white
                  md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>

                </div>
                <Link href={"/dashboard"} className='md:hidden' onClick={() => setIsMenuOpen(false)}>
                  <Avatar>
                    <AvatarImage src={session?.data?.user?.image || ""} alt="ProfileIcon" />
                    <AvatarFallback>{session?.data.user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
              </li>
            ) : (
              <>
                <Link href='/?modal=login'  onClick={() => setIsMenuOpen(false)}
                  className='block py-2 px-3 text-lg text-white font-serif rounded hover:bg-gray-100 
                  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white
                  md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Login
                </Link>
                <Link href='/?modal=signup' onClick={() => setIsMenuOpen(false)}
                  className='block py-2 px-3 text-lg text-white font-serif rounded hover:bg-gray-100 
                  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white
                  md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Signup
                </Link>
              </>
            )}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}