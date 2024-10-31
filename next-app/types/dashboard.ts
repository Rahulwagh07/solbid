export interface DashboardData {
  metrics: Metrics
  recentTransactions: RecentTransaction[]
  liveGames: LiveGame[]
  pastGames: PastGame[]
}

export interface Metrics {
  totalBids: number
  highestBid: number
  totalRoyalties: number
  totalAmount: number
}

export interface RecentTransaction {
  id: string
  gameId: string
  amount: number
  timestamp: string
  txId: string
  bidCount: number
}

export interface LiveGame {
  gameId: string
  highestBid: number
  totalBids: number
  lastBidTime: string
  prizePool: number
  userBidAmount: number
  userBidCount: number
}

export interface PastGame {
  gameId: string
  totalAmount: number
  totalRoyalty: number
  endTime: string
}
