export interface Bid {
  id: number;
  amount: number;
  timestamp: string;
}

export interface Player {
  id: number;
  totalBidAmount: number;
  safe: boolean;
  royaltyEarned: number;
  bidCount: number;
  role: string;
  bid: Bid | null;
  user: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
}

export interface GameData {
  id: number;
  gameId: string;
  initialBidAmount: number;
  highestBid: number;
  lastBidTime: string;
  totalBids: number;
  prizePool: number;
  platformFeePercent: number;
  gameEnded: boolean;
  createdAt: string;
  players: Player[];
}
