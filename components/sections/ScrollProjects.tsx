"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const cardVariants = {
  enter: (d: number) => ({
    x: d > 0 ? "110%" : "-110%",
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: "0%",
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease },
  },
  exit: (d: number) => ({
    x: d > 0 ? "-110%" : "110%",
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.32, ease: "easeIn" as const },
  }),
};

const textVariants = {
  enter: (d: number) => ({ y: d > 0 ? 40 : -40, opacity: 0 }),
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease },
  },
  exit: (d: number) => ({
    y: d > 0 ? -24 : 24,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" as const },
  }),
};

export default function ScrollProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [expandingSlug, setExpandingSlug] = useState<string | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const activeIndexRef = useRef(0);
  const lockedRef = useRef(false);
  const entryLockRef = useRef(false);
  // sectionRef is also the 500vh container — getBoundingClientRect on it
  // tells us whether the sticky panel currently fills the viewport.

  const resolvedColors = useResolvedColors();
  const { setAccentColor } = useNavColor();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLenis = () => (window as any).__lenis as
    | { scrollTo: (target: number, opts?: Record<string, unknown>) => void }
    | undefined;

  useEffect(() => {
    setAccentColor(resolvedColors[projects[activeIndex].slug] ?? null);
  }, [activeIndex, resolvedColors, setAccentColor]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let wasIntersecting = false;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !wasIntersecting) {
          // Section just came into view — Lenis still has residual momentum.
          // Block navigation for 1 s so that momentum doesn't skip project 0.
          entryLockRef.current = true;
          setTimeout(() => { entryLockRef.current = false; }, 1000);
        }
        wasIntersecting = e.isIntersecting;
        if (!e.isIntersecting) setAccentColor(null);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [setAccentColor]);

  const navigate = useCallback((dir: 1 | -1) => {
    if (lockedRef.current) return;
    const next = activeIndexRef.current + dir;
    if (next < 0 || next >= projects.length) return;
    lockedRef.current = true;
    activeIndexRef.current = next;
    setDirection(dir);
    setActiveIndex(next);
    // Keep Lenis position proportional to the active index so the section
    // exits cleanly with one scroll at the first / last project.
    const el = sectionRef.current;
    if (el) {
      const maxScroll = el.offsetHeight - window.innerHeight;
      const t = projects.length > 1 ? next / (projects.length - 1) : 0;
      getLenis()?.scrollTo(el.offsetTop + t * maxScroll, { immediate: true });
    }
    // Use a longer hold at the first / last project so inertia from the
    // last gesture has time to die before the section exits.
    const atBoundary = next === 0 || next === projects.length - 1;
    setTimeout(() => { lockedRef.current = false; }, atBoundary ? 1300 : 900);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      // Only act while the sticky panel fills the viewport
      const { top, bottom } = el.getBoundingClientRect();
      if (top > 1 || bottom < window.innerHeight - 1) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const curr = activeIndexRef.current;

      // Absorb Lenis arrival momentum — don't navigate yet, just hold the page.
      if (entryLockRef.current) {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e as any).lenisStopPropagation = true;
        return;
      }

      // At the boundary in the exit direction: hold while locked (inertia from
      // the previous navigate is still decaying), then release for Lenis to exit.
      if (dir === -1 && curr === 0) {
        if (lockedRef.current) {
          e.preventDefault();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e as any).lenisStopPropagation = true;
        }
        return;
      }
      if (dir === 1 && curr === projects.length - 1) {
        if (lockedRef.current) {
          e.preventDefault();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e as any).lenisStopPropagation = true;
        }
        return;
      }

      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any).lenisStopPropagation = true;
      navigate(dir);
    };
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", handleWheel, true);
  }, [navigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && overlayOpen) setOverlayOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [overlayOpen]);

  const handleClick = useCallback((slug: string) => {
    setExpandingSlug(slug);
    setTimeout(() => router.push(`/projects/${slug}`), 650);
  }, [router]);

  const project = projects[activeIndex];
  const accent = resolvedColors[project.slug] ?? FALLBACK_ACCENT;
  const textColor = getContrastColor(accent);
  const prevProject = activeIndex > 0 ? projects[activeIndex - 1] : null;
  const nextProject = activeIndex < projects.length - 1 ? projects[activeIndex + 1] : null;

  return (
    <>
      {/* 500vh container: page scrolls through its full height while the inner
          panel stays sticky. Vertical scroll drives the project index via the
          wheel handler; card transitions play horizontally. */}
      <div
        id="work"
        ref={sectionRef}
        style={{ height: `${projects.length * 100}vh`, position: "relative" }}
      >
      <section
        className="relative overflow-hidden"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: accent }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex h-full">
          {/* Left panel */}
          <div className="flex flex-col justify-center w-full md:w-[40%] pl-5 pr-5 pb-10 pt-10 md:pl-12 md:pr-8 md:pb-0 md:pt-0">
            <p
              className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase mb-10"
              style={{ color: textColor + "60" }}
            >
              Selected Work &mdash;{" "}
              <motion.span
                key={activeIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </motion.span>
              {" "}/ {String(projects.length).padStart(2, "0")}
            </p>

            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={project.slug}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase"
                    style={{ color: textColor + "50" }}
                  >
                    {project.year}
                  </span>
                  <span style={{ color: textColor + "25" }}>·</span>
                  <span
                    className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase"
                    style={{ color: textColor + "60" }}
                  >
                    {project.category}
                  </span>
                </div>

                <h2
                  className="font-[family-name:var(--font-playfair)] leading-[0.88] mb-6"
                  style={{ color: textColor, fontSize: "clamp(2.4rem, 4.5vw, 5rem)" }}
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
                  className="group flex items-center gap-3 font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase cursor-none mb-12"
                  data-cursor="view"
                  style={{ color: textColor }}
                >
                  <span>Open Case Study</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    &rarr;
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate(-1)}
                disabled={activeIndex === 0}
                className="flex items-center justify-center w-10 h-10 rounded-full border transition-opacity duration-200 cursor-none"
                style={{
                  borderColor: textColor + "30",
                  color: textColor,
                  opacity: activeIndex === 0 ? 0.25 : 1,
                }}
                aria-label="Previous project"
              >
                &larr;
              </button>
              <button
                onClick={() => navigate(1)}
                disabled={activeIndex === projects.length - 1}
                className="flex items-center justify-center w-10 h-10 rounded-full border transition-opacity duration-200 cursor-none"
                style={{
                  borderColor: textColor + "30",
                  color: textColor,
                  opacity: activeIndex === projects.length - 1 ? 0.25 : 1,
                }}
                aria-label="Next project"
              >
                &rarr;
              </button>
            </div>

            <button
              onClick={() => setOverlayOpen(true)}
              className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase self-start border-b pb-px transition-opacity duration-200 hover:opacity-60 cursor-none"
              style={{ color: textColor + "70", borderColor: textColor + "30" }}
            >
              View all projects
            </button>
          </div>

          {/* Right panel */}
          <div className="hidden md:flex flex-col items-center justify-center w-[60%] overflow-hidden px-8">
            <div className="relative w-full" style={{ maxWidth: "680px", aspectRatio: "4/3" }}>
              {prevProject && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    width: "85%",
                    aspectRatio: "4/3",
                    top: "50%",
                    transform: "translateX(-96%) translateY(-50%) scale(0.88)",
                    opacity: 0.45,
                    zIndex: 5,
                  }}
                >
                  <div
                    className="relative w-full h-full overflow-hidden shadow-2xl"
                    style={{
                      borderRadius: "3px",
                      backgroundColor: resolvedColors[prevProject.slug] ?? FALLBACK_ACCENT,
                      filter: "brightness(0.6)",
                    }}
                  >
                    {prevProject.image && (
                      <Image
                        src={prevProject.image}
                        alt={prevProject.title}
                        fill
                        className="object-cover"
                        sizes="40vw"
                      />
                    )}
                  </div>
                </div>
              )}

              {nextProject && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    width: "85%",
                    aspectRatio: "4/3",
                    top: "50%",
                    right: 0,
                    transform: "translateX(96%) translateY(-50%) scale(0.88)",
                    opacity: 0.45,
                    zIndex: 5,
                  }}
                >
                  <div
                    className="relative w-full h-full overflow-hidden shadow-2xl"
                    style={{
                      borderRadius: "3px",
                      backgroundColor: resolvedColors[nextProject.slug] ?? FALLBACK_ACCENT,
                      filter: "brightness(0.6)",
                    }}
                  >
                    {nextProject.image && (
                      <Image
                        src={nextProject.image}
                        alt={nextProject.title}
                        fill
                        className="object-cover"
                        sizes="40vw"
                      />
                    )}
                  </div>
                </div>
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
                    style={{
                      borderRadius: "3px",
                      backgroundColor: accent,
                      filter: "brightness(0.88) contrast(1.05)",
                    }}
                  >
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="60vw"
                        priority
                      />
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
        </div>

        {/* Dot nav */}
        <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-20">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              aria-label={`Go to ${p.title}`}
              onClick={() => {
                if (lockedRef.current) return;
                const dir = i > activeIndexRef.current ? 1 : -1;
                lockedRef.current = true;
                activeIndexRef.current = i;
                setDirection(dir);
                setActiveIndex(i);
                setTimeout(() => { lockedRef.current = false; }, 350);
              }}
              className="flex items-center justify-center cursor-none"
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
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] z-20"
          style={{ backgroundColor: textColor + "20" }}
        >
          <motion.div
            className="h-full origin-left"
            style={{ backgroundColor: textColor + "50" }}
            animate={{ scaleX: (activeIndex + 1) / projects.length }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </section>
      </div>

      {/* View all overlay */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            className="fixed inset-0 z-[200] overflow-y-auto"
            style={{ backgroundColor: "#0a0a0a" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="relative min-h-full px-5 md:px-12 py-16">
              <div className="flex items-center justify-between mb-12">
                <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-white/40">
                  All Projects &mdash; {String(projects.length).padStart(2, "0")}
                </p>
                <button
                  onClick={() => setOverlayOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors duration-200 cursor-none"
                  aria-label="Close overlay"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease, delay: i * 0.07 }}
                  >
                    <Link
                      href={`/projects/${p.slug}`}
                      className="group block cursor-none"
                      data-cursor="view"
                    >
                      <div
                        className="relative w-full overflow-hidden mb-4"
                        style={{
                          aspectRatio: "4/3",
                          borderRadius: "3px",
                          backgroundColor: resolvedColors[p.slug] ?? FALLBACK_ACCENT,
                        }}
                      >
                        {p.image && (
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        )}
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-[family-name:var(--font-playfair)] text-xl text-white mb-1 group-hover:opacity-70 transition-opacity duration-200">
                            {p.title}
                          </h3>
                          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-white/40">
                            {p.category}
                          </p>
                        </div>
                        <span className="font-[family-name:var(--font-inter)] text-xs text-white/30 mt-1">
                          {p.year}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
