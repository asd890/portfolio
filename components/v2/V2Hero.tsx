"use client";

import { useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

const ACCENT = "#3631F5";
const CELL = 40;

export default function V2Hero() {
  const gridRef = useRef<HTMLDivElement>(null);

  // No spring — the box snaps directly to the hovered cell.
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const opacity = useMotionValue(0);

  const handleMove = (e: React.MouseEvent) => {
    const el = gridRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / CELL);
    const row = Math.floor((e.clientY - rect.top) / CELL);
    x.set(col * CELL);
    y.set(row * CELL);
    opacity.set(1);
  };

  return (
    <section
      onMouseMove={handleMove}
      onMouseLeave={() => opacity.set(0)}
      data-hide-cursor
      className="relative overflow-hidden"
    >
      {/* Grid background */}
      <div
        ref={gridRef}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,10,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.055) 1px, transparent 1px)",
          backgroundSize: `${CELL}px ${CELL}px`,
          maskImage: "radial-gradient(120% 90% at 50% 30%, #000 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 50% 30%, #000 55%, transparent 100%)",
        }}
      />

      {/* Single highlighted cell under the cursor */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          x,
          y,
          opacity,
          width: CELL,
          height: CELL,
          backgroundColor: ACCENT,
          borderRadius: 3,
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-5xl px-6 pt-28 md:pt-36 pb-20 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/45 mb-5"
        >
          Ahmed Naik &nbsp;•&nbsp; based in Helsinki
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="font-[family-name:var(--font-inter)] font-medium tracking-tight text-[#0a0a0a] max-w-xl"
          style={{ fontSize: "clamp(1.9rem, 4vw, 2.9rem)", lineHeight: 1.12 }}
        >
          I&apos;m a UX/UI designer crafting products, brands &amp; experiences that people{" "}
          <span style={{ color: ACCENT }}>remember.</span>
        </motion.h1>
      </div>
    </section>
  );
}
