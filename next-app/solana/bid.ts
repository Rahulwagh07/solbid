import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  Connection
} from '@solana/web3.js';
import BN from 'bn.js';
import {convertUsdcToLamports } from '@/lib/helper';
import axios from 'axios';
import { PROGRAM_ID, CONNECTION, PLATFROM_ACCOUNT } from '@/lib/constant';
import { getBidPda, getGamePda, getPlayerPda } from './pda';

export const placeBid = async (bidder: PublicKey, gameId: number, bidAmount: number, bidCount: number) => {
  const gamePda = getGamePda(new BN(gameId))
  const playerPda = getPlayerPda(new BN(gameId), bidder, new BN(bidCount))
  const bidPda = getBidPda(new BN(gameId), new BN(bidCount))
  const bidAmountLamports = convertUsdcToLamports(bidAmount)
  const bidAmountLamportsBuffer = Buffer.alloc(8)
  bidAmountLamportsBuffer.writeBigUInt64LE(BigInt(bidAmountLamports))
  const bidCountBuffer = Buffer.alloc(8)
  bidCountBuffer.writeBigUInt64LE(BigInt(bidCount))
 
  const instructionData = Buffer.concat([
    Buffer.from([1]), 
    bidAmountLamportsBuffer,
    bidCountBuffer
  ])
  
  const keys = [
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: PLATFROM_ACCOUNT, isSigner: false, isWritable: true},
    { pubkey: gamePda, isSigner: false, isWritable: true },
    { pubkey: bidder, isSigner: true, isWritable: true },
    { pubkey: bidPda, isSigner: false, isWritable: true },
    { pubkey: playerPda, isSigner: false, isWritable: true },
  ]

  const res = await axios.get('/api/bid', {
    params: {
      id: gameId,
    },
  })
   
  const playersPda = res.data.playersPda
  const bidsPda = res.data.bidsPda
  const playersPubkeys = res.data.playersPubkey

  playersPda.forEach((player: string) => {
    keys.push({ pubkey: new PublicKey(player), isSigner: false, isWritable: true })
  })

  bidsPda.forEach((bid: string) => {
    keys.push({ pubkey: new PublicKey(bid), isSigner: false, isWritable: true })
  })

  playersPubkeys.forEach((playerPubkey: string) => {
    keys.push({ pubkey: new PublicKey(playerPubkey), isSigner: false, isWritable: true })
  })

  const placeBidIx = new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data: instructionData
  })

  return { instructions: [placeBidIx], totalCost: bidAmountLamports, playerPda, bidPda }
}
export const placeBidScale = async (bidder: PublicKey, gameId: number, bidAmount: number, bidCount: number) => {
  const gamePda = getGamePda(new BN(gameId));
  const playerPda = getPlayerPda(new BN(gameId), bidder, new BN(bidCount));
  const bidPda = getBidPda(new BN(gameId), new BN(bidCount));
  
  const bidAmountLamports = convertUsdcToLamports(bidAmount);
  const bidAmountLamportsBuffer = Buffer.alloc(8);
  bidAmountLamportsBuffer.writeBigUInt64LE(BigInt(bidAmountLamports));
  const bidCountBuffer = Buffer.alloc(8);
  bidCountBuffer.writeBigUInt64LE(BigInt(bidCount));
  
  const instructionData = Buffer.concat([
    Buffer.from([1]), 
    bidAmountLamportsBuffer,
    bidCountBuffer
  ]);

  const res = await axios.get('/api/bid', {
    params: { id: gameId },
  });

  const baseKeys = [
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: PLATFROM_ACCOUNT, isSigner: false, isWritable: true },
    { pubkey: gamePda, isSigner: false, isWritable: true },
    { pubkey: bidder, isSigner: true, isWritable: true },
    { pubkey: bidPda, isSigner: false, isWritable: true },
    { pubkey: playerPda, isSigner: false, isWritable: true },
  ];

  const playersPda = res.data.playersPda.map((p: string) => new PublicKey(p));
  const bidsPda = res.data.bidsPda.map((b: string) => new PublicKey(b));
  const playersPubkeys = res.data.playersPubkey.map((p: string) => new PublicKey(p));

  const CHUNK_SIZE = 12;
 
  const chunkedPlayersPda = [];
  const chunkedBidsPda = [];
  const chunkedPlayersPubkeys = [];
 
  for (let i = 0; i < playersPda.length; i += CHUNK_SIZE) {
    chunkedPlayersPda.push(playersPda.slice(i, i + CHUNK_SIZE));
    chunkedBidsPda.push(bidsPda.slice(i, i + CHUNK_SIZE));
    chunkedPlayersPubkeys.push(playersPubkeys.slice(i, i + CHUNK_SIZE));
  }
 
  const instructions: TransactionInstruction[] = [];

  for (let i = 0; i < chunkedPlayersPda.length; i++) {
    const chunkKeys = [
      ...baseKeys,
      ...chunkedPlayersPda[i].map( ({ pubkey }: { pubkey: PublicKey }) => ({
        pubkey,
        isSigner: false,
        isWritable: true
      })),
      ...chunkedBidsPda[i].map(({ pubkey }: { pubkey: PublicKey }) => ({
        pubkey,
        isSigner: false,
        isWritable: true
      })),
      ...chunkedPlayersPubkeys[i].map(({ pubkey }: { pubkey: PublicKey }) => ({
        pubkey,
        isSigner: false,  
        isWritable: true
      }))
    ];

    const instruction = new TransactionInstruction({
      keys: chunkKeys,
      programId: PROGRAM_ID,
      data: instructionData
    });

    instructions.push(instruction);
  }

 
  const transaction = new Transaction();
  const latestBlockhash = await CONNECTION.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = latestBlockhash.blockhash;
  transaction.feePayer = bidder;
 
  instructions.forEach(ix => transaction.add(ix));
 
  const fee = await transaction.getEstimatedFee(CONNECTION) || 5000000;

  const totalCost = fee + bidAmount;

  return {
    transaction,
    latestBlockhash,
    totalCost,
    playerPda,
    bidPda,
    chunksCount: chunkedPlayersPda.length
  };
};
 
export const executeBidTransaction = async (
  wallet: any,
  connection: Connection,
  transaction: Transaction,
  latestBlockhash: any
) => {
  try {
    const signedTx = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize(), {
      skipPreflight: true, //skip the preflight transaction checks
      maxRetries: 5  
    });

    await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    });
    
    return signature;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};