"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import { useNavColor } from "@/contexts/NavColorContext";
import { getContrastColor, extractImageColor } from "@/lib/colorUtils";

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

export default function ScrollProjects() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [expandingSlug, setExpandingSlug] = useState<string | null>(null);
  const activeIndexRef = useRef(0);

  const resolvedColors = useResolvedColors();
  const { setAccentColor } = useNavColor();

  // Drive active project from scroll position.
  // scroll-snap-stop:always means scrollTop is always a clean multiple of vh.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      const idx = Math.min(
        Math.round(container.scrollTop / window.innerHeight),
        projects.length - 1
      );
      if (idx === activeIndexRef.current) return;
      setDirection(idx > activeIndexRef.current ? 1 : -1);
      activeIndexRef.current = idx;
      setActiveIndex(idx);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  // Accent colour
  useEffect(() => {
    setAccentColor(resolvedColors[projects[activeIndex].slug] ?? null);
  }, [activeIndex, resolvedColors, setAccentColor]);

  // Clear accent when section leaves page viewport
  useEffect(() => {
    const el = document.getElementById("work");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) setAccentColor(null); },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setAccentColor]);

  const handleClick = useCallback(
    (slug: string) => {
      setExpandingSlug(slug);
      setTimeout(() => router.push(`/projects/${slug}`), 650);
    },
    [router]
  );

  const scrollTo = useCallback((i: number) => {
    scrollContainerRef.current?.scrollTo({
      top: i * window.innerHeight,
      behavior: "smooth",
    });
  }, []);

  const project = projects[activeIndex];
  const accent = resolvedColors[project.slug] ?? FALLBACK_ACCENT;
  const textColor = getContrastColor(accent);
  const prevProject = activeIndex > 0 ? projects[activeIndex - 1] : null;
  const nextProject = activeIndex < projects.length - 1 ? projects[activeIndex + 1] : null;

  const slideVariants = {
    enter: (d: number) => ({ y: d > 0 ? 50 : -50, opacity: 0 }),
    center: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: (d: number) => ({
      y: d > 0 ? -35 : 35,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" as const },
    }),
  };

  const cardVariants = {
    enter: (d: number) => ({ y: d > 0 ? "40%" : "-40%", opacity: 0, rotate: d > 0 ? 2 : -8, scale: 0.9 }),
    center: {
      y: "0%", opacity: 1, rotate: 0, scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: (d: number) => ({
      y: d > 0 ? "-40%" : "40%", opacity: 0, rotate: d > 0 ? -8 : 2, scale: 0.9,
      transition: { duration: 0.35, ease: "easeIn" as const },
    }),
  };

  return (
    <>
      {/*
        The scroll container IS the section. Everything lives inside it so wheel
        events always target its own subtree — the browser scrolls the container,
        never the page. data-lenis-prevent tells Lenis to leave it alone entirely.

        Structure inside:
          1. Sticky 0-height display wrapper (comes first, takes no flow space).
             Its 100vh child overflows and is always pinned to the top of the
             container viewport regardless of scroll position.
          2. Snap targets (n × 100vh). scroll-snap-stop:always forces the browser
             to stop at every snap point, even on a fast swipe.
      */}
      <div
        id="work"
        ref={scrollContainerRef}
        data-lenis-prevent
        style={{
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          position: "relative",
        }}
      >
        {/* ── Display (sticky, 0-height so it doesn't shift snap targets) ─── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: 0,
            overflow: "visible",
            zIndex: 10,
          }}
        >
          <div style={{ height: "100vh", overflow: "hidden", position: "relative" }}>

            {/* Background */}
            <motion.div
              className="absolute inset-0"
              animate={{ backgroundColor: accent }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />

            {/* Left — text */}
            <div className="absolute bottom-0 left-0 right-0 h-[48%] md:h-auto md:inset-y-0 md:right-auto md:w-1/2 flex flex-col justify-center pl-5 pr-5 pb-10 md:pl-12 md:pr-8 md:pb-0 z-10">
              <p
                className="font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase mb-6 md:mb-10"
                style={{ color: textColor + "60" }}
              >
                Selected Work —{" "}
                <motion.span
                  key={activeIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </motion.span>{" "}
                / {String(projects.length).padStart(2, "0")}
              </p>

              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={project.slug}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase"
                      style={{ color: textColor + "45" }}
                    >
                      {project.year}
                    </span>
                    <span style={{ color: textColor + "25" }}>·</span>
                    <span
                      className="font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase"
                      style={{ color: textColor + "60" }}
                    >
                      {project.category}
                    </span>
                  </div>

                  <h2
                    className="font-[family-name:var(--font-playfair)] leading-[0.88] mb-6"
                    style={{ color: textColor, fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)" }}
                  >
                    {project.title}
                  </h2>

                  <p
                    className="hidden md:block font-[family-name:var(--font-inter)] text-base leading-relaxed mb-10 max-w-xs"
                    style={{ color: textColor + "AA" }}
                  >
                    {project.description}
                  </p>

                  <button
                    onClick={() => handleClick(project.slug)}
                    className="group flex items-center gap-3 font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase cursor-none"
                    data-cursor="view"
                    style={{ color: textColor }}
                  >
                    <span>Open Case Study</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — cards */}
            <div className="absolute top-0 left-0 right-0 h-[55%] md:h-auto md:inset-y-0 md:left-auto md:right-0 md:w-1/2 flex items-center justify-center overflow-hidden">
              <div className="relative w-[88%] md:w-[90%]" style={{ aspectRatio: "4/3" }}>

                {prevProject && (
                  <motion.div
                    animate={{ y: "-96%", scale: 0.88, opacity: 0.55 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: "absolute", width: "100%", zIndex: 5 }}
                    className="pointer-events-none"
                  >
                    <div
                      className="relative w-full overflow-hidden shadow-2xl"
                      style={{ aspectRatio: "4/3", borderRadius: "3px", backgroundColor: resolvedColors[prevProject.slug] ?? FALLBACK_ACCENT, filter: "brightness(0.7)" }}
                    >
                      {prevProject.image && (
                        <Image src={prevProject.image} alt={prevProject.title} fill className="object-cover" sizes="50vw" />
                      )}
                    </div>
                  </motion.div>
                )}

                {nextProject && (
                  <motion.div
                    animate={{ y: "96%", scale: 0.88, opacity: 0.55 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: "absolute", width: "100%", zIndex: 5 }}
                    className="pointer-events-none"
                  >
                    <div
                      className="relative w-full overflow-hidden shadow-2xl"
                      style={{ aspectRatio: "4/3", borderRadius: "3px", backgroundColor: resolvedColors[nextProject.slug] ?? FALLBACK_ACCENT, filter: "brightness(0.7)" }}
                    >
                      {nextProject.image && (
                        <Image src={nextProject.image} alt={nextProject.title} fill className="object-cover" sizes="50vw" />
                      )}
                    </div>
                  </motion.div>
                )}

                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={`card-${project.slug}`}
                    custom={direction}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 cursor-none"
                    style={{ zIndex: 10 }}
                    data-cursor="view"
                    onClick={() => handleClick(project.slug)}
                  >
                    <div
                      className="relative w-full h-full overflow-hidden shadow-2xl"
                      style={{ borderRadius: "3px", backgroundColor: accent, filter: "brightness(0.88) contrast(1.05)" }}
                    >
                      {project.image ? (
                        <Image src={project.image} alt={project.title} fill className="object-cover" sizes="50vw" priority />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="font-[family-name:var(--font-playfair)] italic select-none"
                            style={{ fontSize: "clamp(4rem,12vw,10rem)", color: textColor + "15" }}
                          >
                            {project.title[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Dot nav */}
            <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-20">
              {projects.map((p, i) => (
                <button
                  key={p.slug}
                  aria-label={`Go to ${p.title}`}
                  onClick={() => scrollTo(i)}
                  className="flex items-center justify-center"
                  style={{ width: 20, height: 20 }}
                >
                  <motion.span
                    className="block rounded-full"
                    animate={{
                      width: i === activeIndex ? 8 : 4,
                      height: i === activeIndex ? 8 : 4,
                      backgroundColor: i === activeIndex ? textColor : textColor + "40",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ backgroundColor: textColor + "20" }}>
              <motion.div
                className="h-full origin-left"
                style={{ backgroundColor: textColor + "50" }}
                animate={{ scaleX: (activeIndex + 1) / projects.length }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

          </div>
        </div>
        {/* ── End display ────────────────────────────────────────────────── */}

        {/* ── Snap targets (n × 100vh) ─────────────────────────────────── */}
        {projects.map((_, i) => (
          <div
            key={i}
            data-index={i}
            style={{
              height: "100vh",
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
            }}
          />
        ))}
      </div>

      {/* Page-transition wipe */}
      <AnimatePresence>
        {expandingSlug && (
          <motion.div
            className="fixed inset-0 z-[200]"
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
