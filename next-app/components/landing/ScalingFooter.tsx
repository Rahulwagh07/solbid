"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

export function ScalingFooter() {
  const { status } = useSession();
  const ctaHref = status === "authenticated" ? "/home" : "/login";

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const scale = useTransform(smoothProgress, [0, 1], [0.5, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <section
      ref={containerRef}
      className="relative z-10 h-[80vh] flex flex-col items-center justify-center bg-highlight overflow-hidden text-black px-6"
    >
      <motion.div style={{ scale, opacity }} className="text-center w-full">
        <h2 className="font-display text-[15vw] leading-[0.8] font-black tracking-tighter uppercase whitespace-nowrap">
          Are you <br /> ready?
        </h2>
      </motion.div>
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <Link
          href={ctaHref}
          className="group relative inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-12 font-display text-lg font-bold tracking-widest text-black transition-transform hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        >
          <span className="relative z-10">ENTER THE ARENA</span>
          <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </section>
  );
}
