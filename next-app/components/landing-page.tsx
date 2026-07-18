"use client";

import React from "react";
import { FaGithub } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { SolbidLogo } from "./common/Logo";
import Link from "next/link";
import {
  KineticRings,
  KineticBars,
  KineticDataCore,
} from "./icons/animated-icons";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";

import { LiveGameCard } from "./landing/LiveGameCard";
import { SpotlightCard } from "./landing/SpotlightCard";
import { StickyScrollRules } from "./landing/StickyScrollRules";
import { InteractiveSimulation } from "./landing/InteractiveSimulation";
import { ScalingFooter } from "./landing/ScalingFooter";

export default function LandingPage() {
  const { status } = useSession();
  const ctaHref = status === "authenticated" ? "/home" : "/login";

  const doubled = [
    {
      id: "SOL-001",
      amount: "$12.80",
      bids: 14,
      prize: "$184.32",
      active: true,
    },
    { id: "SOL-002", amount: "$3.20", bids: 6, prize: "$20.48", active: true },
    {
      id: "SOL-003",
      amount: "$51.20",
      bids: 22,
      prize: "$1,126.40",
      active: false,
    },
    { id: "SOL-004", amount: "$6.40", bids: 9, prize: "$57.60", active: true },
    {
      id: "SOL-005",
      amount: "$25.60",
      bids: 17,
      prize: "$435.20",
      active: true,
    },
    {
      id: "SOL-001",
      amount: "$12.80",
      bids: 14,
      prize: "$184.32",
      active: true,
    },
    { id: "SOL-002", amount: "$3.20", bids: 6, prize: "$20.48", active: true },
    {
      id: "SOL-003",
      amount: "$51.20",
      bids: 22,
      prize: "$1,126.40",
      active: false,
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-clip bg-background text-text selection:bg-highlight selection:text-black">
      <div className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay">
        <svg className="absolute inset-0 h-full w-full">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.1 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <section className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-6 pt-32 lg:flex-row lg:items-center lg:justify-between lg:pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 w-full lg:w-1/2 xl:w-3/5 lg:pr-8"
        >
          <div
            className="pointer-events-none absolute -left-10 -top-20 z-[-1] select-none text-[8rem] font-black leading-none tracking-tighter text-transparent opacity-[0.03] lg:text-[14rem]"
            style={{ WebkitTextStroke: "3px var(--color-text)" }}
          >
            BID
          </div>

          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-2.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-highlight animate-live-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-text">
              The Premier Arena on Solana
            </span>
          </div>

          <h1 className="font-display text-6xl font-black tracking-tight text-text sm:text-8xl lg:text-[8rem] lg:leading-[0.85]">
            Outbid.
            <br />
            Outlast.
            <br />
            <span className="text-highlight bg-black px-2 py-1 inline-block -rotate-2 mt-4 shadow-2xl">
              Outearn.
            </span>
          </h1>

          <p className="mt-10 max-w-lg text-lg font-medium leading-relaxed text-muted sm:text-2xl">
            A high-stakes Solana auction where every bid earns you royalties,
            and the last bidder wins the prize.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link
              href={ctaHref}
              className="group relative inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-xl bg-black px-10 font-display text-sm font-bold tracking-widest text-white transition-transform hover:scale-[0.98] active:scale-95"
            >
              <span className="relative z-10">START PLAYING</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex justify-end relative z-10 w-full lg:w-1/2 xl:w-2/5 scale-[0.85] lg:scale-90 xl:scale-100 origin-right"
        >
          <LiveGameCard />
        </motion.div>
      </section>

      <section className="relative z-10 py-10 border-y-2 border-text bg-surface-2 overflow-hidden flex items-center">
        <div className="flex shrink-0 animate-marquee gap-8 whitespace-nowrap">
          {doubled.map((item, i) => (
            <div key={`${item.id}-${i}`} className="flex items-center gap-8">
              <span className="font-display text-5xl font-black tracking-tighter text-text/20">
                {item.id}
              </span>
              <span className="font-mono text-4xl font-bold text-text">
                {item.amount}
              </span>
              {item.active && (
                <span className="h-4 w-4 bg-highlight rounded-full" />
              )}
            </div>
          ))}
        </div>
      </section>

      <StickyScrollRules />

      <InteractiveSimulation />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-40">
        <div className="mb-24">
          <h2 className="font-display text-5xl sm:text-7xl font-black tracking-tight text-text">
            Architected for <br />{" "}
            <span className="text-muted">High Stakes.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SpotlightCard className="md:col-span-2 min-h-[400px]">
            <motion.div
              variants={{ hover: { scale: 1.1 } }}
              className="inline-block origin-bottom"
            >
              <KineticRings className="h-10 w-10 text-text mb-8" />
            </motion.div>
            <h3 className="font-display text-4xl font-black tracking-tight text-text mb-4">
              Winner Takes All
            </h3>
            <p className="text-lg text-muted">
              When the timer hits zero, the last bidder claims 100% of the
              massive pot.
            </p>
          </SpotlightCard>

          <SpotlightCard className="md:col-span-2 min-h-[400px]">
            <motion.div
              variants={{ hover: { scale: 1.15 } }}
              className="inline-block origin-center"
            >
              <KineticBars className="h-10 w-10 text-text mb-8" />
            </motion.div>
            <h3 className="font-display text-4xl font-black tracking-tight text-text mb-4">
              Dynamic Multipliers
            </h3>
            <p className="text-lg text-muted">
              Every single bid doubles the stakes. Watch the prize pool explode
              exponentially within minutes.
            </p>
          </SpotlightCard>

          <SpotlightCard
            disableEffects
            className="md:col-span-4 min-h-[350px] bg-surface-2 text-text p-0 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row h-full w-full">
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center text-left">
                <h3 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-6">
                  Fully Decentralized on Solana
                </h3>
                <p className="text-lg text-muted max-w-md">
                  Smart contracts guarantee payouts instantly. No house holds
                  your funds. Fast, transparent, and immutable.
                </p>
              </div>

              <div className="flex-1 relative min-h-[250px] md:min-h-full bg-highlight/5 border-t md:border-t-0 md:border-l border-highlight/20 hidden lg:flex items-center justify-center overflow-hidden">
                <KineticDataCore className="absolute inset-0 w-full h-full text-highlight scale-125 origin-center opacity-80" />
                <div className="absolute inset-0 bg-highlight/10 blur-3xl rounded-full" />
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      <ScalingFooter />

      <footer className="relative z-20 border-t border-black/10 bg-black px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row text-white">
          <div className="flex items-center gap-3">
            <SolbidLogo className="h-6 w-6 text-highlight" />
            <span className="font-display text-xl font-black tracking-tight">
              SOLBID
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">
            The arena awaits. Play responsibly.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/rahulwagh07/solbid"
              target="_blank"
              className="text-white/50 hover:text-white transition-colors"
            >
              <FaGithub size={24} />
            </Link>
            <Link
              href="https://x.com/_rahulwagh"
              target="_blank"
              className="text-white/50 hover:text-white transition-colors"
            >
              <BsTwitterX size={20} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
