import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RedoDot, Trophy, Star, Zap } from "lucide-react";
import { Player } from "@/types/game";

export function BidHistory({ players }: { players: Player[] }) {
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.role === "WINNER") return -1;
    if (b.role === "WINNER") return 1;
    return a.bidCount - b.bidCount;
  });

  return (
    <div className="bg-surface-2/30 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden w-full mb-12">
      {/* Header */}
      <div className="flex items-center gap-3 px-8 py-6 border-b border-white/5 bg-surface-2/50">
        <RedoDot className="h-5 w-5 text-success" />
        <h3 className="font-display font-black tracking-tighter text-text text-2xl">
          Bid History
        </h3>
        <span className="ml-auto text-sm font-mono text-muted uppercase tracking-widest font-bold">
          {players.length} participants
        </span>
      </div>

      {/* Column headers */}
      <div className="hidden sm:grid grid-cols-4 gap-6 px-8 py-4 border-b border-white/5 font-display font-bold text-muted text-xs uppercase tracking-wider">
        <div>User</div>
        <div>Time</div>
        <div>Bet Amount</div>
        <div>Royalty Earned</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 px-8 py-6 items-center hover:bg-surface-2/60 transition-colors w-full"
          >
            {/* User */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
              <Avatar className="w-10 h-10 ring-2 ring-white/10 shrink-0">
                <AvatarImage src={player.user.imageUrl || undefined} />
                <AvatarFallback className="bg-surface/50 font-mono text-sm text-text">
                  {player.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-text text-sm truncate">
                  {player.user.name}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {player.role === "WINNER" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 border border-success/20 px-1.5 py-0.5 text-[10px] font-mono font-medium text-success">
                      <Trophy className="h-2.5 w-2.5" /> Winner
                    </span>
                  )}
                  {player.bidCount === 1 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/5 border border-border px-1.5 py-0.5 text-[10px] font-mono font-medium text-text">
                      <Star className="h-2.5 w-2.5" /> Creator
                    </span>
                  )}
                  {index === sortedPlayers.length - 1 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/5 border border-border px-1.5 py-0.5 text-[10px] font-mono font-medium text-text">
                      <Zap className="h-2.5 w-2.5" /> Finisher
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="text-sm font-mono text-muted truncate">
              {player.bid
                ? new Date(player.bid.timestamp).toLocaleString()
                : "N/A"}
            </div>

            {/* Bid Amount */}
            <div className="font-mono text-sm font-semibold text-text truncate">
              {player.bid ? `$${player.bid.amount.toFixed(2)}` : "N/A"}
            </div>

            {/* Royalty */}
            <div className="font-mono text-sm font-semibold text-success truncate">
              ${player.royaltyEarned.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
