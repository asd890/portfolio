"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#3631F5";
const CELL = 40;

const SPOT_LINE = "rgba(54,49,245,0.18)";
const SPOT_GLOW = "rgba(54,49,245,0.07)";

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
  const sectionRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const target = useRef({ x: -500, y: -500 });
  const current = useRef({ x: -500, y: -500 });
  const visible = useRef(false);

  const [cycle, setCycle] = useState(0);

  // Cycle the accent word.
  useEffect(() => {
    const id = setInterval(() => setCycle((c) => (c + 1) % CYCLE.length), 2200);
    return () => clearInterval(id);
  }, []);

  // Smoothly glide the spotlight toward the cursor each frame.
  useEffect(() => {
    let raf: number;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      const el = spotRef.current;
      if (el) {
        el.style.setProperty("--mx", `${current.current.x}px`);
        el.style.setProperty("--my", `${current.current.y}px`);
        el.style.opacity = visible.current ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    visible.current = true;
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      onMouseLeave={() => { visible.current = false; }}
      className="relative overflow-hidden"
    >
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

      {/* Spotlight */}
      <div
        ref={spotRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle 200px at var(--mx) var(--my), ${SPOT_GLOW} 0%, transparent 65%)` }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${SPOT_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${SPOT_LINE} 1px, transparent 1px)`,
            backgroundSize: `${CELL}px ${CELL}px`,
            maskImage: "radial-gradient(circle 150px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.85) 35%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(circle 150px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.85) 35%, transparent 72%)",
          }}
        />
      </div>

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
