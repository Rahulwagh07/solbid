import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Award, Clock, CircleDollarSign, Users, DollarSign } from 'lucide-react'
import { GameData } from '@/types/game'

export function GameStatistics({ gameData } : {gameData: GameData}) {
  const winner = gameData.players.find(player => player.role === 'WINNER')
  let finisher;
  if(gameData.totalBids > 5){
    finisher = gameData.players.find(player => player.bidCount === 1);
  } else{
    finisher = gameData.players.find(player => player.role === 'FINISHER')
  }

  return (
    <>
    <Card className="text-slate-200 bg-slate-800 border-slate-700 pb-16">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700">
          {/* Winner Section */}
          <div className="p-6">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center text-slate-100 text-lg sm:text-xl">
                <Trophy className="mr-2 text-green-500" /> Winner
              </CardTitle>
            </CardHeader>
            {winner && (
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-slate-600">
                  <AvatarImage src={winner.user.imageUrl || undefined} />
                  <AvatarFallback>{winner.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="sm:text-lg font-bold">{winner.user.name}</p>
                  <p className="text-slate-300 flex items-center">
                    Winning Price: 
                    <span className="ml-1 flex items-center">
                      {winner.royaltyEarned}
                      <DollarSign size={16}/>
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Finisher Section */}
          <div className="p-6">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center text-slate-100 text-lg sm:text-xl" >
                <Award className="mr-2 text-red-600" /> 
                {
                  gameData.totalBids > 5 ? "Creator" : " Finisher"
                }
              </CardTitle>
            </CardHeader>
            {finisher && (
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-slate-600">
                  <AvatarImage src={finisher.user.imageUrl || undefined} />
                  <AvatarFallback>{finisher.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="sm:text-lg font-bold">{finisher.user.name}</p>
                  <p className="text-slate-300 flex items-center text-sm">
                    Royalty Earned: 
                    <span className="ml-1 flex items-center">
                      {finisher.royaltyEarned}
                      <DollarSign size={16}/>
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-slate-800 text-slate-200 border-b-[0px] border-[0.5px] rounded-sm border-slate-700 -mt-6 pb-12">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-700">
          <div className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center text-slate-100 text-lg">
                <Clock className="mr-2 text-blue-500" /> Game Duration
              </CardTitle>
            </CardHeader>
            <div>
              <p className="font-semibold">
                {Math.floor((new Date(gameData.lastBidTime).getTime() - new Date(gameData.createdAt).getTime()) / 60000)} minutes
              </p>
              <p className="text-sm text-slate-400">Start: {new Date(gameData.createdAt).toLocaleString()}</p>
              <p className="text-sm text-slate-400">End: {new Date(gameData.lastBidTime).toLocaleString()}</p>
            </div>
          </div>
          <div className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center text-slate-100 text-lg">
                <CircleDollarSign className="mr-2 text-blue-500" /> Prize Pool
              </CardTitle>
            </CardHeader>
            <div>
              <p className="font-semibold flex items-center">
                {gameData.prizePool}
                <DollarSign size={16}/>
              </p>
              <p className="text-sm text-slate-400 flex items-center">
                Initial Bid: {gameData.initialBidAmount}
                <DollarSign size={16}/>
              </p>
              <p className="text-sm text-slate-400 flex items-center">
                Highest Bid: {gameData.highestBid}
                <DollarSign size={16}/>
              </p>
            </div>
          </div>
          <div className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center text-slate-100 text-lg">
                <Users className="mr-2 text-blue-500" /> Game Stats
              </CardTitle>
            </CardHeader>
            <div>
              <p className="font-semibold">{gameData.totalBids} Bids</p>
              <p className="text-sm text-slate-400">Players: {gameData.players.length}</p>
              <p className="text-sm text-slate-400">Platform Fee: {gameData.platformFeePercent}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  )
}