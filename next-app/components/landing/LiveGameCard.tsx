"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";

const INITIAL_BIDS = [
  { id: 1, user: "7xK2...m9Fd", amount: "$512", time: "2s ago" },
  { id: 2, user: "Bz9A...3nPq", amount: "$480", time: "14s ago" },
  { id: 3, user: "Ry4C...7vLs", amount: "$448", time: "31s ago" },
];

export function LiveGameCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const spring = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, spring);
  const smoothY = useSpring(mouseY, spring);

  const rotateX = useTransform(smoothY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [0, 1], [-12, 12]);

  const shimmerX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const shimmerY = useTransform(smoothY, [0, 1], ["0%", "100%"]);
  const shimmerBg = useMotionTemplate`radial-gradient(260px circle at ${shimmerX} ${shimmerY}, rgba(78,136,189,0.25), transparent)`;

  const [prize, setPrize] = useState(14204);
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [timer, setTimer] = useState(87);
  const [flash, setFlash] = useState(false);
  const bidIdRef = useRef(10);

  const FAKE_USERS = [
    "3mX7...qR2a",
    "9pL1...nK5d",
    "Ak8F...7bWs",
    "Cx2T...mN3j",
    "Df4Y...pZ9c",
  ];

  useEffect(() => {
    const t = setInterval(
      () => setTimer((prev) => (prev <= 1 ? 120 : prev - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const tick = () => {
      const bidAmount = Math.floor(Math.random() * 128 + 256);
      const newBid = {
        id: ++bidIdRef.current,
        user: FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)],
        amount: `$${bidAmount}`,
        time: "just now",
      };
      setPrize((p) => p + bidAmount);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
      setBids((prev) => [newBid, ...prev].slice(0, 4));
    };
    const id = setInterval(tick, 4000 + Math.random() * 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  const timerPct = (timer / 120) * 100;
  const timerColor =
    timer > 60 ? "#4e88bd" : timer > 30 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="relative rounded-[2rem] border border-border/50 bg-white/70 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col p-7 h-[600px] w-[440px] cursor-default"
    >
      {/* Spotlight shimmer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-40"
        style={{ background: shimmerBg }}
      />

      {/* Header */}
      <div
        className="flex justify-between items-center mb-6 border-b border-border/40 pb-5"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs font-bold text-muted uppercase tracking-widest">
            Live Game
          </span>
          <span className="font-mono text-sm font-black text-text">
            SOL-089
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-live-pulse" />
          <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Active
          </span>
        </div>
      </div>

      {/* Prize counter */}
      <div className="mb-5" style={{ transform: "translateZ(30px)" }}>
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">
          Grand Prize
        </p>
        <motion.p
          key={prize}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`font-display text-6xl font-black tracking-tighter transition-colors duration-300 ${flash ? "text-highlight" : "text-text"}`}
        >
          ${prize.toLocaleString()}
        </motion.p>
      </div>

      {/* Countdown bar */}
      <div className="mb-6" style={{ transform: "translateZ(20px)" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted">
            Time Remaining
          </span>
          <motion.span
            key={timer}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="font-mono text-xs font-black"
            style={{ color: timerColor }}
          >
            {String(Math.floor(timer / 60)).padStart(2, "0")}:
            {String(timer % 60).padStart(2, "0")}
          </motion.span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border/40 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${timerPct}%`, backgroundColor: timerColor }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      </div>

      {/* Live bid feed */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ transform: "translateZ(15px)" }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
          Live Bids
        </p>
        <div className="flex flex-col gap-2">
          {bids.map((bid, i) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1 - i * 0.18, x: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="flex items-center justify-between rounded-xl bg-surface-2/80 border border-border/30 px-4 py-2.5"
            >
              <span className="font-mono text-xs text-muted">{bid.user}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-black text-text">
                  {bid.amount}
                </span>
                <span className="text-[10px] text-muted/60">{bid.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div
        className="mt-5 flex items-center justify-between border-t border-border/40 pt-5"
        style={{ transform: "translateZ(40px)" }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">
            Required Bid
          </p>
          <p className="font-mono text-2xl font-black text-text">$512</p>
        </div>
      </div>
    </motion.div>
  );
}
