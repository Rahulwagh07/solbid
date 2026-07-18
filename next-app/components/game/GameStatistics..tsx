import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Award,
  Clock,
  CircleDollarSign,
  Users,
  DollarSign,
} from "lucide-react";
import { GameData } from "@/types/game";

export function GameStatistics({ gameData }: { gameData: GameData }) {
  const winner = gameData.players.find((p) => p.role === "WINNER");
  const finisher =
    gameData.totalBids > 5
      ? gameData.players.find((p) => p.bidCount === 1)
      : gameData.players.find((p) => p.role === "FINISHER");

  return (
    <div className="space-y-3">
      {/* Winner / Finisher row */}
      <div className="bg-surface-2/30 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5 bg-white/5">
          {/* Winner */}
          <div className="p-8 bg-surface/50">
            <div className="mb-6 flex items-center gap-3 font-display font-black text-text text-lg">
              <Trophy className="h-5 w-5 text-success" /> Winner
            </div>
            {winner && (
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-border">
                  <AvatarImage src={winner.user.imageUrl || undefined} />
                  <AvatarFallback className="bg-surface font-mono text-text">
                    {winner.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-text truncate">
                    {winner.user.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm font-mono text-success">
                    Winning: ${winner.royaltyEarned}
                    <DollarSign className="h-3 w-3" />
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Finisher / Creator */}
          <div className="p-8 bg-surface/50">
            <div className="mb-6 flex items-center gap-3 font-display font-black text-text text-lg">
              <Award className="h-5 w-5 text-success" />
              {gameData.totalBids > 5 ? "Creator" : "Finisher"}
            </div>
            {finisher && (
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-border">
                  <AvatarImage src={finisher.user.imageUrl || undefined} />
                  <AvatarFallback className="bg-surface font-mono text-text">
                    {finisher.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-text truncate">
                    {finisher.user.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm font-mono text-success">
                    Royalty: ${finisher.royaltyEarned}
                    <DollarSign className="h-3 w-3" />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="bg-surface-2/30 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 bg-white/5">
          {/* Duration */}
          <div className="p-8 bg-surface/50">
            <div className="mb-4 flex items-center gap-3 font-display font-bold text-text text-sm uppercase tracking-widest text-muted">
              <Clock className="h-4 w-4 text-success" /> Duration
            </div>
            <p className="font-mono text-lg font-bold text-text truncate">
              {Math.floor(
                (new Date(gameData.lastBidTime).getTime() -
                  new Date(gameData.createdAt).getTime()) /
                  60000,
              )}{" "}
              min
            </p>
            <p className="mt-1 text-sm font-mono text-muted truncate">
              Start: {new Date(gameData.createdAt).toLocaleString()}
            </p>
            <p className="text-sm font-mono text-muted truncate">
              End: {new Date(gameData.lastBidTime).toLocaleString()}
            </p>
          </div>

          {/* Prize Pool */}
          <div className="p-8 bg-surface/50">
            <div className="mb-4 flex items-center gap-3 font-display font-bold text-text text-sm uppercase tracking-widest text-muted">
              <CircleDollarSign className="h-4 w-4 text-success" /> Prize Pool
            </div>
            <p className="font-mono text-lg font-bold text-text flex items-center gap-0.5 truncate">
              ${gameData.prizePool}
            </p>
            <p className="mt-1 text-sm font-mono text-muted truncate">
              Initial: ${gameData.initialBidAmount}
            </p>
            <p className="text-sm font-mono text-muted truncate">
              Highest: ${gameData.highestBid}
            </p>
          </div>

          {/* Game Stats */}
          <div className="p-8 bg-surface/50">
            <div className="mb-4 flex items-center gap-3 font-display font-bold text-text text-sm uppercase tracking-widest text-muted">
              <Users className="h-4 w-4 text-success" /> Stats
            </div>
            <p className="font-mono text-lg font-bold text-text truncate">
              {gameData.totalBids} Bids
            </p>
            <p className="mt-1 text-sm font-mono text-muted truncate">
              Players: {gameData.players.length}
            </p>
            <p className="text-sm font-mono text-muted truncate">
              Platform Fee: {gameData.platformFeePercent}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
