"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { projects, type Project } from "@/lib/projects";

interface CardConfig {
  x: string;
  y: string;
  rotate: number;
  scale: number;
  zIndex: number;
  yFactor: number; // how fast it scrolls
}

const cardConfigs: CardConfig[] = [
  { x: "5%",  y: "8%",   rotate: -3,  scale: 1,    zIndex: 3, yFactor: -0.08 },
  { x: "55%", y: "4%",   rotate: 4,   scale: 0.82, zIndex: 2, yFactor: 0.12  },
  { x: "28%", y: "42%",  rotate: 1,   scale: 0.95, zIndex: 4, yFactor: -0.05 },
  { x: "70%", y: "45%",  rotate: -5,  scale: 0.75, zIndex: 1, yFactor: 0.18  },
  { x: "12%", y: "68%",  rotate: 2,   scale: 0.88, zIndex: 2, yFactor: -0.1  },
];

function ProjectCard({
  project,
  config,
  scrollY,
  containerHeight,
  onClick,
}: {
  project: Project;
  config: CardConfig;
  scrollY: ReturnType<typeof useMotionValue<number>>;
  containerHeight: number;
  onClick: (project: Project, rect: DOMRect) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const y = useTransform(
    scrollY,
    [0, containerHeight],
    [0, containerHeight * config.yFactor]
  );

  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  const handleClick = useCallback(() => {
    if (cardRef.current) {
      onClick(project, cardRef.current.getBoundingClientRect());
    }
  }, [project, onClick]);

  const cardWidth =
    config.scale >= 0.95
      ? "w-[340px]"
      : config.scale >= 0.85
      ? "w-[280px]"
      : "w-[220px]";

  return (
    <motion.div
      ref={cardRef}
      className={`absolute cursor-pointer ${cardWidth}`}
      style={{
        left: config.x,
        top: config.y,
        rotate: config.rotate,
        scale: config.scale,
        zIndex: hovered ? 10 : config.zIndex,
        y: springY,
      }}
      whileHover={{ scale: config.scale * 1.04 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden rounded-sm"
        style={{ aspectRatio: "4/3" }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            backgroundColor: project.accentColor,
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        {/* Placeholder image layer */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-[family-name:var(--font-playfair)] italic text-white/20 text-6xl select-none"
            style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}
          >
            {project.title[0]}
          </span>
        </div>

        {/* Overlay on hover */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
        >
          <span className="font-[family-name:var(--font-inter)] text-white text-xs tracking-widest uppercase">
            View Project →
          </span>
        </motion.div>
      </div>

      {/* Caption */}
      <div className="mt-3 px-1">
        <p className="font-[family-name:var(--font-inter)] text-[0.65rem] tracking-widest uppercase text-[#0a0a0a]/40 mb-1">
          {project.category}
        </p>
        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#0a0a0a] leading-tight">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );
}

export default function FloatingProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(2000);
  const [expandingProject, setExpandingProject] = useState<{
    project: Project;
    rect: DOMRect;
  } | null>(null);
  const router = useRouter();

  const { scrollY } = useScroll();

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const handleProjectClick = useCallback(
    (project: Project, rect: DOMRect) => {
      setExpandingProject({ project, rect });
      setTimeout(() => {
        router.push(`/projects/${project.slug}`);
      }, 700);
    },
    [router]
  );

  const sectionScrollY = useMotionValue<number>(0);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => {
      if (containerRef.current) {
        const offsetTop = containerRef.current.offsetTop;
        sectionScrollY.set(Math.max(0, v - offsetTop));
      }
    });
    return unsubscribe;
  }, [scrollY, sectionScrollY]);

  // Background color transition
  const bgOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.9], [0, 1, 0]);

  return (
    <>
      {/* Background transition overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: bgOpacity, backgroundColor: "#f0ece4" }}
      />

      <section
        ref={containerRef}
        className="relative"
        style={{ height: "220vh" }}
      >
        {/* Section label */}
        <div className="sticky top-0 pt-32 pb-8 px-8 pointer-events-none z-10">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30"
          >
            Selected Work
          </motion.p>
        </div>

        {/* Floating cards */}
        <div className="absolute inset-0 overflow-hidden">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              config={cardConfigs[i % cardConfigs.length]}
              scrollY={sectionScrollY}
              containerHeight={containerHeight}
              onClick={handleProjectClick}
            />
          ))}
        </div>

        {/* Large background text */}
        <div className="absolute bottom-32 left-8 pointer-events-none select-none">
          <p className="font-[family-name:var(--font-playfair)] text-[clamp(5rem,18vw,20rem)] leading-none text-[#0a0a0a]/[0.03] font-normal">
            Work
          </p>
        </div>
      </section>

      {/* Expanding overlay */}
      <AnimatePresence>
        {expandingProject && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none"
            initial={{
              clipPath: `inset(${expandingProject.rect.top}px ${window.innerWidth - expandingProject.rect.right}px ${window.innerHeight - expandingProject.rect.bottom}px ${expandingProject.rect.left}px round 4px)`,
            }}
            animate={{
              clipPath: `inset(0px 0px 0px 0px round 0px)`,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            style={{ backgroundColor: expandingProject.project.accentColor }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
