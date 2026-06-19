"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavProps {
  showBack?: boolean;
}

export default function Nav({ showBack = false }: NavProps) {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-5 py-2.5 rounded-full"
      style={{
        width: "min(680px, calc(100vw - 2rem))",
        backgroundColor: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(20px) saturate(1.8)",
        WebkitBackdropFilter: "blur(20px) saturate(1.8)",
        border: "0.5px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.07), inset 0 0.5px 0 rgba(255,255,255,0.9)",
      }}
    >
      {/* Left — name / back */}
      <Link
        href="/"
        className="font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase font-medium text-[#0a0a0a] hover:opacity-50 transition-opacity"
      >
        {showBack ? (
          <span className="flex items-center gap-2">
            <span>←</span> Back
          </span>
        ) : (
          "Ahmed Naik"
        )}
      </Link>

      {/* Right — links + CTA */}
      <div className="flex items-center gap-1">
        <Link
          href="/about"
          className="hidden sm:block font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase font-medium text-[#0a0a0a]/50 hover:text-[#0a0a0a] transition-colors px-4 py-1.5"
        >
          About
        </Link>
        <a
          href={pathname === "/" ? "#work" : "/#work"}
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="hidden sm:block font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase font-medium text-[#0a0a0a]/50 hover:text-[#0a0a0a] transition-colors px-4 py-1.5"
        >
          Work
        </a>
        <a
          href="mailto:admin@ahmednaik.com"
          className="font-[family-name:var(--font-inter)] text-xs sm:text-sm tracking-widest uppercase font-medium text-white bg-[#0a0a0a] hover:bg-[#0a0a0a]/80 transition-colors px-4 sm:px-5 py-2 rounded-full"
        >
          Contact
        </a>
      </div>
    </motion.nav>
  );
}
