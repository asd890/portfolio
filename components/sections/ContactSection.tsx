"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const marqueeItems = [
  "Available for freelance",
  "Open to new roles",
  "Let's build something",
  "Based in Tampere",
  "Available for freelance",
  "Open to new roles",
  "Let's build something",
  "Based in Tampere",
];

const links = [
  { label: "LinkedIn", href: "#", text: "linkedin.com/in/yourname" },
  { label: "Behance", href: "#", text: "behance.net/yourname" },
  { label: "Dribbble", href: "#", text: "dribbble.com/yourname" },
];

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("admin@ahmednaik.com").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
      data-cursor-theme="dark"
    >
      {/* Top content */}
      <div className="px-5 md:px-8 pt-32 md:pt-40">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#f5f4f0]/30 mb-10"
        >
          Get in Touch
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,6vw,6rem)] leading-[0.95] text-[#f5f4f0] mb-16 max-w-4xl"
        >
          Let&apos;s build something
          <br />
          <em>meaningful.</em>
        </motion.h2>
      </div>

      {/* Giant email CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease, delay: 0.2 }}
        className="px-5 md:px-8 mb-0"
      >
        <button
          onClick={copyEmail}
          className="group relative w-full text-left border-t border-b border-[#f5f4f0]/10 py-6 md:py-8 cursor-none overflow-hidden"
          aria-label="Copy email address"
        >
          {/* Hover fill */}
          <span className="absolute inset-0 bg-[#f5f4f0] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />

          <span className="relative flex items-center justify-between gap-4">
            <motion.span
              key={copied ? "copied" : "email"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="font-[family-name:var(--font-playfair)] text-[clamp(1.6rem,5vw,5rem)] leading-none group-hover:text-[#0a0a0a] transition-colors duration-300"
              style={{ color: "#f5f4f0" }}
            >
              {copied ? "Copied ✓" : "admin@ahmednaik.com"}
            </motion.span>

            <span
              className="flex-shrink-0 font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase transition-colors duration-300 group-hover:text-[#0a0a0a]"
              style={{ color: "rgba(245,244,240,0.35)" }}
            >
              {copied ? "Done" : "Click to copy"}
            </span>
          </span>
        </button>
      </motion.div>

      {/* Marquee strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="overflow-hidden border-b border-[#f5f4f0]/10 py-4"
      >
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, ease: "linear", repeat: Infinity }}
        >
          {marqueeItems.concat(marqueeItems).map((item, i) => (
            <span key={i} className="flex items-center gap-12 font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#f5f4f0]/25">
              {item}
              <span className="w-1 h-1 rounded-full bg-[#f5f4f0]/20 inline-block" />
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Social links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease, delay: 0.4 }}
        className="px-5 md:px-8 pb-20 md:pb-28"
      >
        {links.map(({ label, href, text }, i) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease, delay: 0.45 + i * 0.07 }}
            className="group flex items-center justify-between py-5 border-b border-[#f5f4f0]/10 hover:border-[#f5f4f0]/25 transition-colors duration-300"
          >
            <span className="font-[family-name:var(--font-inter)] text-[0.6rem] tracking-widest uppercase text-[#f5f4f0]/30 w-24">
              {label}
            </span>
            <span className="flex-1 font-[family-name:var(--font-inter)] text-sm text-[#f5f4f0]/50 group-hover:text-[#f5f4f0] transition-colors duration-300">
              {text}
            </span>
            <span className="font-[family-name:var(--font-inter)] text-sm text-[#f5f4f0] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              ↗
            </span>
          </motion.a>
        ))}
      </motion.div>

      {/* Decorative ghost text */}
      <div className="absolute bottom-0 right-8 pointer-events-none select-none overflow-hidden">
        <p className="font-[family-name:var(--font-playfair)] italic text-[clamp(4rem,14vw,16rem)] text-[#f5f4f0]/[0.03] leading-none">
          Hello
        </p>
      </div>
    </section>
  );
}
