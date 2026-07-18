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
import { placeBid } from "@/solana/bid";
import axios from "axios";
import { useSocket } from "@/context/socket-context";
import { GameData } from "@/types/game";
import { useWallet } from "@solana/wallet-adapter-react";
import { CONNECTION } from "@/lib/constant";
import { getAllPlayersAndBidsForGame, getGameData } from "@/solana/game";
import { useToast } from "@/hooks/use-toast";
import { useTransaction } from "@/hooks/use-tranaction";
import { validateBidAmount } from "@/lib/helper";
import { Loader, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlaceBidModalProps {
  gameId: number;
  bidCount: number;
  currBid: number;
  onPlaceBid: (gameData: GameData) => void;
}

export default function PlaceBid({
  gameId,
  bidCount,
  currBid,
  onPlaceBid,
}: PlaceBidModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [validationError, setVError] = useState<string | null>(null);
  const { publicKey } = useWallet();
  const { sendMessage } = useSocket();
  const { toast } = useToast();
  const { status, execute, resetStatus } = useTransaction(CONNECTION);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    try {
      let pdas = { playerPda: "", bidPda: "" };
      const txId = await execute(async () => {
        const { instructions, totalCost, playerPda, bidPda } = await placeBid(
          publicKey,
          gameId,
          parseFloat(bidAmount),
          Number(bidCount) + 1,
        );
        pdas = { playerPda: playerPda.toString(), bidPda: bidPda.toString() };
        return { instructions, totalCost };
      });

      if (txId) {
        const game = await getGameData(gameId);
        if (game?.game_ended) {
          const playerData = await getAllPlayersAndBidsForGame(gameId);
          const res = await axios.put("/api/bid", {
            gameId,
            creatorPublicKey: publicKey.toString(),
            ...pdas,
            playerData,
            amount: parseFloat(bidAmount),
            bidCount: Number(bidCount) + 1,
            txId,
          });
          if (res.status === 200) {
            toast({
              title: "Game Ended",
              description: "You finished after the winner. No amount deducted.",
            });
            sendMessage("place-bid", res.data.gameData);
            onPlaceBid(res.data.gameData);
            setIsOpen(false);
            router.push(`/game/${gameId}`);
            return;
          }
        } else {
          const res = await axios.post("/api/bid", {
            gameId,
            amount: parseFloat(bidAmount),
            creatorPublicKey: publicKey.toString(),
            ...pdas,
            bidCount: Number(bidCount) + 1,
            txId,
          });
          if (res.status === 200) {
            sendMessage("place-bid", res.data.gameData);
            onPlaceBid(res.data.gameData);
          }
          setIsOpen(false);
          setBidAmount("");
        }
        setVError(null);
      }
    } catch (err) {
      resetState();
      toast({
        title: "Bid Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to place bid:", err);
    } finally {
      resetState();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setBidAmount(v);
    setVError(v ? validateBidAmount(parseFloat(v), currBid) : null);
  };

  const resetState = () => {
    setIsOpen(false);
    setLoading(false);
    setBidAmount("");
    resetStatus();
    setVError(null);
  };

  const minBid = (currBid * 2).toFixed(2);

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
          id="place-bid-btn"
          className="btn-press inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-6 font-semibold text-white hover:bg-neutral-800 whitespace-nowrap shrink-0"
        >
          <Zap className="h-4 w-4" />
          Place Bid
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] w-[90vw] max-w-[90vw] md:max-w-[400px] surface p-6 focus:outline-none focus-visible:ring-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="font-display font-bold text-text text-xl">
            Place a Bid
          </DialogTitle>
          <p className="mt-1 text-sm font-mono text-muted">
            Your bid must be at least double the current highest bid.
          </p>
        </DialogHeader>

        <div className="mb-5 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 rounded-xl border border-border bg-surface-2 px-3 py-2.5 bg-surface border-border shadow-sm">
            <p className="label-caps text-muted font-mono text-sm">
              Current Bid
            </p>
            <p className="mt-0.5 font-mono text-base font-semibold text-text">
              ${currBid.toFixed(2)}
            </p>
          </div>
          <div className="flex-1 rounded-xl border border-border bg-surface-2 px-3 py-2.5 bg-surface border-border shadow-sm">
            <p className="label-caps text-muted font-mono text-sm">
              Min. Required
            </p>
            <p className="mt-0.5 font-mono text-base font-semibold text-success">
              ${minBid}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="bidAmount"
              className="label-caps text-sm text-text font-bold font-display"
            >
              Your Bid Amount ($)
            </label>
            <Input
              id="bidAmount"
              type="number"
              step="0.01"
              min="0"
              value={bidAmount}
              onChange={handleInput}
              placeholder={`Minimum $${minBid}`}
              required
              className={`w-full h-11 px-3 text-sm font-mono text-text bg-white border border-border rounded-xl placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-highlight transition-colors ${
                validationError ? "border-error focus-visible:ring-error" : ""
              }`}
            />
            {validationError && (
              <p className="text-xs font-mono text-error">{validationError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || validationError !== null}
            className="btn-press w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-6 font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader className="h-4 w-4 animate-spin" />}
            {status.state === "idle" ? "Confirm Bid" : status.message}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
