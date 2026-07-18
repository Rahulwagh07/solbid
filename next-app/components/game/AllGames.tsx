"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { useSocket } from "@/context/socket-context";
import CreateGame from "./CreateGame";
import jwt from "jsonwebtoken";
import { GameData } from "@/types/game";
import { Trophy } from "lucide-react";
import CustomLoader from "../common/Loader";
import { motion } from "motion/react";
import { KineticGameCard } from "./KineticGameCard";

interface Game {
  id: number;
  gameId: string;
  initialBidAmount: number;
  highestBid: number;
  lastBidTime: string;
  totalBids: number;
  prizePool: number;
  gameEnded: boolean;
}

export default function AllGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { socket, sendMessage, user, setUser } = useSocket();

  const addOrUpdateGame = useCallback((newGame: Game) => {
    setGames((prev) => {
      const idx = prev.findIndex((g) => g.gameId === newGame.gameId);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...newGame };
        return updated.sort(
          (a, b) =>
            new Date(b.lastBidTime).getTime() -
            new Date(a.lastBidTime).getTime(),
        );
      }
      return [newGame, ...prev].sort(
        (a, b) =>
          new Date(b.lastBidTime).getTime() - new Date(a.lastBidTime).getTime(),
      );
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchGames();
      if (!user.token) {
        const token = jwt.sign(
          { userId: user?.id },
          process.env.NEXT_PUBLIC_SECRET || "",
          { expiresIn: "48h" },
        );
        setUser({ ...user, token });
      }
    }

    const handleWS = (e: MessageEvent) => {
      try {
        const { type, data } = JSON.parse(e.data);
        if (type === "new-game" || type === "game-update")
          addOrUpdateGame(data);
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    if (socket) socket.addEventListener("message", handleWS);
    return () => {
      if (socket) socket.removeEventListener("message", handleWS);
    };
  }, [socket, addOrUpdateGame, user, setUser]);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/game");
      setGames(
        res.data.games.sort(
          (a: Game, b: Game) =>
            new Date(b.lastBidTime).getTime() -
            new Date(a.lastBidTime).getTime(),
        ),
      );
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGame = (gameData: GameData) =>
    sendMessage("create-game", gameData);

  if (isLoading) return <CustomLoader styles="min-h-[60vh] w-full" />;

  const activeGames = games.filter((g) => !g.gameEnded);
  const endedGames = games.filter((g) => g.gameEnded);

  return (
    <div className="w-full py-6 relative">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="font-display font-bold text-text text-xl">
            Active Games
          </h1>
          <p className="mt-1 text-sm font-mono text-muted">
            {activeGames.length} live · {endedGames.length} ended
          </p>
        </div>
        <CreateGame onCreateGame={handleCreateGame} />
      </div>

      {games.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Active", value: activeGames.length },
            {
              label: "Total Prize",
              value: `$${games.reduce((s, g) => s + g.prizePool, 0).toFixed(0)}`,
            },
            {
              label: "Total Bids",
              value: games.reduce((s, g) => s + g.totalBids, 0),
            },
            {
              label: "Highest Bid",
              value: `$${Math.max(...games.map((g) => g.highestBid)).toFixed(2)}`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface border border-border shadow-sm rounded-xl px-4 py-3 min-w-0"
            >
              <div className="font-mono text-lg font-bold truncate text-text">
                {stat.value}
              </div>
              <div className="text-[11px] font-mono text-muted truncate uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-surface border border-border shadow-sm">
            <Trophy className="h-6 w-6 text-muted" />
          </div>
          <p className="font-mono text-sm text-muted">No games yet.</p>
          <p className="mt-1 text-xs text-muted font-mono">
            Create the first one above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <KineticGameCard game={game} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
