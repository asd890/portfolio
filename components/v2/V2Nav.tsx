"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const ACCENT = "#3631F5";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLenis = () => (typeof window !== "undefined" ? (window as any).__lenis : undefined);

function scrollToId(id: string) {
  const el = document.querySelector(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -90, duration: 1.1 });
  else el.scrollIntoView({ behavior: "smooth" });
}

function scrollTop() {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { duration: 1.1 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

const scrollItems = [
  { label: "Home", target: "#top" },
  { label: "Work", target: "#work" },
];

export default function V2Nav() {
  const [hovered, setHovered] = useState<number | null>(null);
  const pathname = usePathname();
  const onHome = pathname === "/";

  const handleScroll = (e: React.MouseEvent, target: string) => {
    if (!onHome) return; // let the anchor navigate to "/#..."
    e.preventDefault();
    if (target === "#top") scrollTop();
    else scrollToId(target);
  };

  const handleContact = (e: React.MouseEvent) => {
    if (!onHome) return;
    e.preventDefault();
    scrollToId("#contact");
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <nav className="mx-auto max-w-5xl flex items-center justify-between gap-4 rounded-full border border-black/5 bg-white/80 backdrop-blur-md pl-5 pr-2 py-2 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.25)]">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => { if (onHome) { e.preventDefault(); scrollTop(); } }}
          className="flex items-center gap-2 cursor-none"
        >
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
          {scrollItems.map((it, i) => (
            <a
              key={it.label}
              href={onHome ? it.target : `/${it.target}`}
              onClick={(e) => handleScroll(e, it.target)}
              onMouseEnter={() => setHovered(i)}
              className="relative px-4 py-2 cursor-none hidden sm:block"
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
            </a>
          ))}

          <Link
            href="/about"
            onMouseEnter={() => setHovered(scrollItems.length)}
            className="relative px-4 py-2 cursor-none hidden sm:block"
          >
            {hovered === scrollItems.length && (
              <motion.span
                layoutId="v2-nav-pill"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: ACCENT + "14" }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span
              className="relative z-10 font-[family-name:var(--font-inter)] text-sm transition-colors duration-200"
              style={{ color: hovered === scrollItems.length ? ACCENT : "rgba(10,10,10,0.6)" }}
            >
              About
            </span>
          </Link>

          <a
            href={onHome ? "#contact" : "/#contact"}
            onClick={handleContact}
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
