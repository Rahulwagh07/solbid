import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req:Request) {
  try {
    const userId = req.headers.get('userId');
  
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
 
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        players: {
          include: {
            game: true,
            bid: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const totalBids = user.players.length
    const highestBid = Math.max(...user.players.map(player => player.totalBidAmount))
    const totalRoyalties = user.players.reduce((acc, player) => acc + player.royaltyEarned, 0)
    const totalAmount = user.players.reduce((acc, player) => acc + player.totalBidAmount, 0)

    const recentTransactions = user.players
      .filter(player => player.bid)
      .map(player => ({
        id: player.id.toString(),
        gameId: player.game.gameId,
        amount: player.bid!.amount,
        timestamp: player.bid!.timestamp.toISOString(),
        txId: player.bid!.txId || '',
        bidCount: player.bidCount
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const liveGames = user.players
      .filter(player => !player.game.gameEnded)
      .map(player => ({
        gameId: player.game.gameId,
        highestBid: player.game.highestBid,
        totalBids: player.game.totalBids,
        lastBidTime: player.game.lastBidTime.toISOString(),
        prizePool: player.game.prizePool,
        userBidAmount: player.totalBidAmount,
        userBidCount: player.bidCount
      }))

    const pastGames = user.players
      .filter(player => player.game.gameEnded)
      .map(player => ({
        gameId: player.game.gameId,
        totalAmount: player.totalBidAmount,
        totalRoyalty: player.royaltyEarned,
        endTime: player.game.updatedAt.toISOString(),
      }))

    return NextResponse.json({
      metrics: {
        totalBids,
        highestBid,
        totalRoyalties,
        totalAmount,
      },
      recentTransactions,
      liveGames,
      pastGames
    })
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}