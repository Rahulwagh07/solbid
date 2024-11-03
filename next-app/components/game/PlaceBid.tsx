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
import { Loader } from "lucide-react";
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
  const [validationError, setValidationError] = useState<string | null>(null);
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
        title: "Wallet Connection Required",
        description: "Please connect your wallet first",
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
          Number(bidCount) + 1
        );
        pdas = {
          playerPda: playerPda.toString(),
          bidPda: bidPda.toString(),
        };
        return { instructions, totalCost };
      });

      if (txId) {
        const game = await getGameData(gameId);
        if (game?.game_ended) {
          const playerData = await getAllPlayersAndBidsForGame(gameId);
          const res = await axios.put("/api/bid", {
            gameId: gameId,
            creatorPublicKey: publicKey.toString(),
            playerPda: pdas.playerPda,
            bidPda: pdas.bidPda,
            playerData: playerData,
            amount: parseFloat(bidAmount),
            bidCount: Number(bidCount) + 1,
            txId: txId,
          });
          if (res.status === 200) {
            toast({
              title: "Game Ended",
              description: "You finished after the winner. No amount has been deducted.",
              variant: "default",
            });
            const gameData: GameData = res.data.gameData;
            sendMessage("place-bid", gameData);
            onPlaceBid(gameData);
            setIsOpen(false);
            router.push(`/game/${gameId}`);
            return;
          }
        } else {
          const res = await axios.post("/api/bid", {
            gameId: gameId,
            amount: parseFloat(bidAmount),
            creatorPublicKey: publicKey.toString(),
            playerPda: pdas.playerPda,
            bidPda: pdas.bidPda,
            bidCount: Number(bidCount) + 1,
            txId: txId,
          });
          if (res.status === 200) {
            const gameData: GameData = res.data.gameData;
            sendMessage("place-bid", gameData);
            onPlaceBid(gameData);
          }
          setIsOpen(false);
          setBidAmount("");
        }
        setValidationError(null);
      }
    } catch (error) {
      resetState();
      toast({
        title: "Bid Failed",
        description:
          "An error occurred while placing your bid. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to place bid:", error);
    } finally {
      resetState();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBidAmount(value);
    if (value) {
      const error = validateBidAmount(parseFloat(value), currBid);
      setValidationError(error);
    } else {
      setValidationError(null);
    }
  };

  const resetState = () => {
    setIsOpen(false);
    setLoading(false);
    setBidAmount("");
    resetStatus();
    setValidationError(null);
  };

  const handleModalClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetState();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        <Button>Place Bid</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-[0.5px] border-slate-600">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="bidAmount" className="text-sm font-medium">
              Bid Amount
            </label>
            <Input
              id="bidAmount"
              type="number"
              step="0.01"
              min="0"
              value={bidAmount}
              onChange={handleInputChange}
              placeholder={`Minimum bid: ${(currBid * 2).toFixed(2)} $`}
              required
              className={
                validationError
                  ? "border-red-500 bg-gray-800"
                  : "bg-gray-800 border-slate-700"
              }
            />
            {validationError && (
              <p className="text-red-500 text-sm">{validationError}</p>
            )}
            <p className="text-sm text-gray-400">
              Current bid: {currBid.toFixed(2)} $
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || validationError !== null}
          >
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {status.state === "idle" ? "Place Bid" : status.message}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
