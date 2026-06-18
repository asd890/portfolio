"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const wordVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,8vw,9rem)] leading-[0.9] font-normal tracking-tight text-[#0a0a0a]"
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.2em] pb-[0.18em] mb-[-0.18em]">
          <motion.span variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-end pb-24 px-8 pt-32 overflow-hidden">
      {/* Background grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Blurred dark blobs behind the navbar area */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 420,
            height: 320,
            top: -60,
            left: "18%",
            background: "rgba(10,10,10,0.13)",
            filter: "blur(72px)",
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -18, 12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 280,
            height: 220,
            top: -40,
            right: "12%",
            background: "rgba(10,10,10,0.09)",
            filter: "blur(56px)",
          }}
          animate={{ x: [0, -24, 18, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 160,
            top: 20,
            left: "55%",
            background: "rgba(10,10,10,0.07)",
            filter: "blur(48px)",
          }}
          animate={{ x: [0, 18, -12, 0], y: [0, -14, 8, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-[90vw]">

        {/* Status pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {[
            { label: "Available for work", pulse: true },
            { label: "Helsinki, Finland" },
            { label: "UX · Product · Brand" },
          ].map(({ label, pulse }, i) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0a0a0a]/12 font-[family-name:var(--font-inter)] text-xs tracking-wide text-[#0a0a0a]/55"
            >
              {pulse && (
                <span className="relative flex h-[7px] w-[7px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-emerald-500" />
                </span>
              )}
              {label}
            </motion.span>
          ))}
        </div>

        <AnimatedHeadline text="Designing products, brands, and experiences that people remember." />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6"
        >
          <p className="font-[family-name:var(--font-inter)] text-[#0a0a0a]/60 text-base max-w-sm leading-relaxed">
            UX/UI Designer with 8+ years of experience creating digital
            products, marketing campaigns, and visual experiences.
          </p>

          <div className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/40">
            <span className="w-8 h-px bg-[#0a0a0a]/40 inline-block" />
            Scroll to explore
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
