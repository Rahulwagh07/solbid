'use client'

import { useState, useEffect } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { Wallet } from "lucide-react" 
import { CONNECTION } from '@/lib/constant'
 
export default function WalletBalance() {
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
 
  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) {
        setBalance(null)
        return
      }
      try {
        const walletBalance = await CONNECTION.getBalance(publicKey)
        setBalance(walletBalance / LAMPORTS_PER_SOL)
      } catch (err) {
        console.error('Failed to fetch balance:', err)
        setBalance(null)
      }  
    }

    fetchBalance()
  }, [publicKey, connected])

  return connected && (
    <div
      className="border border-slate-700 rounded-md flex gap-2 items-center justify-center p-3"
    >
      <Wallet className="mr-2 text-green-400" size={24}/>
      <span>{balance?.toFixed(2)} SOL</span>  
    </div>
  )
}