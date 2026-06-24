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
  const [expandingSlug, setExpandingSlug] = useState<string | null>(null);
  const resolvedColors = useResolvedColors();
  const inView = useInView(sectionRef, { once: true, margin: "-8%" });

  const handleClick = useCallback((slug: string) => {
    setExpandingSlug(slug);
    setTimeout(() => router.push(`/projects/${slug}`), 650);
  }, [router]);

  return (
    <>
      <section id="work" ref={sectionRef} className="px-5 md:px-12 py-24 md:py-32">

        {/* Section header */}
        <div className="flex items-end justify-between border-t border-[#0a0a0a]/10 pt-7 mb-8 md:mb-10">
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {projects.map((p, i) => {
            const accent = resolvedColors[p.slug] ?? FALLBACK_ACCENT;
            const isFeatured = i === 0;

            return (
              <motion.article
                key={p.slug}
                className={`group relative overflow-hidden cursor-none ${isFeatured ? "md:col-span-2" : ""}`}
                style={{
                  aspectRatio: isFeatured ? "16 / 7" : "4 / 3",
                  borderRadius: "3px",
                  backgroundColor: accent,
                }}
                initial={{ opacity: 0, y: 56 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.72, ease, delay: i * 0.1 }}
                onClick={() => handleClick(p.slug)}
                data-cursor="view"
              >
                {/* Image */}
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes={isFeatured ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                    priority={i === 0}
                  />
                )}

                {/* Persistent gradient so text is always readable */}
                <div
                  className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.12) 45%, transparent 75%)",
                    opacity: 0.55,
                  }}
                />

                {/* Project info — title always visible, CTA slides in on hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <div className="translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-white/50 mb-2">
                      {p.year}&nbsp;&nbsp;·&nbsp;&nbsp;{p.category}
                    </p>
                    <h3
                      className="font-[family-name:var(--font-playfair)] text-white leading-[0.95]"
                      style={{ fontSize: isFeatured ? "clamp(1.8rem,3.5vw,3.5rem)" : "clamp(1.4rem,2.2vw,2.2rem)" }}
                    >
                      {p.title}
                    </h3>

                    {/* CTA — hidden until hover */}
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-400 ease-out delay-75">
                      <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-white/65">
                        Open Case Study
                      </span>
                      <span className="text-white/65 text-sm leading-none transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Large faint project number — personality detail */}
                <span
                  className="absolute top-4 right-5 font-[family-name:var(--font-playfair)] italic leading-none pointer-events-none select-none transition-opacity duration-500 opacity-[0.07] group-hover:opacity-[0.12]"
                  style={{ fontSize: isFeatured ? "9rem" : "6.5rem", color: "#fff" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Accent colour tint on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.18] transition-opacity duration-500 mix-blend-color pointer-events-none"
                  style={{ backgroundColor: accent }}
                />
              </motion.article>
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
