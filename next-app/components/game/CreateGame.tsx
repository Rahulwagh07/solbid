"use client";

import { useState } from "react";
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
import { Loader, Plus } from "lucide-react";

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
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const bidAmount = parseFloat(initialBidAmount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid bid amount.",
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
          gameId,
          initialBidAmount: bidAmount,
          creatorPublicKey: publicKey.toString(),
          ...pdas,
          txId,
        };
        const res = await axios.post("/api/game", gameData);
        if (res.status === 200) {
          const created: GameData = res.data.gameData;
          sendMessage("create-game", created);
          onCreateGame(created);
        }
        setIsOpen(false);
      }
    } catch (err) {
      resetState();
      console.error("Failed to create game:", err);
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        setIsOpen(o);
        if (!o) resetState();
      }}
    >
      <DialogTrigger asChild>
        <button
          id="create-game-btn"
          className="btn-press inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-6 font-semibold text-white shadow-accent hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          New Game
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] surface p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="font-display text-xl font-bold text-text">
            Create New Game
          </DialogTitle>
          <p className="mt-1 text-xs text-muted font-mono">
            Set the initial bid. Each subsequent bid must double the current
            highest.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="initialBidAmount" className="label-caps">
              Initial Bid Amount (USDC)
            </label>
            <Input
              id="initialBidAmount"
              type="number"
              step="0.01"
              min={2}
              value={initialBidAmount}
              onChange={(e) => setInitialBidAmount(e.target.value)}
              placeholder="e.g. 5.00"
              required
              className="w-full h-11 px-3 text-sm font-mono text-text bg-white border border-border rounded-xl placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-highlight transition-colors"
            />
            <p className="text-[11px] font-mono text-muted">
              Minimum: $2.00 USDC
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-press w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-6 font-semibold text-white shadow-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader className="h-4 w-4 animate-spin" />}
            {status.state === "idle" ? "Create Game" : status.message}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
