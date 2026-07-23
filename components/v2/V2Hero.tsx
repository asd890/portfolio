"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#3631F5";
const CELL = 40;

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const PRE = ["I'm", "a", "UX/UI", "designer", "crafting", "memorable"];
const CYCLE = ["products.", "brands.", "interfaces.", "experiences."];
const LONGEST = "experiences."; // reserves the slot width

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const word = {
  hidden: { y: "110%" },
  visible: { y: 0, transition: { duration: 0.7, ease } },
};

function Word({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block overflow-hidden mr-[0.22em] pb-[0.14em] -mb-[0.14em] align-bottom">
      <motion.span variants={word} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
}

export default function V2Hero() {
  const [cycle, setCycle] = useState(0);

  // Cycle the accent word.
  useEffect(() => {
    const id = setInterval(() => setCycle((c) => (c + 1) % CYCLE.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Base faint grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,10,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.055) 1px, transparent 1px)",
          backgroundSize: `${CELL}px ${CELL}px`,
          maskImage: "radial-gradient(120% 90% at 50% 30%, #000 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 50% 30%, #000 55%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-5xl px-6 pt-28 md:pt-36 pb-20 md:pb-28">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-3 mb-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 backdrop-blur px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/70">
              Available for work
            </span>
          </span>
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white/60 backdrop-blur px-3 py-1.5 font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/70">
            Based in Tampere
          </span>
        </motion.div>

        {/* Headline with line reveal + cycling word */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="font-[family-name:var(--font-inter)] font-semibold tracking-tight text-[#0a0a0a] max-w-3xl"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.7rem)", lineHeight: 1.08 }}
        >
          {PRE.map((w) => (
            <Word key={w}>{w}</Word>
          ))}

          {/* Cycling accent word — width reserved by an invisible sizer so the
              rest of the line never reflows; words roll in/out overlapping. */}
          <span className="inline-block overflow-hidden mr-[0.22em] pb-[0.14em] -mb-[0.14em] align-bottom">
            <motion.span variants={word} className="inline-block">
              <span className="relative inline-block align-bottom" style={{ color: ACCENT }}>
                <span className="invisible whitespace-nowrap">{LONGEST}</span>
                <AnimatePresence initial={false}>
                  <motion.span
                    key={CYCLE[cycle]}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.45, ease }}
                    className="absolute left-0 top-0 whitespace-nowrap"
                  >
                    {CYCLE[cycle]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.span>
          </span>
        </motion.h1>
      </div>
    </section>
  );
}
