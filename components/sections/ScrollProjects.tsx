"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import { useNavColor } from "@/contexts/NavColorContext";
import { getContrastColor, extractImageColor } from "@/lib/colorUtils";

const SECTION_HEIGHT = 100; // vh per project slot
const FALLBACK_ACCENT = "#888888";

function useResolvedColors() {
  const [colors, setColors] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      projects.map((p) => [p.slug, p.accentColor ?? FALLBACK_ACCENT])
    )
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

function ProjectCard({
  project,
  resolvedAccent,
  position,
  onClick,
}: {
  project: (typeof projects)[0];
  resolvedAccent: string;
  position: -1 | 0 | 1;
  onClick: () => void;
}) {
  const isCurrent = position === 0;
  const yPercent = position * 96;
  const scale = isCurrent ? 1 : 0.88;
  const opacity = isCurrent ? 1 : 0.55;

  return (
    <motion.div
      className={isCurrent ? "cursor-none group" : "pointer-events-none"}
      onClick={isCurrent ? onClick : undefined}
      animate={{ y: `${yPercent}%`, scale, opacity }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "absolute", width: "100%", zIndex: isCurrent ? 10 : 5 }}
    >
      <div
        className="relative w-full overflow-hidden shadow-2xl"
        style={{
          aspectRatio: "4/3",
          borderRadius: "3px",
          backgroundColor: resolvedAccent,
          filter: isCurrent ? "brightness(0.88) contrast(1.05)" : "brightness(0.7)",
          transition: "filter 0.3s",
        }}
      >
        {project.image ? (
          <Image src={project.image} alt={project.title} fill className="object-cover" sizes="50vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-[family-name:var(--font-playfair)] italic select-none"
              style={{ fontSize: "clamp(4rem,12vw,10rem)", color: getContrastColor(resolvedAccent) + "15" }}
            >
              {project.title[0]}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLenis = () => (window as any).__lenis as { scrollTo: (target: number, opts?: Record<string, unknown>) => void } | undefined;

export default function ScrollProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [expandingSlug, setExpandingSlug] = useState<string | null>(null);

  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  const resolvedColors = useResolvedColors();
  const { setAccentColor } = useNavColor();

  // Keep accent colour in sync with active project
  useEffect(() => {
    const color = resolvedColors[projects[activeIndex].slug];
    setAccentColor(color ?? null);
  }, [activeIndex, resolvedColors, setAccentColor]);

  // Clear accent when section is fully out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) setAccentColor(null); },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setAccentColor]);

  const navigate = useCallback((dir: 1 | -1): boolean => {
    if (isTransitioningRef.current) return false;
    const curr = activeIndexRef.current;
    const next = curr + dir;
    if (next < 0 || next >= projects.length) return false;

    isTransitioningRef.current = true;
    activeIndexRef.current = next;
    setDirection(dir);
    setActiveIndex(next);

    // Sync page scroll position only at the boundary projects so the sticky
    // section can exit cleanly when the user scrolls past the first/last item.
    const el = containerRef.current;
    if (el) {
      const maxScroll = el.offsetHeight - window.innerHeight;
      if (next === projects.length - 1) {
        // At last project — one more scroll down will exit the section
        getLenis()?.scrollTo(el.offsetTop + maxScroll, { immediate: true });
      } else if (next === 0) {
        // At first project — one more scroll up will exit the section
        getLenis()?.scrollTo(el.offsetTop, { immediate: true });
      }
    }

    setTimeout(() => { isTransitioningRef.current = false; }, 600);
    return true;
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const el = containerRef.current;
      if (!el) return;

      // Only intercept while the container spans the full viewport (sticky engaged)
      const rect = el.getBoundingClientRect();
      if (rect.top > 0 || rect.bottom < window.innerHeight) return;

      const dir = (e.deltaY > 0 ? 1 : -1) as 1 | -1;
      const curr = activeIndexRef.current;

      // At boundaries let Lenis scroll the page naturally (section exits)
      if (dir === -1 && curr === 0) return;
      if (dir === 1 && curr === projects.length - 1) return;

      // Stop the browser from scrolling the page
      e.preventDefault();
      // Tell Lenis not to process this event (it checks this flag explicitly)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any).lenisStopPropagation = true;

      // Navigate only when the previous transition has finished
      if (!isTransitioningRef.current) {
        navigate(dir);
      }
    };

    // Capture phase — fires before Lenis's bubble-phase listener on <html>
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", handleWheel, true);
  }, [navigate]);

  const handleClick = useCallback(
    (slug: string) => {
      setExpandingSlug(slug);
      setTimeout(() => router.push(`/projects/${slug}`), 650);
    },
    [router]
  );

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

  return (
    <>
      <div id="work" ref={containerRef} style={{ height: `${projects.length * SECTION_HEIGHT}vh` }} className="relative">
        <div className="sticky top-0 h-screen z-10 overflow-hidden">

          {/* Background */}
          <motion.div
            className="absolute inset-0 z-0"
            animate={{ backgroundColor: accent }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          {/* Left — text */}
          <div className="absolute bottom-0 left-0 right-0 h-[48%] md:h-auto md:inset-y-0 md:right-auto md:w-1/2 flex flex-col justify-center pl-5 pr-5 pb-10 md:pl-12 md:pr-8 md:pb-0 z-10">

            <p className="font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase mb-6 md:mb-10" style={{ color: textColor + "60" }}>
              Selected Work —{" "}
              <motion.span key={activeIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="inline-block">
                {String(activeIndex + 1).padStart(2, "0")}
              </motion.span>{" "}
              / {String(projects.length).padStart(2, "0")}
            </p>

            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div key={project.slug} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">

                <div className="flex items-center gap-4 mb-4">
                  <span className="font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase" style={{ color: textColor + "45" }}>
                    {project.year}
                  </span>
                  <span style={{ color: textColor + "25" }}>·</span>
                  <span className="font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase" style={{ color: textColor + "60" }}>
                    {project.category}
                  </span>
                </div>

                <h2
                  className="font-[family-name:var(--font-playfair)] leading-[0.88] mb-6"
                  style={{ color: textColor, fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)" }}
                >
                  {project.title}
                </h2>

                <p className="hidden md:block font-[family-name:var(--font-inter)] text-base leading-relaxed mb-10 max-w-xs" style={{ color: textColor + "AA" }}>
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
                <ProjectCard key={`prev-${prevProject.slug}`} project={prevProject} resolvedAccent={resolvedColors[prevProject.slug] ?? FALLBACK_ACCENT} position={-1} onClick={() => {}} />
              )}
              {nextProject && (
                <ProjectCard key={`next-${nextProject.slug}`} project={nextProject} resolvedAccent={resolvedColors[nextProject.slug] ?? FALLBACK_ACCENT} position={1} onClick={() => {}} />
              )}

              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={`current-${project.slug}`}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ y: d > 0 ? "40%" : "-40%", opacity: 0, rotate: d > 0 ? 2 : -8, scale: 0.9 }),
                    center: { y: "0%", opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
                    exit: (d: number) => ({ y: d > 0 ? "-40%" : "40%", opacity: 0, rotate: d > 0 ? -8 : 2, scale: 0.9, transition: { duration: 0.35, ease: "easeIn" as const } }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 cursor-none group"
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
                        <span className="font-[family-name:var(--font-playfair)] italic select-none" style={{ fontSize: "clamp(4rem,12vw,10rem)", color: textColor + "15" }}>
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
                onClick={() => {
                  if (isTransitioningRef.current) return;
                  const dir = (i > activeIndexRef.current ? 1 : -1) as 1 | -1;
                  isTransitioningRef.current = true;
                  activeIndexRef.current = i;
                  setDirection(dir);
                  setActiveIndex(i);
                  const el = containerRef.current;
                  if (el) {
                    const maxScroll = el.offsetHeight - window.innerHeight;
                    const targetY = el.offsetTop + maxScroll * (i / (projects.length - 1));
                    getLenis()?.scrollTo(targetY, { immediate: true });
                  }
                  setTimeout(() => { isTransitioningRef.current = false; }, 600);
                }}
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
            <motion.div className="h-full origin-left" style={{ backgroundColor: textColor + "50" }} animate={{ scaleX: (activeIndex + 1) / projects.length }} transition={{ duration: 0.5, ease: "easeOut" }} />
          </div>
        </div>
      </div>

      {/* Page transition wipe */}
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
