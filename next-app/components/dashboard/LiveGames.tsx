import { LiveGame } from "@/types/dashboard";
import Link from "next/link";
import DataNotFoundCard from "./DataNotFoundCard";
import { Users } from "lucide-react";

export default function LiveGames({ games }: { games: LiveGame[] }) {
  return (
    <>
      <h2 className="font-display font-bold text-text text-xl sm:text-2xl mb-6">
        Live Games You&apos;re In
      </h2>
      {games.length > 0 ? (
        <div className="pb-3">
          {games.map((game) => (
            <div
              key={game.gameId}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface-2/30 backdrop-blur-md rounded-2xl p-5 mb-4 hover:bg-surface-2/60 transition-colors duration-300 group"
            >
              <div className="flex flex-col gap-2 w-full sm:w-auto overflow-hidden">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <p className="font-display text-2xl font-black tracking-tighter text-text truncate">
                    Game #{game.gameId}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-muted">
                    Total Bids:{" "}
                    <span className="text-text">{game.totalBids}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:text-right mt-6 sm:mt-0 w-full sm:w-auto">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-muted mb-1">
                  Prize Pool
                </p>
                <p className="font-display text-3xl font-black text-text">
                  <span className="opacity-50 mr-0.5">$</span>
                  {game.prizePool}
                </p>
                <div className="flex flex-col sm:items-end gap-1 mt-2">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">
                    Highest Bid:{" "}
                    <span className="text-text">${game.highestBid}</span>
                  </p>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">
                    Your Bids: {game.userBidCount} (
                    <span className="text-text">${game.userBidAmount}</span>)
                  </p>
                </div>
              </div>
              <div className="mt-6 sm:mt-0 w-full sm:w-auto sm:ml-8">
                <Link
                  href={`/live/${game.gameId}`}
                  className="inline-flex w-full sm:w-12 sm:h-12 h-10 items-center justify-center rounded-full bg-black text-white hover:scale-105 active:scale-95 transition-transform"
                >
                  <span className="sm:hidden font-bold text-xs uppercase tracking-widest mr-2">
                    View Game
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataNotFoundCard
          icon={Users}
          title="No Live Games You Participated In"
          description="Currently, you are not part of any live games."
          to="/home"
          linkText="Explore new games!"
        />
      )}
    </>
  );
}
