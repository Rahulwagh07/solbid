import { ScrollArea } from "@/components/ui/scroll-area";
import { PastGame } from "@/types/dashboard";
import Link from "next/link";
import DataNotFoundCard from "./DataNotFoundCard";
import { HistoryIcon } from "lucide-react";

export default function PastGames({ games }: { games: PastGame[] }) {
  return (
    <>
      <h2 className="text-lg sm:text-3xl font-bold mb-6">
        Games You Were In (Ended)
      </h2>
      {games.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-8rem)]  sm:h-[calc(100vh-12rem)] pr-4 pb-3">
          {games.map((game) => (
            <div
              key={game.gameId}
              className="flex flex-col gap-4 sm:gap-0  text-sm sm:flex-row items-start sm:items-center justify-between p-4 mb-4  border border-slate-700/90 bg-slate-700/50 rounded-lg shadow"
            >
              <div>
                <p className="font-medium">Game #{game.gameId}</p>
                <p className="text-sm text-slate-400">
                  Ended: {new Date(game.endTime).toLocaleString()}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="font-medium">Total Bid: ${game.totalAmount}</p>
                <p className="text-sm text-slate-400">
                  Royalty Earned: ${game.totalRoyalty}
                </p>
              </div>
              <Link
                href={`/game/${game.gameId}`}
                className="bg-white text-black py-1.5 px-4 rounded-md border"
              >
                View
              </Link>
            </div>
          ))}
        </ScrollArea>
      ) : (
        <DataNotFoundCard
          icon={HistoryIcon}
          title="No Past Games Found"
          description="You haven't played any games yet."
          to="/home"
          linkText="Join a new game!"
        />
      )}
    </>
  );
}
