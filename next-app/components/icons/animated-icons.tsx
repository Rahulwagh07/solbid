"use client";

import {
  motion,
  useTransform,
  MotionValue,
  useMotionValue,
} from "motion/react";
import { createContext, useContext } from "react";

export const PhysicsContext = createContext<{
  smoothMouseX: MotionValue<number> | null;
  smoothMouseY: MotionValue<number> | null;
}>({ smoothMouseX: null, smoothMouseY: null });

interface AnimatedIconProps {
  className?: string;
}

// Custom spring configuration from Emil Kowalski skills
const springConfig = {
  type: "spring",
  stiffness: 400,
  damping: 15,
} as const;

const pathVariants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" as const },
  },
};

export function AnimatedZap({ className }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: springConfig },
        hover: { scale: 1.15, rotate: 10, transition: springConfig },
      }}
    >
      <motion.path
        variants={pathVariants}
        d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      />
    </motion.svg>
  );
}

export function AnimatedTrophy({ className }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      animate="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        initial: { y: 10, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: springConfig },
        hover: { y: -5, scale: 1.05, transition: springConfig },
      }}
    >
      <motion.path variants={pathVariants} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <motion.path variants={pathVariants} d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <motion.path variants={pathVariants} d="M4 22h16" />
      <motion.path
        variants={pathVariants}
        d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
      />
      <motion.path
        variants={pathVariants}
        d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
      />
      <motion.path variants={pathVariants} d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </motion.svg>
  );
}

export function AnimatedGamepad({ className }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: springConfig },
        hover: { scale: 1.05, rotate: -5, transition: springConfig },
      }}
    >
      <motion.line variants={pathVariants} x1="6" x2="10" y1="12" y2="12" />
      <motion.line variants={pathVariants} x1="8" x2="8" y1="10" y2="14" />
      <motion.line variants={pathVariants} x1="15" x2="15.01" y1="13" y2="13" />
      <motion.line variants={pathVariants} x1="18" x2="18.01" y1="11" y2="11" />
      <motion.rect
        variants={pathVariants}
        width="20"
        height="12"
        x="2"
        y="6"
        rx="2"
      />
    </motion.svg>
  );
}

export function AnimatedCoins({ className }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        initial: { y: 10, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: springConfig },
        hover: { y: -5, scale: 1.1, transition: springConfig },
      }}
    >
      <motion.circle variants={pathVariants} cx="8" cy="8" r="6" />
      <motion.path
        variants={pathVariants}
        d="M18.09 10.37A6 6 0 1 1 10.34 18"
      />
      <motion.path variants={pathVariants} d="M7 6h1v4" />
      <motion.path variants={pathVariants} d="m16.71 13.88.7.71-2.82 2.82" />
    </motion.svg>
  );
}

export function AnimatedShield({ className }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: springConfig },
        hover: { scale: 1.1, rotate: 5, transition: springConfig },
      }}
    >
      <motion.path
        variants={pathVariants}
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"
      />
    </motion.svg>
  );
}

export function AnimatedActivity({ className }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      animate="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: springConfig },
        hover: { scale: 1.15, transition: springConfig },
      }}
    >
      <motion.polyline
        variants={pathVariants}
        points="22 12 18 12 15 21 9 3 6 12 2 12"
      />
    </motion.svg>
  );
}

export function AnimatedCheckCircle({ className }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      animate="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: springConfig },
        hover: { scale: 1.1, transition: springConfig },
      }}
    >
      <motion.circle variants={pathVariants} cx="12" cy="12" r="10" />
      <motion.path variants={pathVariants} d="m9 12 2 2 4-4" />
    </motion.svg>
  );
}

export function KineticRings({ className }: AnimatedIconProps) {
  const { smoothMouseX } = useContext(PhysicsContext);
  const defaultMv = useMotionValue(0);
  const mv = smoothMouseX || defaultMv;

  // Map normalized mouse (0-1) to 360 degree rotation
  const rotateOuter = useTransform(mv, [0, 1], [-180, 180]);
  const rotateInner = useTransform(mv, [0, 1], [360, -360]);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <motion.g style={{ transformOrigin: "12px 12px", rotate: rotateOuter }}>
        <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
      </motion.g>
      <motion.g style={{ transformOrigin: "12px 12px", rotate: rotateInner }}>
        <circle cx="12" cy="12" r="6" strokeDasharray="2 4" />
      </motion.g>
      <motion.circle cx="12" cy="12" r="2" fill="currentColor" />
    </motion.svg>
  );
}

export function KineticBars({ className }: AnimatedIconProps) {
  const { smoothMouseX } = useContext(PhysicsContext);
  const defaultMv = useMotionValue(0);
  const mv = smoothMouseX || defaultMv;

  // As the mouse scrubs across (0 to 1), different bars rise
  const scaleY1 = useTransform(mv, [0.1, 0.3, 0.5], [1, 2.5, 1]);
  const scaleY2 = useTransform(mv, [0.3, 0.5, 0.7], [1, 2.5, 1]);
  const scaleY3 = useTransform(mv, [0.5, 0.7, 0.9], [1, 2.5, 1]);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <motion.rect
        x="3"
        y="14"
        width="4"
        height="6"
        rx="1"
        style={{ transformOrigin: "bottom", scaleY: scaleY1 }}
      />
      <motion.rect
        x="10"
        y="10"
        width="4"
        height="10"
        rx="1"
        style={{ transformOrigin: "bottom", scaleY: scaleY2 }}
      />
      <motion.rect
        x="17"
        y="16"
        width="4"
        height="4"
        rx="1"
        style={{ transformOrigin: "bottom", scaleY: scaleY3 }}
      />
    </motion.svg>
  );
}

export function KineticNodes({ className }: AnimatedIconProps) {
  const { smoothMouseX } = useContext(PhysicsContext);
  const defaultMv = useMotionValue(0);
  const mv = smoothMouseX || defaultMv;

  // Map mouse to path length
  const pathLen = useTransform(mv, [0.2, 0.8], [0, 1]);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <motion.path
        d="M6 6L18 18M18 6L6 18M12 2L12 22M2 12L22 12"
        strokeDasharray="2 4"
        style={{ pathLength: pathLen }}
      />
      <motion.circle cx="12" cy="12" r="3" fill="currentColor" />
      <motion.circle cx="6" cy="6" r="2" fill="currentColor" />
      <motion.circle cx="18" cy="18" r="2" fill="currentColor" />
      <motion.circle cx="18" cy="6" r="2" fill="currentColor" />
      <motion.circle cx="6" cy="18" r="2" fill="currentColor" />
    </motion.svg>
  );
}

export function KineticDataCore({ className }: AnimatedIconProps) {
  const { smoothMouseX } = useContext(PhysicsContext);
  const defaultMv = useMotionValue(0.5);
  const mv = smoothMouseX || defaultMv;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      preserveAspectRatio="none"
    >
      {/* Background grid lines */}
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.1"
        />
        <path
          d="M 0 40 L 40 40 L 40 0"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.1"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Background traces */}
      <path
        d="M 0 40 L 100 40 L 120 80 L 200 80 L 220 120 L 400 120"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="2"
      />
      <path
        d="M 0 160 L 150 160 L 170 120 L 250 120 L 270 80 L 400 80"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="2"
      />
      <path
        d="M 0 100 L 80 100 L 100 60 L 300 60 L 320 100 L 400 100"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="2"
      />

      {/* Active data streams that track the mouse */}
      <motion.path
        d="M 0 40 L 100 40 L 120 80 L 200 80 L 220 120 L 400 120"
        stroke="currentColor"
        strokeWidth="2"
        style={{ pathLength: useTransform(mv, [0, 1], [0, 1]) }}
      />
      <motion.path
        d="M 0 160 L 150 160 L 170 120 L 250 120 L 270 80 L 400 80"
        stroke="currentColor"
        strokeWidth="2"
        style={{ pathLength: useTransform(mv, [0.2, 0.8], [0, 1]) }}
      />
      <motion.path
        d="M 0 100 L 80 100 L 100 60 L 300 60 L 320 100 L 400 100"
        stroke="currentColor"
        strokeWidth="2"
        style={{ pathLength: useTransform(mv, [0.4, 1], [0, 1]) }}
      />

      {/* Nodes that scale when the mouse passes their threshold and reveal SOLANA */}
      <motion.circle
        cx="100"
        cy="60"
        r="4"
        fill="currentColor"
        style={{
          scale: useTransform(mv, [0.1, 0.2], [1, 4]),
          opacity: useTransform(mv, [0.1, 0.2], [0.3, 1]),
        }}
      />
      <motion.text
        x="100"
        y="62"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="900"
        fill="#080808"
        style={{ opacity: useTransform(mv, [0.1, 0.2], [0, 1]) }}
      >
        S
      </motion.text>

      <motion.circle
        cx="120"
        cy="80"
        r="4"
        fill="currentColor"
        style={{
          scale: useTransform(mv, [0.2, 0.3], [1, 4]),
          opacity: useTransform(mv, [0.2, 0.3], [0.3, 1]),
        }}
      />
      <motion.text
        x="120"
        y="82"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="900"
        fill="#080808"
        style={{ opacity: useTransform(mv, [0.2, 0.3], [0, 1]) }}
      >
        O
      </motion.text>

      <motion.circle
        cx="170"
        cy="120"
        r="4"
        fill="currentColor"
        style={{
          scale: useTransform(mv, [0.3, 0.45], [1, 4]),
          opacity: useTransform(mv, [0.3, 0.45], [0.3, 1]),
        }}
      />
      <motion.text
        x="170"
        y="122"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="900"
        fill="#080808"
        style={{ opacity: useTransform(mv, [0.3, 0.45], [0, 1]) }}
      >
        L
      </motion.text>

      <motion.circle
        cx="220"
        cy="120"
        r="4"
        fill="currentColor"
        style={{
          scale: useTransform(mv, [0.45, 0.6], [1, 4]),
          opacity: useTransform(mv, [0.45, 0.6], [0.3, 1]),
        }}
      />
      <motion.text
        x="220"
        y="122"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="900"
        fill="#080808"
        style={{ opacity: useTransform(mv, [0.45, 0.6], [0, 1]) }}
      >
        A
      </motion.text>

      <motion.circle
        cx="270"
        cy="80"
        r="4"
        fill="currentColor"
        style={{
          scale: useTransform(mv, [0.6, 0.75], [1, 4]),
          opacity: useTransform(mv, [0.6, 0.75], [0.3, 1]),
        }}
      />
      <motion.text
        x="270"
        y="82"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="900"
        fill="#080808"
        style={{ opacity: useTransform(mv, [0.6, 0.75], [0, 1]) }}
      >
        N
      </motion.text>

      <motion.circle
        cx="320"
        cy="100"
        r="4"
        fill="currentColor"
        style={{
          scale: useTransform(mv, [0.75, 0.9], [1, 4]),
          opacity: useTransform(mv, [0.75, 0.9], [0.3, 1]),
        }}
      />
      <motion.text
        x="320"
        y="102"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="900"
        fill="#080808"
        style={{ opacity: useTransform(mv, [0.75, 0.9], [0, 1]) }}
      >
        A
      </motion.text>
    </motion.svg>
  );
}
