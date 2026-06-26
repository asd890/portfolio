"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ACCENT = "#3631F5";
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stats = [
  { n: "8+", l: "Years experience" },
  { n: "30+", l: "Projects shipped" },
  { n: "5", l: "Industries" },
];

const skills = [
  "Product Design",
  "UX / UI",
  "Design Systems",
  "Prototyping",
  "User Research",
  "Branding",
  "Figma",
  "Framer",
];

export default function V2About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      id="about"
      ref={ref}
      className="mx-auto max-w-3xl px-6 py-24 md:py-28 border-t border-black/5"
    >
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease }}
        className="flex items-center gap-2 mb-8"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
        <span className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/45">About</span>
      </motion.div>

      {/* Statement */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease, delay: 0.05 }}
        className="font-[family-name:var(--font-inter)] tracking-tight text-[#0a0a0a] max-w-2xl"
        style={{ fontSize: "clamp(1.35rem, 2.6vw, 1.9rem)", lineHeight: 1.32 }}
      >
        I&apos;m a UX/UI designer with over eight years turning complex problems into
        clear, human products — across fintech, enterprise, and consumer apps.
        I care about the details most people never notice.{" "}
        <span style={{ color: ACCENT }}>Currently open to new work.</span>
      </motion.p>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease, delay: 0.15 }}
        className="grid grid-cols-3 gap-4 mt-12 max-w-lg"
      >
        {stats.map((s) => (
          <div key={s.l}>
            <p
              className="font-[family-name:var(--font-inter)] font-medium tracking-tight text-[#0a0a0a]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
            >
              {s.n}
            </p>
            <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/45 mt-1">
              {s.l}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease, delay: 0.25 }}
        className="mt-12"
      >
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/35 mb-4">
          Skills &amp; tools
        </p>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-black/10 bg-white px-4 py-2 font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/70
                transition-colors duration-200 hover:border-[#3631F5] hover:text-[#3631F5] cursor-none"
            >
              {s}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
