"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export function InteractiveSimulation() {
  const [bids, setBids] = useState(4);
  const [currentBid, setCurrentBid] = useState(16);
  const [prizePool, setPrizePool] = useState(30);
  const [timer, setTimer] = useState(10);
  const [royalty, setRoyalty] = useState(0);

  useEffect(() => {
    // Timer countdown
    const timerInterval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 10)); // Reset at 0 for demo purposes
    }, 1000);

    // Simulate new bids
    const bidInterval = setInterval(() => {
      setBids((b) => b + 1);
      setCurrentBid((c) => c * 2);
      setPrizePool((p) => p * 2 + p * 0.1);
      setRoyalty((r) => r + currentBid * 0.05);
      setTimer(10); // Reset timer on new bid
    }, 4500);

    return () => {
      clearInterval(timerInterval);
      clearInterval(bidInterval);
    };
  }, [currentBid]);

  return (
    <section className="relative z-10 py-32 bg-background border-b border-border overflow-hidden">
      {/* Decorative blurred backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-highlight/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-success animate-live-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-text">
              Live Simulation
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-text">
            Watch the stakes multiply.
          </h2>
          <p className="mt-6 text-xl text-muted max-w-2xl mx-auto">
            Experience the exponential tension. Every bid resets the clock and
            doubles the required entry.
          </p>
        </div>

        {/* The Dashboard */}
        <div className="surface border border-border rounded-[2rem] p-8 sm:p-12 shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
          {/* Glass glare effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
            <div className="text-center">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">
                Total Bids
              </p>
              <motion.p
                key={bids}
                initial={{ scale: 1.5, color: "#4e88bd" }}
                animate={{ scale: 1, color: "var(--color-text)" }}
                className="font-mono text-3xl sm:text-5xl font-black"
              >
                {bids}
              </motion.p>
            </div>
            <div className="text-center border-y md:border-y-0 md:border-x border-border/50 py-8 md:py-0">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">
                Time Remaining
              </p>
              <p
                className={`font-mono text-4xl sm:text-6xl font-black ${timer <= 3 ? "text-error animate-pulse" : "text-text"}`}
              >
                00:0{timer}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">
                Prize Pool
              </p>
              <motion.p
                key={prizePool}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display text-3xl sm:text-5xl font-black text-success truncate"
              >
                ${prizePool.toFixed(0)}
              </motion.p>
            </div>
          </div>

          <div className="bg-black text-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border border-black shadow-xl">
            <div>
              <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-1">
                Your Royalty Earned
              </p>
              <motion.p
                key={royalty}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="font-mono text-xl sm:text-3xl font-black text-highlight drop-shadow-[0_0_15px_rgba(204,255,0,0.4)]"
              >
                +${royalty.toFixed(2)}
              </motion.p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-1">
                Required to Outbid
              </p>
              <p className="font-mono text-xl sm:text-3xl font-black text-white">
                ${(currentBid * 2).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
