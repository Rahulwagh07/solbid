import { ScrollArea } from "@/components/ui/scroll-area"
import { LiveGame } from "@/types/dashboard"
import Link from 'next/link'
 

export default function LiveGames({ games }: { games: LiveGame[] }) {
  return (
    <>
      <h2 className="text-l sm:text-3xl font-bold mb-6">Live Games</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]  sm:h-[calc(100vh-12rem)] pr-4 pb-3">
        {games.map((game) => (
          <div key={game.gameId} className="flex flex-col gap-4 sm:gap-0  text-sm sm:flex-row items-start sm:items-center justify-between p-4 mb-4  border border-slate-700/90 bg-slate-700/50 rounded-lg shadow">
            <div>
              <p className="font-medium">Game #{game.gameId}</p>
              <p className="text-sm text-slate-400">Total Bids: {game.totalBids}</p>
            </div>
            <div className="sm:text-right">
              <p className="font-medium">Prize Pool: ${game.prizePool}</p>
              <p className="text-sm text-slate-400">Highest Bid: ${game.highestBid}</p>
              <p className="text-sm text-slate-400">Your Bids: {game.userBidCount} (${game.userBidAmount})</p>
            </div>
            <Link href={`/live/${game.gameId}`} className='bg-white text-black py-1.5 px-4 rounded-md border'>
              View
            </Link>
          </div>
        ))}
      </ScrollArea>
    </>
  )
}