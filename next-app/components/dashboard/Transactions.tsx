import { RecentTransaction } from "@/types/dashboard";
import { ExternalLink, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import DataNotFoundCard from "./DataNotFoundCard";

export default function Transactions({
  transactions,
}: {
  transactions: RecentTransaction[];
}) {
  return (
    <>
      <div className="mb-8">
        <h2 className="font-display font-bold text-text text-xl sm:text-2xl">
          Transactions
        </h2>
        <p className="mt-1 text-sm font-mono text-muted">
          Your recent on-chain activity
        </p>
      </div>

      {transactions.length > 0 ? (
        <div className="pb-3">
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface-2/30 backdrop-blur-md rounded-2xl p-5 mb-4 hover:bg-surface-2/60 transition-colors duration-300 group"
              >
                {/* Icon + label */}
                <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-display font-black text-xl text-text truncate">
                        {tx.bidCount === 1 ? "Game Created" : "Bid Placed"}
                      </p>
                      <span className="bg-black text-white px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-md shrink-0">
                        {tx.bidCount === 1 ? "Creator" : "Active"}
                      </span>
                    </div>
                    <p className="text-xs font-mono font-bold uppercase tracking-widest text-muted truncate mt-1">
                      Game #{tx.gameId}
                    </p>
                  </div>
                </div>

                {/* Amount + date */}
                <div className="flex flex-col sm:text-right mt-6 sm:mt-0 w-full sm:w-auto">
                  <p className="font-display font-black text-3xl text-text flex items-center sm:justify-end">
                    <span className="opacity-50 mr-0.5 text-xl">$</span>
                    {tx.amount}
                  </p>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted mt-1">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Explorer link */}
                <div className="mt-6 sm:mt-0 w-full sm:w-auto sm:ml-8">
                  <Link
                    href={`https://explorer.solana.com/tx/${tx.txId}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-12 sm:h-12 h-10 items-center justify-center rounded-full bg-black text-white hover:scale-105 active:scale-95 transition-transform"
                    title="View on Explorer"
                  >
                    <span className="sm:hidden font-bold text-xs uppercase tracking-widest mr-2">
                      View Explorer
                    </span>
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
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
