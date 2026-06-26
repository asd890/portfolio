"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ACCENT = "#3631F5";

const items = [
  { label: "Home", href: "/v2" },
  { label: "About", href: "/about" },
];

export default function V2Nav() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="sticky top-4 z-50 px-4">
      <nav className="mx-auto max-w-3xl flex items-center justify-between gap-4 rounded-full border border-black/5 bg-white/80 backdrop-blur-md pl-5 pr-2 py-2 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.25)]">
        {/* Logo */}
        <Link href="/v2" className="flex items-center gap-2 cursor-none">
          <span className="grid grid-cols-2 gap-[2px] p-[3px] w-5 h-5 rounded-[6px] bg-[#0a0a0a]">
            <span className="rounded-full bg-white" />
            <span className="rounded-full bg-white/50" />
            <span className="rounded-full bg-white/50" />
            <span className="rounded-full bg-white" />
          </span>
          <span className="font-[family-name:var(--font-inter)] font-semibold tracking-tight text-[#0a0a0a]">
            ahmed.
          </span>
        </Link>

        {/* Links + CTA */}
        <div className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
          {items.map((it, i) => (
            <Link
              key={it.label}
              href={it.href}
              onMouseEnter={() => setHovered(i)}
              className="relative px-4 py-2 cursor-none"
            >
              {hovered === i && (
                <motion.span
                  layoutId="v2-nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: ACCENT + "14" }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span
                className="relative z-10 font-[family-name:var(--font-inter)] text-sm transition-colors duration-200"
                style={{ color: hovered === i ? ACCENT : "rgba(10,10,10,0.6)" }}
              >
                {it.label}
              </span>
            </Link>
          ))}

          <a
            href="mailto:admin@ahmednaik.com"
            className="ml-1 rounded-full px-5 py-2 font-[family-name:var(--font-inter)] text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.03] cursor-none"
            style={{ backgroundColor: ACCENT }}
          >
            Contact me
          </a>
        </div>
      </nav>
    </div>
  );
}
