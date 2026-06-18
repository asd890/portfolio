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

const SECTION_HEIGHT = 100; // vh per project

export default function ScrollProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [expandingSlug, setExpandingSlug] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      Math.floor(v * projects.length),
      projects.length - 1
    );
    setDirection((prev) => {
      const d = idx > activeIndex ? 1 : -1;
      return d;
    });
    setActiveIndex(idx);
  });

  const handleClick = useCallback(
    (slug: string) => {
      setExpandingSlug(slug);
      setTimeout(() => router.push(`/projects/${slug}`), 650);
    },
    [router]
  );

  const project = projects[activeIndex];

  const slideVariants = {
    enter: (d: number) => ({
      y: d > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: (d: number) => ({
      y: d > 0 ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" as const },
    }),
  };

  const imageVariants = {
    enter: (d: number) => ({
      y: d > 0 ? 100 : -100,
      opacity: 0,
      rotate: d > 0 ? 4 : -4,
    }),
    center: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: (d: number) => ({
      y: d > 0 ? -60 : 60,
      opacity: 0,
      rotate: d > 0 ? -3 : 3,
      transition: { duration: 0.3, ease: "easeIn" as const },
    }),
  };

  return (
    <>
      {/* Scroll spacer — defines total scroll distance */}
      <div
        ref={containerRef}
        style={{ height: `${projects.length * SECTION_HEIGHT}vh` }}
        className="relative"
      >
        {/* Sticky full-screen panel */}
        <div className="sticky top-0 h-screen z-10 overflow-hidden">

          {/* Background color — always visible, animates on color change */}
          <motion.div
            className="absolute inset-0 z-0"
            animate={{ backgroundColor: project.accentColor }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          {/* Left half — text content */}
          <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col justify-end pb-16 pl-10 pr-8">

            {/* Counter */}
            <p
              className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase mb-12 transition-colors duration-500"
              style={{ color: project.textColor + "70" }}
            >
              Selected Work —{" "}
              <motion.span
                key={activeIndex}
                initial={{ opacity: 0, y: 8 }}
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
                    fontSize: "clamp(2.8rem, 6vw, 6rem)",
                  }}
                >
                  {project.title}
                </h2>

                <p
                  className="font-[family-name:var(--font-inter)] text-base leading-relaxed mb-10 max-w-xs"
                  style={{ color: project.textColor + "AA" }}
                >
                  {project.description}
                </p>

                <button
                  onClick={() => handleClick(project.slug)}
                  className="group flex items-center gap-3 font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase cursor-pointer"
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

          {/* Right half — project image */}
          <div className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center pr-12">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={project.slug}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-md cursor-pointer group"
                onClick={() => handleClick(project.slug)}
              >
                <div
                  className="relative w-full overflow-hidden rounded-[2px] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{
                    aspectRatio: "4/3",
                    backgroundColor: project.accentColor,
                    filter: "brightness(0.82) contrast(1.05)",
                  }}
                >
                  {/* Large initial */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-[family-name:var(--font-playfair)] italic select-none"
                      style={{
                        fontSize: "clamp(5rem, 14vw, 12rem)",
                        color: project.textColor + "15",
                      }}
                    >
                      {project.title[0]}
                    </span>
                  </div>

                  {/* Bottom strip */}
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
                    <motion.span
                      className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{ color: project.textColor }}
                    >
                      View →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
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

          {/* Bottom progress bar */}
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

      {/* Page transition wipe overlay on click */}
      <AnimatePresence>
        {expandingSlug && (
          <motion.div
            className="fixed inset-0 z-[200]"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }}
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
