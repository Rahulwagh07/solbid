import { PROGRAM_ID } from "@/lib/constant";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export function getGamePda(gameId: BN): PublicKey {
  const gameIdBuffer = Buffer.from(gameId.toArray("le", 8));
  const [gamePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("game"), gameIdBuffer],
    PROGRAM_ID,
  );
  return gamePda;
}

export function getPlayerPda(
  gameId: BN,
  publicKey: PublicKey,
  bidCount: BN,
): PublicKey {
  const gameIdBuffer = Buffer.from(gameId.toArray("le", 8));
  const bidCountBuffer = Buffer.from(bidCount.toArray("le", 8));
  const [playerPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("player"), gameIdBuffer, publicKey.toBuffer(), bidCountBuffer],
    PROGRAM_ID,
  );
  return playerPda;
}

export function getBidPda(gameId: BN, bidId: BN): PublicKey {
  const gameIdBuffer = Buffer.from(gameId.toArray("le", 8));
  const bidIdBuffer = Buffer.from(bidId.toArray("le", 8));
  const [bidPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("bid"), gameIdBuffer, bidIdBuffer],
    PROGRAM_ID,
  );
  return bidPda;
}
