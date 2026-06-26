"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const ACCENT = "#3631F5";
const CELL = 40;
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const EMAIL = "admin@ahmednaik.com";

const socials = [
  { label: "LinkedIn", href: "#" },
  { label: "Behance", href: "#" },
  { label: "Dribbble", href: "#" },
];

export default function V2Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="contact" ref={ref} className="px-6 pb-24 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] p-8 md:p-14"
        style={{ backgroundColor: ACCENT }}
      >
        {/* Grid motif echoing the hero */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: `${CELL}px ${CELL}px`,
            maskImage: "radial-gradient(120% 120% at 80% 0%, #000 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(120% 120% at 80% 0%, #000 40%, transparent 100%)",
          }}
        />
        {/* A couple of softly pulsing accent cells for life */}
        {[
          { x: 5, y: 1 },
          { x: 9, y: 3 },
          { x: 2, y: 4 },
        ].map((c, i) => (
          <motion.span
            key={i}
            className="absolute hidden md:block pointer-events-none rounded-[3px] bg-white/15"
            style={{ left: c.x * CELL, top: c.y * CELL, width: CELL, height: CELL }}
            animate={{ opacity: [0.05, 0.25, 0.05] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
          />
        ))}

        <div className="relative">
          <p className="font-[family-name:var(--font-inter)] text-sm text-white/55 mb-5">
            Get in touch
          </p>

          <h2
            className="font-[family-name:var(--font-inter)] font-medium tracking-tight text-white max-w-xl"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1 }}
          >
            Let&apos;s build something people remember.
          </h2>

          {/* Email copy button */}
          <button
            onClick={copyEmail}
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 cursor-none transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Copy email address"
          >
            <span className="font-[family-name:var(--font-inter)] text-sm font-medium" style={{ color: ACCENT }}>
              {copied ? "Copied ✓" : EMAIL}
            </span>
            <span
              className="flex items-center justify-center w-9 h-9 rounded-full text-white text-sm transition-transform duration-300 group-hover:rotate-12"
              style={{ backgroundColor: ACCENT }}
            >
              {copied ? "✓" : "↗"}
            </span>
          </button>

          {/* Socials */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/15 pt-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-inter)] text-sm text-white/60 transition-colors duration-200 hover:text-white cursor-none"
              >
                {s.label}
              </a>
            ))}
            <span className="font-[family-name:var(--font-inter)] text-sm text-white/40 ml-auto">
              © {new Date().getFullYear()} Ahmed Naik
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
