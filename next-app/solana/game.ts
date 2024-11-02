import {
  PublicKey,
  TransactionInstruction,
  SystemProgram
} from '@solana/web3.js';
import BN from 'bn.js';
import { convertLamportsToUsdc, convertUsdcToLamports } from '@/lib/helper';
import axios from 'axios';
import { PROGRAM_ID, CONNECTION} from '@/lib/constant';
import { getBidPda, getGamePda, getPlayerPda } from './pda';
import { GameState, PlayerState } from './state';

export const createGame = async (publicKey: PublicKey, gameId: number, bidAmount: number) => {
  const gameIdBuffer = Buffer.alloc(8)
  gameIdBuffer.writeBigUInt64LE(BigInt(gameId))

  const bidCountBuffer = Buffer.alloc(8)
  bidCountBuffer.writeBigUInt64LE(BigInt(1))

  const initialBidLamports = convertUsdcToLamports(bidAmount)
  const initialBidAmountBuffer = Buffer.alloc(8)
  initialBidAmountBuffer.writeBigUInt64LE(BigInt(initialBidLamports))

  const instructionData = Buffer.concat([
    Buffer.from([0]),
    gameIdBuffer,
    initialBidAmountBuffer,
  ])

  const gamePda = getGamePda(new BN(gameId))
  const playerPda = getPlayerPda(new BN(gameId), publicKey, new BN(1))
  const bidPda = getBidPda(new BN(gameId), new BN(1))

  const createGameIx = new TransactionInstruction({
    keys: [
      { pubkey: gamePda, isSigner: false, isWritable: true },
      { pubkey: publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: playerPda, isSigner: false, isWritable: true },
      { pubkey: bidPda, isSigner: false, isWritable: true },
    ],
    programId: PROGRAM_ID,
    data: instructionData,
  })

  return { instructions: [createGameIx], totalCost: initialBidLamports, gamePda, playerPda, bidPda }
}


export const getGameData = async (gameId: number) => {
  const gamePda = getGamePda(new BN(gameId));
  const accountInfo = await CONNECTION.getAccountInfo(gamePda);
  if (!accountInfo) {
    throw new Error('Game account not found');
  }
  const gameState = GameState.deserialize(accountInfo.data);
  return gameState;
}

export const getAllPlayersAndBids = async (gameId: number, playerPubKey: PublicKey, bidCount: number) => {
  const playerPda = getPlayerPda(new BN(gameId), playerPubKey, new BN(bidCount));
  const accountInfo = await CONNECTION.getAccountInfo(playerPda);
  if (!accountInfo) {
    throw new Error('Player account not found');
  }
  const playerState = PlayerState.deserialize(accountInfo.data);
  return playerState;
}

export const getAllGames = async () => {
  const accounts = await CONNECTION.getProgramAccounts(PROGRAM_ID, {
    filters: [
      {
        memcmp: {
          offset: 0,
          bytes: Buffer.from([0]).toString('base64'),  
        },
      },
    ],
  });

  const games: GameState[] = [];
  for (const account of accounts) {
    const gameState = GameState.deserialize(account.account.data);
    if (gameState) {
      games.push(gameState);
    }
  }
  return games;
}

export const getAllPlayersAndBidsForGame = async (gameId: number) => {
  try {
    const res = await axios.get('/api/pda', {
      params: {
        id: gameId,
      },
    });

    const players = res.data.players;
    const playerStates = [];

    for (const player of players) {
      const { playerPda, playerId }: { playerPda: string; playerId: number } = player;
      const accountInfo = await CONNECTION.getAccountInfo(new PublicKey(playerPda));
      if (accountInfo && accountInfo.data) {
        const playerState = PlayerState.deserialize(accountInfo.data);
        if (playerState) {
          playerStates.push({
            playerId,
            total_bid_amount: parseInt(playerState.total_bid_amount.toString()),
            safe: playerState.safe,
            royalty_earned: convertLamportsToUsdc(parseInt(playerState.royalty_earned.toString())),
            bid_count: parseInt(playerState.bid_count.toString()),
          });
        } else {
          console.error(`Failed to deserialize account for PDA: ${playerPda}`);
        }
      } else {
        console.error(`Account not found PDA: ${playerPda}`);
      }
    }
    return playerStates;  

  } catch (error) {
    console.error("Error fetching players and bids:", error);
  }
};
