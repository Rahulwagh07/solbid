"use client";

import React from "react";
import { motion } from "motion/react";
import { Clock, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface KineticGameCardProps {
  game: {
    id: number;
    gameId: string;
    initialBidAmount: number;
    highestBid: number;
    lastBidTime: string;
    totalBids: number;
    prizePool: number;
    gameEnded: boolean;
  };
}

export function KineticGameCard({ game }: KineticGameCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(game.gameEnded ? `/game/${game.id}` : `/live/${game.id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface-2/30 backdrop-blur-xl p-6 cursor-pointer shadow-sm hover:shadow-xl hover:border-text/20 transition-all duration-300 min-h-[320px]"
    >
      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${game.gameEnded ? "bg-muted" : "bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"}`}
          />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
            {game.gameEnded ? "Ended" : "Live"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 backdrop-blur-md">
          <Clock className="h-3 w-3 text-text" />
          <span className="font-mono text-[10px] font-bold tracking-wider text-text uppercase">
            {formatDistanceToNow(new Date(game.lastBidTime))} ago
          </span>
        </div>
      </div>

      {/* Main Content (Massive Typography) */}
      <div className="relative z-10 my-8">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted mb-2">
          Prize Pool
        </p>
        <p className="font-display text-6xl font-black tracking-tighter text-text flex items-center">
          <span className="text-4xl mr-1 opacity-50">$</span>
          {game.prizePool.toFixed(0)}
        </p>
      </div>

      {/* Footer Stats Row */}
      <div className="relative z-10 flex items-center justify-between border-t border-border/40 pt-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted mb-1">
            Current Bid
          </p>
          <p className="font-mono text-xl font-bold text-text">
            ${game.highestBid.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted mb-1">
            Total Bids
          </p>
          <p className="font-mono text-xl font-bold text-text">
            {game.totalBids}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
          <ChevronRight className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
