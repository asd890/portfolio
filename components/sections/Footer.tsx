"use client";

export default function Footer() {
  return (
    <footer className="px-8 py-8 border-t border-[#0a0a0a]/10 flex items-center justify-between">
      <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/30">
        © {new Date().getFullYear()} Your Name. All rights reserved.
      </p>
      <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/30">
        Designed & Built with care
      </p>
    </footer>
  );
}
