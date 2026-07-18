"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Player, GameData } from "@/types/game";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomLoader from "@/components/common/Loader";
import PlaceBid from "@/components/game/PlaceBid";
import { useSocket } from "@/context/socket-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

function Game({ params }: { params: { gameId: string } }) {
  const [loading, setLoading] = useState(false);
  const { gameId } = params;
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const { socket, sendMessage } = useSocket();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session.status, router]);

  const fetchGame = async () => {
    setLoading(true);
    if (!gameId || session.status !== "authenticated") {
      return;
    }

    try {
      const res = await axios.get("/api/game", { params: { id: gameId } });
      setGameData(res.data.game.gameData);
      setPlayers(res.data.game.gameData.players);
    } catch (error) {
      console.log("Error in fetching game", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const { type, data } = JSON.parse(event.data);

      if (type === "game-update" && data.gameId === gameId) {
        setGameData((prevData: GameData | null) => {
          if (!prevData) return null;

          const incomingPlayer: Player = data.players;
          const existingPlayerIndex = prevData.players.findIndex(
            (player) => player.id === incomingPlayer.id,
          );

          const updatedPlayers = [...prevData.players];

          if (existingPlayerIndex !== -1) {
            updatedPlayers[existingPlayerIndex] = {
              ...updatedPlayers[existingPlayerIndex],
              ...incomingPlayer,
            };
          } else {
            updatedPlayers.push(incomingPlayer);
          }

          return {
            ...prevData,
            highestBid: data.highestBid,
            lastBidTime: data.lastBidTime,
            totalBids: data.totalBids,
            prizePool: data.prizePool,
            gameEnded: data.gameEnded,
            players: updatedPlayers,
          };
        });

        setPlayers((prevPlayers) => {
          const existingPlayerIndex = prevPlayers.findIndex(
            (player) => player.id === data.players.id,
          );

          if (existingPlayerIndex !== -1) {
            const updatedPlayers = [...prevPlayers];
            updatedPlayers[existingPlayerIndex] = {
              ...updatedPlayers[existingPlayerIndex],
              ...data.players,
            };
            return updatedPlayers;
          } else {
            return [...prevPlayers, data.players];
          }
        });
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  };

  useEffect(() => {
    fetchGame();

    if (socket) {
      socket.addEventListener("message", handleWebSocketMessage);
    }

    return () => {
      if (socket) {
        socket.removeEventListener("message", handleWebSocketMessage);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, socket]);

  const handlePlacebid = (gameData: GameData) => {
    sendMessage("place-bid", gameData);
  };

  if (session.status === "loading") {
    return <CustomLoader />;
  }

  return (
    <main className="bg-background pt-24 lg:p-12 min-h-screen flex justify-center">
      <div className="flex flex-col items-center mx-auto gap-12 w-full max-w-7xl px-4 sm:px-6 py-8">
        {loading ? (
          <CustomLoader styles="min-h-[50vh] w-full" />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center flex-col w-full mx-auto"
          >
            {/* Top Stats Panel */}
            <div className="mt-8 bg-surface-2/30 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden mb-8">
              <div className="grid grid-cols-2 gap-px lg:flex lg:divide-x divide-white/5 bg-white/5">
                {/* Highest Bid */}
                <div className="bg-surface/50 flex flex-col gap-2 px-8 py-8 flex-1">
                  <div className="label-caps text-muted">
                    Current Highest Bid
                  </div>
                  <div className="font-mono text-3xl font-semibold text-text">
                    ${gameData?.highestBid}
                  </div>
                </div>

                {/* Prize Pool */}
                <div className="bg-surface/50 flex flex-col gap-2 px-8 py-8 flex-1">
                  <div className="label-caps text-muted">Total Prize Pool</div>
                  <div className="font-mono text-3xl font-semibold text-text">
                    ${gameData?.prizePool}
                  </div>
                </div>

                {/* Last Bid */}
                <div className="bg-surface/50 flex flex-col gap-2 px-8 py-8 flex-1">
                  <div className="label-caps text-muted">Last Bid</div>
                  <div className="font-mono text-base font-semibold text-text mt-1">
                    {gameData?.lastBidTime
                      ? new Date(gameData.lastBidTime).toLocaleString()
                      : "N/A"}
                  </div>
                </div>

                {/* Place Bid */}
                <div className="bg-surface/50 px-8 py-8 flex items-center justify-center flex-1">
                  <PlaceBid
                    gameId={parseInt(gameData?.gameId ?? "0")}
                    bidCount={gameData?.totalBids ?? 0}
                    currBid={gameData?.highestBid ?? 1}
                    onPlaceBid={handlePlacebid}
                  />
                </div>
              </div>
            </div>

            {/* Live Bids Table */}
            <div className="bg-surface-2/30 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl relative z-10 overflow-hidden mb-12">
              <div className="flex items-center gap-3 px-8 py-6 border-b border-white/5 bg-surface-2/50">
                <span className="font-display font-black tracking-tighter text-text text-2xl">
                  Live Bids
                </span>
              </div>

              {/* Content */}
              <div className="divide-y divide-white/5">
                {/* Column Headers */}
                <div className="hidden sm:grid grid-cols-3 gap-6 px-8 py-4 border-b border-white/5 label-caps text-xs">
                  <div>User</div>
                  <div>Time</div>
                  <div>Bet Amount</div>
                </div>

                {/* Player Rows */}
                {[...players].reverse().map((player, _index) => {
                  const isCurrentUser =
                    session?.data?.user?.id === player.user.id.toString();
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-3 gap-6 px-8 py-6 items-center hover:bg-surface-2/60 transition-colors"
                    >
                      {/* User Cell */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <Avatar
                          className={`w-9 h-9 border-2 rounded-full flex items-center justify-center ${
                            isCurrentUser ? "border-highlight" : "border-border"
                          }`}
                        >
                          <AvatarImage
                            src={player?.user?.imageUrl || undefined}
                          />
                          <AvatarFallback className="bg-black text-white font-bold">
                            {player?.user?.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-center">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold font-display text-base leading-none">
                              {player.user.name}
                            </p>
                            {isCurrentUser && (
                              <span className="text-[10px] font-mono font-bold text-highlight bg-black px-1.5 py-0.5 rounded-md leading-none">
                                You
                              </span>
                            )}
                            {player.bidCount === 1 && (
                              <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-md leading-none">
                                Creator
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Time Cell */}
                      <div className="font-mono text-xs text-muted">
                        {player.bid
                          ? new Date(player.bid.timestamp).toLocaleString()
                          : "N/A"}
                      </div>

                      {/* Bid Amount Cell */}
                      <div className="font-mono text-sm font-bold text-success">
                        {player.bid
                          ? `$${player.bid.amount.toFixed(2)}`
                          : "N/A"}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default Game;
