"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const roles = [
  {
    company: "Valmet Automation",
    title: "UX Designer",
    period: "Feb 2023 — Present",
    tags: ["DCS", "MCS", "Safety Systems", "R&D", "Design Systems"],
    description:
      "Creating new components for DCS, MCS and Safety systems within R&D. Designing complex industrial interfaces that require precision, consistency, and rigorous usability standards.",
  },
  {
    company: "LocalBitcoins",
    title: "UX/UI Designer & Visual Designer",
    period: "Feb 2022 — Feb 2023",
    tags: ["UX Research", "UI Design", "Fintech", "Visual Design"],
    description:
      "Designed end-to-end UX/UI for a global peer-to-peer cryptocurrency platform. Led UX research initiatives, produced visual design systems, and shipped high-impact product improvements.",
  },
  {
    company: "MyTownDoesGood",
    title: "UX Designer & Web Developer",
    period: "May 2021 — Feb 2022",
    tags: ["UX Design", "Web Development", "B2C", "Prototyping"],
    description:
      "Wore two hats as both designer and developer — creating user research-backed designs and implementing them in the product. Bridged the gap between design intent and technical execution.",
  },
  {
    company: "Softintex Studio",
    title: "UX/UI Designer & Visual Designer",
    period: "Apr 2020 — May 2021",
    tags: ["UI Design", "Visual Design", "Mobile", "Web"],
    description:
      "Designed interfaces for websites, mobile apps, and desktop applications across B2B and B2C verticals. Developed a broad visual vocabulary and sharp craft across multiple project types.",
  },
];

function RoleRow({ role, index }: { role: (typeof roles)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group border-b border-[#0a0a0a]/10 last:border-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-4 md:gap-8 py-10 md:items-start">
        {/* Period */}
        <div className="pt-1">
          <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/35 tracking-wide">
            {role.period}
          </p>
        </div>

        {/* Main content */}
        <div>
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#0a0a0a] mb-1 group-hover:opacity-70 transition-opacity duration-300">
            {role.company}
          </h3>
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/45 mb-4 tracking-wide">
            {role.title}
          </p>
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/55 leading-relaxed max-w-lg">
            {role.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {role.tags.map((tag) => (
              <span
                key={tag}
                className="font-[family-name:var(--font-inter)] text-[0.6rem] tracking-widest uppercase px-2.5 py-1 border border-[#0a0a0a]/12 text-[#0a0a0a]/40 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Index number */}
        <div className="hidden md:block pt-1 text-right">
          <span className="font-[family-name:var(--font-playfair)] text-5xl text-[#0a0a0a]/[0.06] leading-none select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorkHistory() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });

  return (
    <section className="px-8 py-24 max-w-6xl mx-auto">
      {/* Header */}
      <div ref={headerRef} className="flex items-end justify-between mb-16 border-b border-[#0a0a0a]/10 pb-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-3"
          >
            Experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.95] text-[#0a0a0a]"
          >
            Work History
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden md:block text-right"
        >
          <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/25 tracking-wide">
            7 yrs UI · 5 yrs UX
          </p>
          <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/25 tracking-wide mt-1">
            Websites · Mobile · Desktop · B2B · B2C
          </p>
        </motion.div>
      </div>

      {/* Role list */}
      <div>
        {roles.map((role, i) => (
          <RoleRow key={role.company} role={role} index={i} />
        ))}
      </div>
    </section>
  );
}
