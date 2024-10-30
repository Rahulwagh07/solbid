"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, RedoDot, Trophy } from "lucide-react";
import { Player, GameData } from "@/types/game";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { LoadingSkeleton } from "@/components/skelton/loading-skelton";
import PlaceBid from "@/components/game/PlaceBid";
import { useSocket } from "@/context/socket-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Game({ params }: { params: { gameId: string } }) {
  const [loading, setLoading] = useState(false);
  const { gameId } = params;
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const { socket, sendMessage } = useSocket();
  const session = useSession();
  const router = useRouter()

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
            (player) => player.id === incomingPlayer.id
          );

          let updatedPlayers = [...prevData.players];

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
            (player) => player.id === data.players.id
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
  }, [gameId, socket]);


  const handlePlacebid = (gameData: GameData) => {
    sendMessage("place-bid", gameData);
  };

  if(session.status === "loading"){
    return <LoadingSkeleton/>
  }
  return (
    <main className="bg-slate-800 lg:p-12 min-h-screen">
      <div className="flex items-center justify-center mx-auto gap-12 xl:w-10/12 px-4 sm:px-6 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="flex justify-center flex-col w-full  mx-auto">
            <Card className="text-slate-200 pb-8 mt-16 bg-slate-800 border-t-slate-700 border-x-slate-700 border-b-0">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-4 lg:flex justify-between items-center px-4 py-8 sm:p-12 text-slate-100">
                  <div>
                    <CardTitle className="flex items-center text-sm sm:text-lg ">
                      <Trophy className="mr-2 text-green-500" /> Current Highest
                      Bid
                    </CardTitle>
                    <div className=" ml-8 mt-1  font-semibold text-green-500">
                      ${gameData?.highestBid.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <CardTitle className=" flex items-center text-sm sm:text-lg">
                      <DollarSign className="mr-2 text-green-500" /> Total Prize
                      Pool
                    </CardTitle>
                    <div className=" ml-8 mt-1 font-semibold text-green-500">
                      ${gameData?.prizePool.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="flex items-center text-sm sm:text-lg">
                      <Clock className="mr-2 text-green-500" /> Last Bid
                    </CardTitle>
                    <div className="ml-8 mt-1  font-semibold text-green-500">
                      {gameData?.lastBidTime
                        ? new Date(gameData.lastBidTime).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                  <PlaceBid
                    gameId={parseInt(gameData?.gameId ?? "0")}
                    bidCount={gameData?.totalBids ?? 0}
                    currBid={gameData?.highestBid ?? 1}
                    onPlaceBid={handlePlacebid}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-700/20  text-slate-200 border-t-[0.5px] border-slate-700 rounded-xl -mt-12">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-100 text-lg">
                  Live Bids <RedoDot className="ml-2 text-blue-700" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 pb-2 border-b text-sm border-slate-700 text-slate-300">
                    <div className="center">User</div>
                    <div>Time</div>
                    <div>Bet Amount</div>
                  </div>

                  {[...players].reverse().map((player) => {
                    const isCurrentUser =
                      session?.data?.user.id === player.user.id.toString();
                    return (
                      <div
                        key={player.id}
                        className={`grid grid-cols-3 text-slate-300 gap-4 py-1 mb-1 border-b-[0.5px] border-slate-600 items-center`}
                      >
                        <div className="flex flex-col sm:flex-row sm:space-x-2 sm:items-center text-sm sm:text-left sm:mt-0 space-y-1 sm:space-y-0">
                          <Avatar
                            className={`w-8 h-8 border-2 flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-2 text-sm sm:text-left sm:mt-0 ${
                              isCurrentUser
                                ? "border-blue-500"
                                : "border-slate-600"
                            }`}
                          >
                            <AvatarImage
                              src={player?.user?.imageUrl || undefined}
                            />
                            <AvatarFallback>
                              {player?.user?.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col sm:space-x-2">
                            <p
                              className={`font-medium flex flex-col sm:flex-row sm:items-center`}
                            >
                              {player.user.name}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-blue-400">
                                  (You)
                                </span>
                              )}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {player.bidCount === 1 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-600 text-slate-100 text-xs"
                                >
                                  Creator
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className="flex flex-col sm:flex-row sm:space-x-2 text-sm sm:text-left mt-2 sm:mt-0 space-y-1 sm:space-y-0"
                        >
                          {player.bid
                            ? new Date(player.bid.timestamp).toLocaleString()
                            : "N/A"}
                        </div>
                        <div
                          className={`text-sm`}
                        >
                          {player.bid
                            ? `$${player.bid.amount.toFixed(2)}`
                            : "N/A"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Game;
