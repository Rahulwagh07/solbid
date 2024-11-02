import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentTransaction } from "@/types/dashboard";
import { ArrowUpRight, ExternalLink, PlusCircle } from "lucide-react";
import Link from "next/link";
import DataNotFoundCard from "./DataNotFoundCard";
import { ArrowRightLeft } from "lucide-react";

export default function Transactions({
  transactions,
}: {
  transactions: RecentTransaction[];
}) {
  return (
    <>
      <h2 className="text-lg sm:text-3xl font-bold mb-6">
        Transactions You've Made
      </h2>
      {transactions.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-8rem)]  sm:h-[calc(100vh-12rem)] pr-4 pb-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col gap-4 sm:gap-0  text-sm sm:flex-row items-start sm:items-center justify-between p-4 mb-4  border border-slate-700/90 bg-slate-700/50 rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    transaction.bidCount === 1 ? "bg-blue-800" : "bg-green-800"
                  }`}
                >
                  {transaction.bidCount === 1 ? (
                    <PlusCircle className="h-4 w-4 text-white" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.bidCount === 1 ? "Game Created" : "Bid Placed"}
                  </p>
                  <p className=" text-slate-400">Game #{transaction.gameId}</p>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="font-medium">Amount: ${transaction.amount}</p>
                <p className="  text-slate-400">
                  {new Date(transaction.timestamp).toLocaleString()}
                </p>
              </div>
              <Link
                href={`https://explorer.solana.com/tx/${transaction.txId}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black py-2 px-4 rounded-md border flex items-center justify-end mt-1"
              >
                View Transaction
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </div>
          ))}
        </ScrollArea>
      ) : (
        <DataNotFoundCard
          icon={ArrowRightLeft}
          title="No Recent Transactions"
          description="You haven't made any transactions yet."
          to=""
          linkText=""
        />
      )}
    </>
  );
}
