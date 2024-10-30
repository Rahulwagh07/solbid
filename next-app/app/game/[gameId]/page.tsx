"use client";
import { BidHistory } from "@/components/game/BidHistory";
import { GameStatistics } from "@/components/game/GameStatistics.";
import { LoadingSkeleton } from "@/components/skelton/loading-skelton";
import { GameData } from "@/types/game";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page({ params }: { params: { gameId: string } }) {
  const { gameId } = params;
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameId || status !== "authenticated") {
        return;
      }
      try {
        const response = await axios.get(`/api/game`, {
          params: { id: gameId },
        });
        setGameData(response?.data?.game?.gameData);
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId, status, router]);

  return (
    <div className="bg-slate-800 lg:p-12 min-h-screen flex justify-center">
      <div className="w-full xl:w-10/12 mt-16 px-4 py-8 ">
        {loading || !gameData ? (
          <LoadingSkeleton />
        ) : (
          <>
            <GameStatistics gameData={gameData} />
            <BidHistory players={gameData?.players} />
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
