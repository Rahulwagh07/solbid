import { PublicKey } from "@solana/web3.js";
import * as borsh from "@coral-xyz/borsh";

export class GameState {
  game_id: number;
  initial_bid_amount: number;
  highest_bid: number;
  last_bid_time: number;
  total_bids: number;
  last_bidder: PublicKey;
  prize_pool: number;
  platform_fee_percentage: number;
  game_ended: boolean;

  constructor(fields: Partial<GameState> = {}) {
    this.game_id = fields.game_id || 0;
    this.initial_bid_amount = fields.initial_bid_amount || 0;
    this.highest_bid = fields.highest_bid || 0;
    this.last_bid_time = fields.last_bid_time || 0;
    this.total_bids = fields.total_bids || 0;
    this.last_bidder = fields.last_bidder || new PublicKey(0);
    this.prize_pool = fields.prize_pool || 0;
    this.platform_fee_percentage = fields.platform_fee_percentage || 0;
    this.game_ended = fields.game_ended || false;
  }

  static borshAccountSchema = borsh.struct([
    borsh.u64("game_id"),
    borsh.u64("initial_bid_amount"),
    borsh.u64("highest_bid"),
    borsh.u64("last_bid_time"),
    borsh.u64("total_bids"),
    borsh.publicKey("last_bidder"),
    borsh.u64("prize_pool"),
    borsh.u64("platform_fee_percentage"),
    borsh.bool("game_ended"),
  ]);

  static deserialize(buffer?: Buffer): GameState | null {
    if (!buffer) {
      return null;
    }

    try {
      const {
        game_id,
        initial_bid_amount,
        highest_bid,
        last_bid_time,
        total_bids,
        last_bidder,
        prize_pool,
        platform_fee_percentage,
        game_ended,
      } = this.borshAccountSchema.decode(buffer);

      return new GameState({
        game_id,
        initial_bid_amount,
        highest_bid,
        last_bid_time,
        total_bids,
        last_bidder,
        prize_pool,
        platform_fee_percentage,
        game_ended,
      });
    } catch (error) {
      console.error("Game deserialization error:", error);
      return null;
    }
  }
}

export class PlayerState {
  total_bid_amount: number;
  safe: boolean;
  royalty_earned: number;
  bid_count: number;

  constructor(fields: Partial<PlayerState> = {}) {
    this.total_bid_amount = fields.total_bid_amount || 0;
    this.safe = fields.safe || false;
    this.royalty_earned = fields.royalty_earned || 0;
    this.bid_count = fields.bid_count || 0;
  }

  static borshAccountSchema = borsh.struct([
    borsh.u64("total_bid_amount"),
    borsh.bool("safe"),
    borsh.u64("royalty_earned"),
    borsh.u64("bid_count"),
  ]);

  static deserialize(buffer?: Buffer): PlayerState | null {
    if (!buffer) {
      return null;
    }
    try {
      const { total_bid_amount, safe, royalty_earned, bid_count } =
        this.borshAccountSchema.decode(buffer);
      return new PlayerState({
        total_bid_amount,
        safe,
        royalty_earned,
        bid_count,
      });
    } catch (error) {
      console.error("Player deserialization error:", error);
      return null;
    }
  }
}
