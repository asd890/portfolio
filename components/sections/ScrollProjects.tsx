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

  const handleOpen = useCallback((slug: string) => {
    setExpandingSlug(slug);
    setTimeout(() => router.push(`/projects/${slug}`), 650);
  }, [router]);

  return (
    <>
      <section id="work" ref={sectionRef} className="px-5 md:px-12 py-24 md:py-32">

        {/* Header */}
        <div className="flex items-end justify-between border-t border-[#0a0a0a]/10 pt-7 mb-10 md:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease }}
            className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-[#0a0a0a]/40"
          >
            Selected Work — {String(projects.length).padStart(2, "0")}
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

        {/* Grid with focus-dim interaction */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {projects.map((p, i) => {
            const accent = resolvedColors[p.slug] ?? FALLBACK_ACCENT;
            const isHovered = hoveredIndex === i;
            const dimmed = hoveredIndex !== null && !isHovered;
            // Make a single trailing odd card span full width for a tidy grid.
            const isLastOdd = i === projects.length - 1 && projects.length % 2 === 1;

            return (
              <motion.button
                key={p.slug}
                onClick={() => handleOpen(p.slug)}
                onMouseEnter={() => setHoveredIndex(i)}
                data-cursor="view"
                className={`group relative overflow-hidden cursor-none ${isLastOdd ? "md:col-span-2" : ""}`}
                style={{ borderRadius: "6px" }}
                initial={{ opacity: 0, y: 48 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: i * 0.09 }}
              >
                <motion.div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: isLastOdd ? "16 / 7" : "4 / 3", borderRadius: "6px", backgroundColor: accent }}
                  animate={{
                    opacity: dimmed ? 0.45 : 1,
                    scale: isHovered ? 0.985 : 1,
                    filter: dimmed ? "saturate(0.7)" : "saturate(1)",
                  }}
                  transition={{ duration: 0.5, ease }}
                >
                  {/* Image */}
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                      sizes={isLastOdd ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                      priority={i < 2}
                    />
                  )}

                  {/* Gradient */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 48%, transparent 78%)",
                      opacity: isHovered ? 1 : 0.6,
                    }}
                  />

                  {/* Accent ring on hover */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      borderRadius: "6px",
                      boxShadow: `inset 0 0 0 2px ${accent}`,
                    }}
                  />

                  {/* Number */}
                  <span
                    className="absolute top-4 left-5 font-[family-name:var(--font-inter)] text-[11px] tracking-[0.25em] uppercase tabular-nums text-white/60"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Info */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
                    <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-white/55 mb-2">
                      {p.year}&nbsp;&nbsp;·&nbsp;&nbsp;{p.category}
                    </p>
                    <div className="flex items-end justify-between gap-4">
                      <h3
                        className="font-[family-name:var(--font-playfair)] text-white leading-[0.95]"
                        style={{ fontSize: isLastOdd ? "clamp(1.8rem,3.4vw,3.2rem)" : "clamp(1.5rem,2.2vw,2.4rem)" }}
                      >
                        {p.title}
                      </h3>

                      {/* Reveal CTA */}
                      <span
                        className="flex-shrink-0 flex items-center gap-2 font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-white
                          opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out"
                      >
                        View <span className="text-sm leading-none">→</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
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
