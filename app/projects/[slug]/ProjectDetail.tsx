"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import V2Nav from "@/components/v2/V2Nav";
import V2Contact from "@/components/v2/V2Contact";
import type { Project, ContentBlock, Act } from "@/lib/projects";
import { getContrastColor } from "@/lib/colorUtils";

const ACCENT = "#3631F5";
const CELL = 40;
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

function youtubeEmbedUrl(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
      <span className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/45">
        {children}
      </span>
    </div>
  );
}

function HeroVideo({
  video,
  title,
}: {
  video: NonNullable<Project["heroVideo"]>;
  title: string;
}) {
  const [reduced, setReduced] = useState(false);
  const isMobile = useRef(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthQuery = window.matchMedia("(max-aspect-ratio: 1/1)");
    isMobile.current = widthQuery.matches;
    setReduced(motionQuery.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    motionQuery.addEventListener("change", onChange);
    return () => motionQuery.removeEventListener("change", onChange);
  }, []);

  const poster = isMobile.current ? video.posterMobile : video.poster;

  // Reduced motion gets the still and never downloads the video at all.
  if (reduced) {
    return (
      <Image src={poster} alt={title} fill className="object-cover" priority sizes="100vw" />
    );
  }

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={title}
    >
      {/* Chosen by shape, not width. The hero is full viewport height with
          object-cover, so a portrait window crops a 16:9 render savagely however
          wide the screen is. Any viewport taller than it is wide gets the 4:5 cut. */}
      <source src={video.mobile} media="(max-aspect-ratio: 1/1)" type="video/mp4" />
      <source src={video.desktop} type="video/mp4" />
    </video>
  );
}

function Acts({ acts }: { acts: Act[] }) {
  return (
    <>
      {acts.map((act) => (
        <section
          key={act.label}
          className="mx-auto max-w-5xl px-6 py-16 md:py-24 border-t border-black/5"
        >
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Eyebrow>{act.label}</Eyebrow>
          </motion.div>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeUp}
            className="font-[family-name:var(--font-inter)] font-semibold tracking-tight text-[#0a0a0a]"
            style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)", lineHeight: 1.1 }}
          >
            {act.title}
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeUp}
            className="mt-5 max-w-3xl font-[family-name:var(--font-inter)] text-xl md:text-2xl leading-relaxed text-[#0a0a0a]/80"
          >
            {act.goalLead}
          </motion.p>

          <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-5">
            {act.goals.map((goal, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-5%" }}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease } },
                }}
                className="rounded-3xl bg-[#eceae5] p-6"
              >
                <span
                  className="mb-4 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
                <p className="font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#0a0a0a]/70">
                  {goal}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeUp}
            className="mt-14 md:mt-20 max-w-3xl"
          >
            <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-[#0a0a0a]/35 mb-4">
              Process
            </p>
            <p className="font-[family-name:var(--font-inter)] text-base md:text-lg leading-relaxed text-[#0a0a0a]/75">
              {act.process}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeUp}
            className="mt-10 max-w-3xl rounded-3xl bg-[#eceae5] p-7 md:p-8"
            style={{ borderLeft: `3px solid ${ACCENT}` }}
          >
            <p
              className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase mb-3"
              style={{ color: ACCENT }}
            >
              Outcome
            </p>
            <p className="font-[family-name:var(--font-inter)] text-lg md:text-xl leading-relaxed text-[#0a0a0a]/85">
              {act.outcome}
            </p>
          </motion.div>
        </section>
      ))}
    </>
  );
}

function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 md:py-24 space-y-14 md:space-y-20">
      {blocks.map((block, i) => {
        if (block.type === "text") {
          return (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
              className="max-w-2xl"
            >
              {block.heading && (
                <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/35 mb-4">
                  {block.heading}
                </p>
              )}
              <p className="font-[family-name:var(--font-inter)] text-xl md:text-2xl leading-relaxed text-[#0a0a0a]/80">
                {block.body}
              </p>
            </motion.div>
          );
        }

        if (block.type === "image") {
          return (
            <motion.figure
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
            >
              <div className="relative w-full overflow-hidden rounded-3xl" style={{ aspectRatio: "16/9" }}>
                <Image src={block.src} alt={block.caption ?? ""} fill className="object-cover" sizes="100vw" />
              </div>
              {block.caption && (
                <figcaption className="mt-3 font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/40 tracking-wide">
                  {block.caption}
                </figcaption>
              )}
            </motion.figure>
          );
        }

        if (block.type === "images") {
          return (
            <motion.figure
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
            >
              <div
                className={`grid gap-4 grid-cols-1 ${block.srcs.length >= 2 ? "sm:grid-cols-2" : ""} ${block.srcs.length >= 3 ? "md:grid-cols-3" : ""}`}
              >
                {block.srcs.map((src, j) => (
                  <div key={j} className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
                    <Image src={src} alt={block.caption ?? `Image ${j + 1}`} fill className="object-cover" sizes="50vw" />
                  </div>
                ))}
              </div>
              {block.caption && (
                <figcaption className="mt-3 font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/40 tracking-wide">
                  {block.caption}
                </figcaption>
              )}
            </motion.figure>
          );
        }

        if (block.type === "video") {
          const embedUrl = youtubeEmbedUrl(block.url);
          return (
            <motion.figure
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
            >
              <div className="relative w-full overflow-hidden rounded-3xl bg-black/5" style={{ aspectRatio: "16/9" }}>
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={block.caption ?? "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <video src={block.url} controls className="absolute inset-0 w-full h-full" />
                )}
              </div>
              {block.caption && (
                <figcaption className="mt-3 font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/40 tracking-wide">
                  {block.caption}
                </figcaption>
              )}
            </motion.figure>
          );
        }

        return null;
      })}
    </section>
  );
}

export default function ProjectDetail({ project }: { project: Project }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const accent = project.accentColor ?? "#888888";
  const textColor = getContrastColor(accent);
  const heroSrc = project.heroImage ?? project.image ?? null;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const meta = [
    { label: "Role", value: project.role },
    { label: "Timeline", value: project.timeline },
    { label: "Team", value: project.team },
    { label: "Industry", value: project.industry },
    { label: "Year", value: project.year },
    { label: "Tools", value: project.tools.join(", ") },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f0ec" }}>
      <V2Nav />

      {/* Cinematic hero — kept, but titled in Inter */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: imageY, scale: 1.12, transformOrigin: "center" }}>
          {project.heroVideo ? (
            <HeroVideo video={project.heroVideo} title={project.title} />
          ) : heroSrc ? (
            <Image src={heroSrc} alt={project.title} fill className="object-cover" priority sizes="100vw" />
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: accent }} />
          )}
        </motion.div>

        {/* Curtain reveal */}
        <motion.div
          className="absolute inset-0 z-10 origin-bottom"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          style={{ backgroundColor: accent }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        {/* Bottom-left text — v2 pills + Inter title */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-30 mx-auto max-w-5xl px-6 pb-10 md:pb-14"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.6 } } }}
        >
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mb-5">
            <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 font-[family-name:var(--font-inter)] text-[11px] text-white/90">
              {project.year}
            </span>
            <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 font-[family-name:var(--font-inter)] text-[11px] text-white/90">
              {project.industry}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-[family-name:var(--font-inter)] font-semibold tracking-tight text-white"
            style={{ fontSize: "clamp(2.6rem, 7vw, 6rem)", lineHeight: 1.02 }}
          >
            {project.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 font-[family-name:var(--font-inter)] text-white/70 max-w-xl leading-relaxed"
          >
            {project.description}
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="hidden md:flex absolute bottom-10 right-10 z-30 items-center gap-3"
          style={{ opacity: cueOpacity }}
        >
          <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-white/40">
            Scroll
          </span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}
          >
            ↓
          </motion.span>
        </motion.div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={fadeUp}>
          <Eyebrow>Overview</Eyebrow>
          <p className="font-[family-name:var(--font-inter)] text-xl md:text-2xl leading-relaxed text-[#0a0a0a]">
            {project.fullDescription}
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={fadeUp}
          className="grid grid-cols-2 gap-x-8 gap-y-7 content-start md:pt-1"
        >
          {meta.map(({ label, value }) => (
            <div key={label}>
              <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-[#0a0a0a]/35 mb-1.5">
                {label}
              </p>
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/80">{value}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* The premise — the thesis paragraph on a story-first page, else the challenge */}
      {(project.thesis || project.problem) && (
        <section className="mx-auto max-w-5xl px-6 py-16 md:py-24 border-t border-black/5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Eyebrow>{project.thesis ? "The real problem" : "The challenge"}</Eyebrow>
          </motion.div>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeUp}
            className="font-[family-name:var(--font-inter)] font-medium tracking-tight text-[#0a0a0a] max-w-4xl whitespace-pre-line"
            style={{ fontSize: "clamp(1.5rem, 3.4vw, 2.6rem)", lineHeight: 1.22 }}
          >
            {project.thesis || project.problem}
          </motion.p>
        </section>
      )}

      {/* Acts */}
      {project.acts && project.acts.length > 0 && <Acts acts={project.acts} />}

      {/* Process */}
      {project.process && project.process.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16 md:py-24 border-t border-black/5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Eyebrow>Process</Eyebrow>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {project.process.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-5%" }}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease } },
                }}
                className="flex gap-4 rounded-3xl bg-[#eceae5] p-6"
              >
                <span
                  className="font-[family-name:var(--font-inter)] font-semibold text-lg flex-shrink-0 leading-none"
                  style={{ color: ACCENT }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/70 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Rich content blocks */}
      {project.content && project.content.length > 0 && (
        <div className="border-t border-black/5">
          <ContentBlocks blocks={project.content} />
        </div>
      )}

      {/* Solution, or the closing line on a story-first page — accent card echoing the home contact section */}
      {(project.closing || project.solution) && (
      <section className="px-6 py-8 md:py-12 border-t border-black/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={fadeUp}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] p-8 md:p-14"
          style={{ backgroundColor: accent }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)",
              backgroundSize: `${CELL}px ${CELL}px`,
              maskImage: "radial-gradient(120% 120% at 80% 0%, #000 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(120% 120% at 80% 0%, #000 40%, transparent 100%)",
            }}
          />
          <div className="relative">
            <p
              className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase mb-5"
              style={{ color: textColor, opacity: 0.6 }}
            >
              {project.closing ? "In closing" : "Solution"}
            </p>
            <p
              className="font-[family-name:var(--font-inter)] font-medium tracking-tight max-w-2xl"
              style={{ color: textColor, fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)", lineHeight: 1.2 }}
            >
              {project.closing || project.solution}
            </p>
          </div>
        </motion.div>
      </section>
      )}

      {/* Outcomes */}
      {project.outcomes && project.outcomes.length > 0 && (
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <Eyebrow>Outcomes</Eyebrow>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {project.outcomes.map((o, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease } },
              }}
              className="rounded-3xl bg-[#eceae5] p-7"
            >
              <p
                className="font-[family-name:var(--font-inter)] font-semibold tracking-tight leading-none mb-2"
                style={{ color: accent, fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                {o.value}
              </p>
              <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/45">
                {o.metric}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      )}

      {/* Back to work */}
      <section className="mx-auto max-w-5xl px-6 pb-8 md:pb-16 pt-14 md:pt-16 border-t border-black/5">
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/35 mb-4">
          Next
        </p>
        <Link
          href="/#work"
          className="group inline-flex items-center gap-3 rounded-full px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02] cursor-none"
          style={{ backgroundColor: ACCENT }}
        >
          Back to all work
          <span className="leading-none transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </section>

      <V2Contact />
    </div>
  );
}
