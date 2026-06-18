"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="relative px-8 py-40 overflow-hidden">
      <div className="max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-8"
        >
          Get in Touch
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,7vw,7rem)] leading-[0.95] text-[#0a0a0a] mb-16"
        >
          Let&apos;s build something
          <br />
          <em>meaningful.</em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-6"
        >
          {[
            { label: "Email", href: "admin@ahmednaik.com", text: "admin@ahmednaik.com" },
            { label: "LinkedIn", href: "#", text: "linkedin.com/in/yourname" },
            { label: "Behance", href: "#", text: "behance.net/yourname" },
            { label: "Dribbble", href: "#", text: "dribbble.com/yourname" },
          ].map(({ label, href, text }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 px-6 py-4 border border-[#0a0a0a]/10 hover:border-[#0a0a0a] transition-colors duration-300 rounded-sm"
            >
              <span className="font-[family-name:var(--font-inter)] text-[0.6rem] tracking-widest uppercase text-[#0a0a0a]/30">
                {label}
              </span>
              <span className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a] group-hover:opacity-60 transition-opacity">
                {text}
              </span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Large decorative text */}
      <div className="absolute bottom-0 right-8 pointer-events-none select-none overflow-hidden">
        <p className="font-[family-name:var(--font-playfair)] italic text-[clamp(4rem,14vw,16rem)] text-[#0a0a0a]/[0.04] leading-none">
          Hello
        </p>
      </div>
    </section>
  );
}
