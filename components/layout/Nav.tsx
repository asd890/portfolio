"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavProps {
  theme?: "light" | "dark";
  showBack?: boolean;
}

export default function Nav({ theme = "light", showBack = false }: NavProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const textColor = theme === "dark" ? "text-white" : "text-[#0a0a0a]";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-multiply`}
    >
      <Link
        href="/"
        className={`${textColor} font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase font-medium hover:opacity-60 transition-opacity`}
      >
        {showBack ? (
          <span className="flex items-center gap-2">
            <span>←</span> Back Home
          </span>
        ) : (
          "Your Name"
        )}
      </Link>

      <div className="flex items-center gap-8">
        <Link
          href="/about"
          className={`${textColor} font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase font-medium hover:opacity-60 transition-opacity`}
        >
          About
        </Link>
        <a
          href="mailto:hello@yourname.com"
          className={`${textColor} font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase font-medium hover:opacity-60 transition-opacity`}
        >
          Contact
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`${textColor} font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase font-medium hover:opacity-60 transition-opacity`}
        >
          Resume
        </a>
      </div>
    </motion.nav>
  );
}
