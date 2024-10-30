'use client'

import { useState, useCallback } from 'react'
import { Connection, Transaction, LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from '@/hooks/use-toast'

type TransactionState = 'idle' | 'preparing' | 'awaitingApproval' | 'submitting' | 'confirming' | 'success' | 'error'

interface TransactionStatus {
  state: TransactionState
  message: string
}

const STATUS_MESSAGES: Record<TransactionState, string> = {
  idle: 'Ready',
  preparing: 'Preparing transaction...',
  awaitingApproval: 'Awaiting wallet approval...',
  submitting: 'Submitting transaction...',
  confirming: 'Confirming transaction...',
  success: 'Transaction successful!',
  error: 'Transaction failed'
}

export function useTransaction(connection: Connection) {
  const [status, setStatus] = useState<TransactionStatus>({ state: 'idle', message: STATUS_MESSAGES.idle })
  const { publicKey, signTransaction } = useWallet()
  const { toast } = useToast()

  const resetStatus = () => setStatus({ state: 'idle', message: STATUS_MESSAGES.idle })

  const execute = useCallback(async (
    createInstructions: () => Promise<{ instructions: TransactionInstruction[], totalCost?: number }>
  ) => {
    if (!publicKey || !signTransaction) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    setStatus({ state: 'preparing', message: STATUS_MESSAGES.preparing })

    try {
      const { instructions, totalCost } = await createInstructions()
      const latestBlockhash = await connection.getLatestBlockhash('confirmed')

      const transaction = new Transaction().add(...instructions)
      transaction.recentBlockhash = latestBlockhash.blockhash
      transaction.feePayer = publicKey

      const balance = await connection.getBalance(publicKey)
      if (balance < (totalCost || 0)) {
        throw new Error(`Insufficient balance. You need at least ${(totalCost || 0) / LAMPORTS_PER_SOL} SOL`)
      }

      setStatus({ state: 'awaitingApproval', message: STATUS_MESSAGES.awaitingApproval })
      const signedTransaction = await signTransaction(transaction)

      setStatus({ state: 'submitting', message: STATUS_MESSAGES.submitting })
      const txid = await connection.sendRawTransaction(signedTransaction.serialize())

      setStatus({ state: 'confirming', message: STATUS_MESSAGES.confirming })
      const confirmation = await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txid,
      }, 'confirmed')

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`)
      }

      setStatus({ state: 'success', message: STATUS_MESSAGES.success })
      toast({
        title: "Transaction Successful",
        description: "Your transaction has been confirmed.",
        variant: "default",
      })

      return txid
    } catch (error) {
      setStatus({ state: 'error', message: STATUS_MESSAGES.error })
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }, [publicKey, signTransaction, connection, toast])

  return { status, execute, resetStatus  }
}