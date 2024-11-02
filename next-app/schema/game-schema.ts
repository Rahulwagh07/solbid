import { z } from "zod";
import bs58 from "bs58";


const base58Validator = z
  .string()
  .refine((val) => {
    try {
      bs58.decode(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "Invalid base58 string" });


export const gameSchema = z.object({
  gameId: z.number({ required_error: "Game ID is required" }).positive(),
  initialBidAmount: z
    .number({ required_error: "Initial Bid Amount is required" })
    .positive({ message: "Initial Bid Amount must be a positive number" }),
  creatorPublicKey: base58Validator,
  gamePda: base58Validator,
  playerPda: base58Validator,
  bidPda: base58Validator,
  txId: z.string({ required_error: "Transaction id is required" }),
});

export const bidSchema = z.object({
  gameId: z.number({ required_error: 'Game ID is required' }).positive(),
  bidPda: base58Validator,
  amount: z.number({ required_error: 'Bid amount is required' }).positive({ message: 'Bid amount must be a positive number' }),
  playerPda: base58Validator,
  creatorPublicKey: base58Validator,
  bidCount: z.number({ required_error: 'BidCount is required' }).positive(),
  txId: z.string({ required_error: "Transaction id is required" }),
  playerData: z.array(
    z.object({
      playerId: z.number({ required_error: 'Player ID is required' }),
      total_bid_amount: z.number(),
      royalty_earned: z.number(),
      bid_count: z.number(),
      safe: z.boolean(),
    })
  ),
});
export type GameData = z.infer<typeof gameSchema>;
export type BidData = z.infer<typeof bidSchema>;

