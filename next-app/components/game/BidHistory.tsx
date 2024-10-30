import {CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { RedoDot } from 'lucide-react'
import { Player } from '@/types/game'

export function BidHistory({ players } : {players: Player[]}) {
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.role === 'WINNER') return -1
    if (b.role === 'WINNER') return 1
    return a.bidCount - b.bidCount
  })

  return (
    <div className="bg-slate-900  border-slate-700 rounded-xl -mt-12">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-100 text-lg">
          Bid History <RedoDot className="ml-2 text-blue-700" />
        </CardTitle>
      </CardHeader>
      <CardContent className='px-1 sm:px-4'>
        <div className="space-y-4 text-sm ">
          <div className="grid grid-cols-4 gap-1 sm:gap-4 pb-2 border-b border-slate-700 text-slate-300">
            <div>User</div>
            <div >Time</div>
            <div>Bet Amount</div>
            <div>Royalty Earned</div>
          </div>
        
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className="grid grid-cols-4 gap-1 sm:gap-4 py-2 border-b-[0.5px] border-slate-700 items-center">
              <div className="flex flex-col sm:flex-row sm:space-x-2 sm:items-center text-sm sm:text-left sm:mt-0 space-y-1 sm:space-y-0">
                <Avatar className="w-8 h-8 border-2 border-slate-600">
                  <AvatarImage src={player.user.imageUrl || undefined} />
                  <AvatarFallback>{player.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{player.user.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {player.role === 'WINNER' && (
                      <Badge variant="default" className="bg-yellow-600 text-slate-100 text-xs">
                        Winner
                      </Badge>
                    )}
                    {player.bidCount === 1 && (
                      <Badge variant="default" className="bg-green-600 text-slate-100 text-xs">
                        Creator
                      </Badge>
                    )}
                    {index === sortedPlayers.length - 1 && (
                      <Badge variant="default" className="bg-blue-600 text-slate-100 text-xs">
                        Finisher
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div  className="flex flex-col sm:flex-row sm:space-x-2 text-sm sm:text-left mt-2 sm:mt-0 space-y-1 sm:space-y-0 text-slate-400">
                {player.bid ? new Date(player.bid.timestamp).toLocaleString() : 'N/A'}
              </div>
              <div className="  text-slate-400">
                {player.bid ? `$${player.bid.amount.toFixed(2)}` : 'N/A'}
              </div>
              <div className="  text-slate-400">
                ${player.royaltyEarned.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  )
}