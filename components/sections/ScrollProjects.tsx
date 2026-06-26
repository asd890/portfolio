"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import { extractImageColor } from "@/lib/colorUtils";

const FALLBACK_ACCENT = "#888888";

function useResolvedColors() {
  const [colors, setColors] = useState<Record<string, string>>(() =>
    Object.fromEntries(projects.map((p) => [p.slug, p.accentColor ?? FALLBACK_ACCENT]))
  );
  useEffect(() => {
    projects.forEach((p) => {
      if (p.accentColor || !p.image) return;
      extractImageColor(p.image).then((color) =>
        setColors((prev) => ({ ...prev, [p.slug]: color }))
      );
    });
  }, []);
  return colors;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function ScrollProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandingSlug, setExpandingSlug] = useState<string | null>(null);
  const resolvedColors = useResolvedColors();
  const inView = useInView(sectionRef, { once: true, margin: "-8%" });

  const handleClick = useCallback((slug: string) => {
    setExpandingSlug(slug);
    setTimeout(() => router.push(`/projects/${slug}`), 650);
  }, [router]);

  // Image panel shows hovered project, falls back to first project
  const panelIndex = hoveredIndex ?? 0;
  const panelProject = projects[panelIndex];
  const panelAccent = resolvedColors[panelProject.slug] ?? FALLBACK_ACCENT;

  return (
    <>
      <section id="work" ref={sectionRef} className="px-5 md:px-12 py-24 md:py-32">

        {/* Section header */}
        <div className="flex items-end justify-between border-t border-[#0a0a0a]/10 pt-7 mb-2 md:mb-4">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease }}
            className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-[#0a0a0a]/40"
          >
            Selected Work
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="font-[family-name:var(--font-playfair)] italic leading-none select-none"
            style={{ fontSize: "clamp(3rem,7vw,7rem)", color: "rgba(10,10,10,0.06)" }}
          >
            Work
          </motion.p>
        </div>

        <div className="flex items-start gap-12 xl:gap-20">

          {/* Left — project list */}
          <div className="flex-1 min-w-0">
            {projects.map((p, i) => {
              const accent = resolvedColors[p.slug] ?? FALLBACK_ACCENT;
              const isHovered = hoveredIndex === i;

              return (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                >
                  <button
                    onClick={() => handleClick(p.slug)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="group w-full text-left border-b border-[#0a0a0a]/08 py-6 md:py-7 cursor-none block"
                    data-cursor="view"
                  >
                    <div className="flex items-center justify-between gap-6">

                      {/* Number + title */}
                      <div className="flex items-baseline gap-4 md:gap-6 min-w-0 flex-1">
                        <motion.span
                          className="font-[family-name:var(--font-inter)] text-xs tabular-nums flex-shrink-0"
                          animate={{ color: isHovered ? accent : "rgba(10,10,10,0.22)" }}
                          transition={{ duration: 0.3 }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </motion.span>

                        <span
                          className="font-[family-name:var(--font-playfair)] text-[#0a0a0a] truncate block
                            group-hover:translate-x-2 transition-transform duration-500 ease-out"
                          style={{ fontSize: "clamp(1.6rem, 3vw, 3.2rem)", lineHeight: 1 }}
                        >
                          {p.title}
                        </span>
                      </div>

                      {/* Category + year + arrow */}
                      <div className="flex-shrink-0 flex items-center gap-4 md:gap-6">
                        <span className="hidden md:block font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-[#0a0a0a]/30 transition-colors duration-300 group-hover:text-[#0a0a0a]/55">
                          {p.category}
                        </span>
                        <span className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/20 tabular-nums">
                          {p.year}
                        </span>
                        <span
                          className="text-sm text-[#0a0a0a]/0 group-hover:text-[#0a0a0a]/40
                            translate-x-0 group-hover:translate-x-1
                            transition-all duration-300 ease-out"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Right — sticky image panel (large screens only) */}
          <div className="hidden lg:block flex-shrink-0 w-[36%] xl:w-[38%]">
            <div className="sticky top-[20vh]">
              <motion.div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4 / 3", borderRadius: "3px" }}
                animate={{ opacity: hoveredIndex === null ? 0.3 : 1 }}
                transition={{ duration: 0.4, ease }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={panelProject.slug}
                    className="absolute inset-0"
                    style={{ backgroundColor: panelAccent }}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.38, ease }}
                  >
                    {panelProject.image && (
                      <Image
                        src={panelProject.image}
                        alt={panelProject.title}
                        fill
                        className="object-cover"
                        sizes="40vw"
                        priority
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Project label that appears on hover */}
                <AnimatePresence>
                  {hoveredIndex !== null && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3, ease }}
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
                      }}
                    >
                      <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-white/50 mb-1">
                        {panelProject.category} · {panelProject.year}
                      </p>
                      <p className="font-[family-name:var(--font-playfair)] text-white text-xl leading-tight">
                        {panelProject.title}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Count indicator */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-1.5">
                  {projects.map((_, i) => (
                    <motion.span
                      key={i}
                      className="block rounded-full"
                      animate={{
                        width: i === panelIndex && hoveredIndex !== null ? 16 : 4,
                        height: 3,
                        backgroundColor: i === panelIndex && hoveredIndex !== null
                          ? (resolvedColors[projects[i].slug] ?? "#0a0a0a")
                          : "rgba(10,10,10,0.15)",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
                <span className="font-[family-name:var(--font-inter)] text-[10px] tabular-nums text-[#0a0a0a]/25 tracking-widest">
                  {String(projects.length).padStart(2, "0")} projects
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Page-transition wipe */}
      <AnimatePresence>
        {expandingSlug && (
          <motion.div
            className="fixed inset-0 z-[300]"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }}
            style={{ backgroundColor: resolvedColors[expandingSlug] ?? "#0a0a0a" }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
