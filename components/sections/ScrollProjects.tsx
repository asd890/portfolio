"use client";

import { useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import { useNavColor } from "@/contexts/NavColorContext";

const SECTION_HEIGHT = 100; // vh per project

function ProjectCard({
  project,
  position, // -1 = prev, 0 = current, 1 = next
  onClick,
}: {
  project: (typeof projects)[0];
  position: -1 | 0 | 1;
  onClick: () => void;
}) {
  const isCurrent = position === 0;

  const yPercent = position * 96; // how far prev/next are offset
  const rotate = 0;
  const scale = isCurrent ? 1 : 0.88;
  const opacity = isCurrent ? 1 : 0.55;
  const zIndex = isCurrent ? 10 : 5;

  return (
    <motion.div
      className={isCurrent ? "cursor-pointer group" : "pointer-events-none"}
      onClick={isCurrent ? onClick : undefined}
      animate={{ y: `${yPercent}%`, rotate, scale, opacity }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute",
        width: "100%",
        zIndex,
      }}
    >
      <div
        className="relative w-full overflow-hidden shadow-2xl"
        style={{
          aspectRatio: "4/3",
          borderRadius: "3px",
          backgroundColor: project.accentColor,
          filter: isCurrent
            ? "brightness(0.82) contrast(1.05)"
            : "brightness(0.7) contrast(1.0)",
          transition: "filter 0.3s",
        }}
      >
        {/* Large initial letter */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-[family-name:var(--font-playfair)] italic select-none"
            style={{
              fontSize: "clamp(4rem, 12vw, 10rem)",
              color: project.textColor + "15",
            }}
          >
            {project.title[0]}
          </span>
        </div>

        {/* Bottom strip — only on current */}
        {isCurrent && (
          <div
            className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-end justify-between"
            style={{
              background: `linear-gradient(to top, ${project.accentColor} 0%, transparent 100%)`,
              opacity: 0.9,
            }}
          >
            <span
              className="font-[family-name:var(--font-inter)] text-xs tracking-widest"
              style={{ color: project.textColor + "80" }}
            >
              {project.year}
            </span>
            <span
              className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ color: project.textColor }}
            >
              View →
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ScrollProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [expandingSlug, setExpandingSlug] = useState<string | null>(null);

  const { setAccentColor } = useNavColor();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(Math.floor(v * projects.length), projects.length - 1);
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
    // publish accent color so navbar can react
    if (v > 0 && v < 1) {
      setAccentColor(projects[idx].accentColor);
    } else {
      setAccentColor(null);
    }
  });

  const handleClick = useCallback(
    (slug: string) => {
      setExpandingSlug(slug);
      setTimeout(() => router.push(`/projects/${slug}`), 650);
    },
    [router]
  );

  const project = projects[activeIndex];
  const prevProject = activeIndex > 0 ? projects[activeIndex - 1] : null;
  const nextProject =
    activeIndex < projects.length - 1 ? projects[activeIndex + 1] : null;

  const slideVariants = {
    enter: (d: number) => ({ y: d > 0 ? 50 : -50, opacity: 0 }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    exit: (d: number) => ({
      y: d > 0 ? -35 : 35,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" as const },
    }),
  };

  return (
    <>
      {/* Scroll spacer */}
      <div
        ref={containerRef}
        style={{ height: `${projects.length * SECTION_HEIGHT}vh` }}
        className="relative"
      >
        {/* Sticky full-screen panel */}
        <div className="sticky top-0 h-screen z-10 overflow-hidden">

          {/* Background */}
          <motion.div
            className="absolute inset-0 z-0"
            animate={{ backgroundColor: project.accentColor }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          {/* Left — text, vertically centered */}
          <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col justify-center pl-12 pr-8 z-10">

            {/* Counter */}
            <p
              className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase mb-10"
              style={{ color: project.textColor + "60" }}
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

            {/* Animated project info */}
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={project.slug}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <p
                  className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase mb-4"
                  style={{ color: project.textColor + "60" }}
                >
                  {project.category}
                </p>

                <h2
                  className="font-[family-name:var(--font-playfair)] leading-[0.88] mb-6"
                  style={{
                    color: project.textColor,
                    fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)",
                  }}
                >
                  {project.title}
                </h2>

                <p
                  className="font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-10 max-w-xs"
                  style={{ color: project.textColor + "AA" }}
                >
                  {project.description}
                </p>

                <button
                  onClick={() => handleClick(project.slug)}
                  className="group flex items-center gap-3 font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase cursor-none"
                  data-cursor="view"
                  style={{ color: project.textColor }}
                >
                  <span>Open Case Study</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — stacked tilted cards */}
          <div className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center overflow-hidden">
            {/* Card stack container — sized to ~55% of the panel width */}
            <div
              className="relative"
              style={{ width: "90%", aspectRatio: "4/3" }}
            >
              {/* Previous card — peeks from top */}
              {prevProject && (
                <ProjectCard
                  key={`prev-${prevProject.slug}`}
                  project={prevProject}
                  position={-1}
                  onClick={() => {}}
                />
              )}

              {/* Next card — peeks from bottom */}
              {nextProject && (
                <ProjectCard
                  key={`next-${nextProject.slug}`}
                  project={nextProject}
                  position={1}
                  onClick={() => {}}
                />
              )}

              {/* Current card — centered and prominent */}
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={`current-${project.slug}`}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({
                      y: d > 0 ? "40%" : "-40%",
                      opacity: 0,
                      rotate: d > 0 ? 2 : -8,
                      scale: 0.9,
                    }),
                    center: {
                      y: "0%",
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                      transition: {
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                      },
                    },
                    exit: (d: number) => ({
                      y: d > 0 ? "-40%" : "40%",
                      opacity: 0,
                      rotate: d > 0 ? -8 : 2,
                      scale: 0.9,
                      transition: { duration: 0.35, ease: "easeIn" as const },
                    }),
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
                    style={{
                      borderRadius: "3px",
                      backgroundColor: project.accentColor,
                      filter: "brightness(0.82) contrast(1.05)",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="font-[family-name:var(--font-playfair)] italic select-none"
                        style={{
                          fontSize: "clamp(4rem, 12vw, 10rem)",
                          color: project.textColor + "15",
                        }}
                      >
                        {project.title[0]}
                      </span>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-end justify-between"
                      style={{
                        background: `linear-gradient(to top, ${project.accentColor} 0%, transparent 100%)`,
                        opacity: 0.9,
                      }}
                    >
                      <span
                        className="font-[family-name:var(--font-inter)] text-xs tracking-widest"
                        style={{ color: project.textColor + "80" }}
                      >
                        {project.year}
                      </span>
                      <span
                        className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ color: project.textColor }}
                      >
                        View →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dot navigation — right edge */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                aria-label={`Go to ${p.title}`}
                onClick={() => {
                  if (!containerRef.current) return;
                  const top = containerRef.current.offsetTop;
                  const segH =
                    containerRef.current.offsetHeight / projects.length;
                  window.scrollTo({
                    top: top + segH * i + segH * 0.5,
                    behavior: "smooth",
                  });
                }}
                className="flex items-center justify-center"
                style={{ width: 20, height: 20 }}
              >
                <motion.span
                  className="block rounded-full"
                  animate={{
                    width: i === activeIndex ? 8 : 4,
                    height: i === activeIndex ? 8 : 4,
                    backgroundColor:
                      i === activeIndex
                        ? project.textColor
                        : project.textColor + "40",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ backgroundColor: project.textColor + "20" }}
          >
            <motion.div
              className="h-full origin-left"
              style={{ backgroundColor: project.textColor + "50" }}
              animate={{ scaleX: (activeIndex + 1) / projects.length }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
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
            transition={{
              duration: 0.65,
              ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
            }}
            style={{
              backgroundColor:
                projects.find((p) => p.slug === expandingSlug)?.accentColor ??
                "#0a0a0a",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
