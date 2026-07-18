"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { KineticRings } from "../icons/animated-icons";
import { ArrowRight } from "lucide-react";

export function StickyScrollRules() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Calculate opacity for 3 steps with tight crossfades to prevent "blank" gaps
  const opacity1 = useTransform(smoothProgress, [0, 0.3, 0.35], [1, 1, 0]);
  const opacity2 = useTransform(
    smoothProgress,
    [0.3, 0.35, 0.65, 0.7],
    [0, 1, 1, 0],
  );
  const opacity3 = useTransform(smoothProgress, [0.65, 0.7, 1], [0, 1, 1]);

  // Translate up as they fade out, up as they fade in
  const y1 = useTransform(smoothProgress, [0, 0.35], [0, -50]);
  const y2 = useTransform(
    smoothProgress,
    [0.3, 0.35, 0.65, 0.7],
    [50, 0, 0, -50],
  );
  const y3 = useTransform(smoothProgress, [0.65, 0.7, 1], [50, 0, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] bg-surface-2 border-y border-border"
    >
      <div className="sticky top-0 flex h-screen flex-col lg:flex-row items-center justify-center lg:justify-start px-6 mx-auto max-w-7xl overflow-hidden pt-12 lg:pt-0">
        {/* Left: Static massive typography */}
        <div className="w-full lg:w-1/2 pr-0 lg:pr-12 mb-8 lg:mb-0 text-center lg:text-left">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-text leading-[0.9]">
            The Rules <br className="hidden lg:block" />
            <span className="text-muted">of Engagement.</span>
          </h2>
          <p className="mt-4 lg:mt-8 text-lg sm:text-xl font-medium text-muted max-w-md mx-auto lg:mx-0">
            A masterclass in game theory. SolBid removes the middlemen and
            mathematically guarantees excitement.
          </p>
        </div>

        {/* Right: Dynamic scrolling cards */}
        <div className="w-full lg:w-1/2 relative h-[45vh] sm:h-[50vh]">
          {/* Step 1 */}
          <motion.div
            style={{ opacity: opacity1, y: y1 }}
            className="absolute inset-0 flex flex-col justify-center"
          >
            <div className="text-highlight font-mono font-bold text-2xl mb-4">
              01.
            </div>
            <h3 className="font-display text-4xl sm:text-5xl font-black text-text mb-6">
              Enter the Arena
            </h3>
            <p className="text-xl text-muted leading-relaxed">
              Find an active game. The pot starts small. To enter, you must
              place a bid.
            </p>
            <div className="mt-8 p-6 surface border border-border rounded-2xl shadow-xl rotate-[-2deg]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-muted uppercase">
                  Initial Stake
                </span>
                <span className="text-sm font-bold text-text">$2.00 USDC</span>
              </div>
              <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-highlight w-1/4" />
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            style={{ opacity: opacity2, y: y2 }}
            className="absolute inset-0 flex flex-col justify-center"
          >
            <div className="text-highlight font-mono font-bold text-2xl mb-4">
              02.
            </div>
            <h3 className="font-display text-4xl sm:text-5xl font-black text-text mb-6">
              Double the Stakes
            </h3>
            <p className="text-xl text-muted leading-relaxed">
              Every new bid must be exactly double the current highest bid. The
              prize pool grows exponentially.
            </p>
            <div className="mt-8 p-6 surface border border-border rounded-2xl shadow-xl rotate-[1deg]">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <span className="text-sm font-bold text-muted uppercase block mb-1">
                    Last Bid
                  </span>
                  <span className="text-2xl font-bold text-text line-through opacity-50">
                    $32.00
                  </span>
                </div>
                <ArrowRight className="h-8 w-8 text-highlight mb-1" />
                <div className="flex-1 text-right">
                  <span className="text-sm font-bold text-muted uppercase block mb-1">
                    Your Bid
                  </span>
                  <span className="text-4xl font-black text-text">$64.00</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            style={{ opacity: opacity3, y: y3 }}
            className="absolute inset-0 flex flex-col justify-center"
          >
            <div className="text-highlight font-mono font-bold text-2xl mb-4">
              03.
            </div>
            <h3 className="font-display text-4xl sm:text-5xl font-black text-text mb-6">
              Earn or Win
            </h3>
            <p className="text-xl text-muted leading-relaxed">
              If someone outbids you, you earn a passive royalty. If the timer
              hits zero and no one outbids you, you take the entire grand prize.
            </p>
            <motion.div
              whileHover="hover"
              className="mt-8 p-6 surface border border-highlight/50 bg-highlight/5 rounded-2xl shadow-[0_0_40px_rgba(78,136,189,0.15)] rotate-[-1deg] cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-highlight rounded-full flex items-center justify-center shadow-lg">
                  <KineticRings className="h-8 w-8 text-black" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black uppercase tracking-widest">
                    Grand Prize Claimed
                  </p>
                  <p className="font-display text-4xl font-black text-text">
                    $1,024.00
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
