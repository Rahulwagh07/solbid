"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createGame } from "@/solana/game";
import { fetchCurrentGameId } from "@/lib/helper";
import axios from "axios";
import { useSocket } from "@/context/socket-context";
import { GameData } from "@/types/game";
import { useWallet } from "@solana/wallet-adapter-react";
import { CONNECTION } from "@/lib/constant";
import { useToast } from "@/hooks/use-toast";
import { useTransaction } from "@/hooks/use-tranaction";
import { Loader } from "lucide-react";

interface CreateGameProps {
  onCreateGame: (gameData: GameData) => void;
}

export default function CreateGame({ onCreateGame }: CreateGameProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialBidAmount, setInitialBidAmount] = useState("");
  const { sendMessage } = useSocket();
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const { status, execute, resetStatus } = useTransaction(CONNECTION);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!publicKey) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    const bidAmount = parseFloat(initialBidAmount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      toast({
        title: "Invalid Bid Amount",
        description: "Please enter a valid bid amount",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const gameId: number = await fetchCurrentGameId();
      let pdas = { gamePda: "", playerPda: "", bidPda: "" };
      const txId = await execute(async () => {
        const { instructions, totalCost, gamePda, playerPda, bidPda } =
          await createGame(publicKey, gameId, bidAmount);

        pdas = {
          gamePda: gamePda.toString(),
          playerPda: playerPda.toString(),
          bidPda: bidPda.toString(),
        };
        return { instructions, totalCost };
      });

      if (txId) {
        const gameData = {
          gameId: gameId,
          initialBidAmount: bidAmount,
          creatorPublicKey: publicKey.toString(),
          gamePda: pdas.gamePda,
          playerPda: pdas.playerPda,
          bidPda: pdas.bidPda,
          txId: txId,
        };

        const res = await axios.post("/api/game", gameData);
        const createdGameData: GameData = res.data.gameData;

        if (res.status === 200) {
          sendMessage("create-game", createdGameData);
          onCreateGame(createdGameData);
        }
        setIsOpen(false);
      }
    } catch (error) {
      resetState();
      console.error("Failed to create game:", error);
    } finally {
      resetState();
    }
  };

  const resetState = () => {
    setIsOpen(false);
    setLoading(false);
    setInitialBidAmount("");
    resetStatus();
  };

  const handleModalClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetState();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        <Button>Create Game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-[0.5px] border-slate-600">
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="initialBidAmount" className="text-sm font-medium">
              Initial Bid Amount (USDC)
            </label>
            <Input
              className="bg-gray-800 border-slate-700"
              id="initialBidAmount"
              type="number"
              step="0.01"
              value={initialBidAmount}
              onChange={(e) => setInitialBidAmount(e.target.value)}
              placeholder="Enter initial bid amount"
              required
              min={2}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {status.state === "idle" ? "Create Game" : status.message}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
