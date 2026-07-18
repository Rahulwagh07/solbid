"use client";

import React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { PhysicsContext } from "../icons/animated-icons";

export function SpotlightCard({
  children,
  className = "",
  disableEffects = false,
}: {
  children: React.ReactNode;
  className?: string;
  disableEffects?: boolean;
}) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const mousePX = useMotionValue(0);
  const mousePY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-8, 8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Normalized for 3D tilt
    mouseX.set(x / width);
    mouseY.set(y / height);

    // Exact pixels for spotlight
    mousePX.set(x);
    mousePY.set(y);
  }

  function handleMouseLeave() {
    // Snap back to center
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={disableEffects ? undefined : "hover"}
      style={
        disableEffects
          ? undefined
          : {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }
      }
      className={`group relative overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-highlight/20 ${className}`}
    >
      {/* Inner Content (with or without 3D Parallax) */}
      <div
        className={`relative z-20 h-full w-full p-8 md:p-10 ${disableEffects ? "" : "transition-transform duration-300 ease-out group-hover:translate-z-10"}`}
        style={disableEffects ? undefined : { transform: "translateZ(40px)" }}
      >
        <PhysicsContext.Provider value={{ smoothMouseX, smoothMouseY }}>
          {children}
        </PhysicsContext.Provider>
      </div>

      {/* Effects */}
      {!disableEffects && (
        <>
          <svg className="pointer-events-none absolute hidden h-0 w-0">
            <filter id="spotlight-noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.15 0"
              />
            </filter>
          </svg>

          {/* Micro-Grain Spotlight */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 mix-blend-plus-lighter"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  600px circle at ${mousePX}px ${mousePY}px,
                  rgba(78, 136, 189, 0.15),
                  transparent 80%
                )
              `,
              filter: "url(#spotlight-noise)",
            }}
          />

          {/* Magnetic Border Beam */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
            style={{
              border: "1px solid rgba(78, 136, 189, 0.6)",
              maskImage: useMotionTemplate`radial-gradient(400px circle at ${mousePX}px ${mousePY}px, black, transparent)`,
              WebkitMaskImage: useMotionTemplate`radial-gradient(400px circle at ${mousePX}px ${mousePY}px, black, transparent)`,
            }}
          />
        </>
      )}
    </motion.div>
  );
}
