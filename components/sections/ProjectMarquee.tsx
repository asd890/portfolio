"use client";

import { motion } from "framer-motion";

const items = [
  "UX Design",
  "UI Design",
  "Design Systems",
  "Product Design",
  "User Research",
  "Interaction Design",
  "Prototyping",
  "Marketing Design",
  "Brand Assets",
  "Print Design",
];

export default function ProjectMarquee() {
  const doubled = [...items, ...items];

  return (
    <section className="relative py-20 border-t border-[#0a0a0a]/10 overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-12 flex-shrink-0">
            <span className="font-[family-name:var(--font-playfair)] italic text-[clamp(1.5rem,3vw,2.5rem)] text-[#0a0a0a]/20">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#0a0a0a]/10 flex-shrink-0" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
