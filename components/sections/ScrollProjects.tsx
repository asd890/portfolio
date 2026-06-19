"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import { useNavColor } from "@/contexts/NavColorContext";
import { getContrastColor, extractImageColor } from "@/lib/colorUtils";

const FALLBACK_ACCENT = "#888888";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLenis = () => (window as any).__lenis as
  | { scrollTo: (target: number, opts?: Record<string, unknown>) => void }
  | undefined;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [expandingSlug, setExpandingSlug] = useState<string | null>(null);

  const activeIndexRef = useRef(0);
  const lockedRef = useRef(false);

  const resolvedColors = useResolvedColors();
  const { setAccentColor } = useNavColor();

  // Keep accent in sync
  useEffect(() => {
    setAccentColor(resolvedColors[projects[activeIndex].slug] ?? null);
  }, [activeIndex, resolvedColors, setAccentColor]);

  useEffect(() => {
    const el = document.getElementById("work");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (!e.isIntersecting) setAccentColor(null); },
      { threshold: 0 }
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

    // Keep Lenis scroll position proportional so the section exits cleanly:
    // project 0 → section top, project n-1 → section bottom.
    const el = containerRef.current;
    if (el) {
      const maxScroll = el.offsetHeight - window.innerHeight;
      const t = (projects.length > 1) ? next / (projects.length - 1) : 0;
      getLenis()?.scrollTo(el.offsetTop + t * maxScroll, { immediate: true });
    }

    setTimeout(() => { lockedRef.current = false; }, 420);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const el = containerRef.current;
      if (!el) return;

      // Only act while the sticky panel fills the viewport
      const { top, bottom } = el.getBoundingClientRect();
      if (top > 1 || bottom < window.innerHeight - 1) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const curr = activeIndexRef.current;

      // At first project scrolling up, or last project scrolling down:
      // let Lenis handle so the page scrolls naturally out of the section.
      if (dir === -1 && curr === 0) return;
      if (dir === 1 && curr === projects.length - 1) return;

      // Inside the section: own the scroll entirely.
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any).lenisStopPropagation = true;

      navigate(dir);
    };

    // Capture phase so we fire before Lenis's bubble-phase listener.
    // passive:false so preventDefault() is honoured.
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", handleWheel, true);
  }, [navigate]);

  const handleClick = useCallback((slug: string) => {
    setExpandingSlug(slug);
    setTimeout(() => router.push(`/projects/${slug}`), 650);
  }, [router]);

  const scrollTo = useCallback((i: number) => {
    if (lockedRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const maxScroll = el.offsetHeight - window.innerHeight;
    const t = (projects.length > 1) ? i / (projects.length - 1) : 0;
    lockedRef.current = true;
    activeIndexRef.current = i;
    setDirection(i > activeIndexRef.current ? 1 : -1);
    setActiveIndex(i);
    getLenis()?.scrollTo(el.offsetTop + t * maxScroll, { immediate: true });
    setTimeout(() => { lockedRef.current = false; }, 420);
  }, []);

  const project = projects[activeIndex];
  const accent = resolvedColors[project.slug] ?? FALLBACK_ACCENT;
  const textColor = getContrastColor(accent);
  const prevProject = activeIndex > 0 ? projects[activeIndex - 1] : null;
  const nextProject = activeIndex < projects.length - 1 ? projects[activeIndex + 1] : null;

  const slideVariants = {
    enter: (d: number) => ({ y: d > 0 ? 50 : -50, opacity: 0 }),
    center: {
      y: 0, opacity: 1,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: (d: number) => ({
      y: d > 0 ? -30 : 30, opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" as const },
    }),
  };

  const cardVariants = {
    enter: (d: number) => ({ y: d > 0 ? "40%" : "-40%", opacity: 0, rotate: d > 0 ? 2 : -8, scale: 0.9 }),
    center: {
      y: "0%", opacity: 1, rotate: 0, scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: (d: number) => ({
      y: d > 0 ? "-40%" : "40%", opacity: 0, rotate: d > 0 ? -8 : 2, scale: 0.9,
      transition: { duration: 0.28, ease: "easeIn" as const },
    }),
  };

  return (
    <>
      {/*
        Sticky 500vh container: the page scrolls through its full height while
        the inner panel stays pinned to the viewport. The project index is driven
        entirely by wheel events — not by scrollYProgress — so fast scrolling
        can never jump multiple indices in one frame.
      */}
      <div
        id="work"
        ref={containerRef}
        style={{ height: `${projects.length * 100}vh`, position: "relative" }}
      >
        <div
          style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
        >
          {/* Background */}
          <motion.div
            className="absolute inset-0"
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
                  <span className="font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase" style={{ color: textColor + "45" }}>{project.year}</span>
                  <span style={{ color: textColor + "25" }}>·</span>
                  <span className="font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase" style={{ color: textColor + "60" }}>{project.category}</span>
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
                <motion.div
                  animate={{ y: "-96%", scale: 0.88, opacity: 0.55 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "absolute", width: "100%", zIndex: 5 }}
                  className="pointer-events-none"
                >
                  <div className="relative w-full overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3", borderRadius: "3px", backgroundColor: resolvedColors[prevProject.slug] ?? FALLBACK_ACCENT, filter: "brightness(0.7)" }}>
                    {prevProject.image && <Image src={prevProject.image} alt={prevProject.title} fill className="object-cover" sizes="50vw" />}
                  </div>
                </motion.div>
              )}
              {nextProject && (
                <motion.div
                  animate={{ y: "96%", scale: 0.88, opacity: 0.55 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "absolute", width: "100%", zIndex: 5 }}
                  className="pointer-events-none"
                >
                  <div className="relative w-full overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3", borderRadius: "3px", backgroundColor: resolvedColors[nextProject.slug] ?? FALLBACK_ACCENT, filter: "brightness(0.7)" }}>
                    {nextProject.image && <Image src={nextProject.image} alt={nextProject.title} fill className="object-cover" sizes="50vw" />}
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
                  <div className="relative w-full h-full overflow-hidden shadow-2xl" style={{ borderRadius: "3px", backgroundColor: accent, filter: "brightness(0.88) contrast(1.05)" }}>
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
              <button key={p.slug} aria-label={`Go to ${p.title}`} onClick={() => scrollTo(i)} className="flex items-center justify-center" style={{ width: 20, height: 20 }}>
                <motion.span
                  className="block rounded-full"
                  animate={{ width: i === activeIndex ? 8 : 4, height: i === activeIndex ? 8 : 4, backgroundColor: i === activeIndex ? textColor : textColor + "40" }}
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
