"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stats = [
  { value: "8+", label: "Years of practice" },
  { value: "30+", label: "Projects shipped" },
  { value: "5", label: "Industries" },
];

export default function AboutCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      className="py-32 px-5 md:px-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-16 md:gap-8">

        {/* Left — text */}
        <div className="flex-1 min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/40 mb-8"
          >
            The person behind the work
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="font-[family-name:var(--font-playfair)] text-[#0a0a0a] leading-[1.05] mb-8"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
          >
            8+ years designing products, brands, and experiences.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease, delay: 0.2 }}
            className="font-[family-name:var(--font-inter)] text-base leading-relaxed text-[#0a0a0a]/60 mb-12 max-w-md"
          >
            Cross-industry perspective across fintech, industrial software, and consumer apps — bringing considered craft to every layer of a product, from research through to the final pixel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease, delay: 0.3 }}
          >
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase text-[#0a0a0a] border border-[#0a0a0a]/20 px-8 py-4 rounded-full hover:bg-[#0a0a0a] hover:text-[#f5f4f0] transition-all duration-300 cursor-none"
              data-cursor="view"
            >
              <span>About me</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </motion.div>
        </div>

        {/* Right — editorial stats */}
        <div className="md:w-[42%] flex flex-col justify-between gap-0">
          {/* Hero stat */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            className="border-t border-[#0a0a0a]/10 pt-8 pb-8"
          >
            <p
              className="font-[family-name:var(--font-playfair)] text-[#0a0a0a] leading-none mb-3"
              style={{ fontSize: "clamp(5rem, 10vw, 9rem)" }}
            >
              8+
            </p>
            <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/40">
              Years of practice
            </p>
          </motion.div>

          {/* Secondary stats row */}
          <div className="flex divide-x divide-[#0a0a0a]/10">
            {stats.slice(1).map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease, delay: 0.25 + i * 0.1 }}
                className="flex-1 border-t border-[#0a0a0a]/10 pt-8 pb-8 pr-6 first:pl-0 pl-6"
              >
                <p
                  className="font-[family-name:var(--font-playfair)] text-[#0a0a0a] leading-none mb-2"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  {s.value}
                </p>
                <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/40">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
