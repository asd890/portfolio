"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Nav from "@/components/layout/Nav";
import type { Project, ContentBlock } from "@/lib/projects";
import { getContrastColor } from "@/lib/colorUtils";

function youtubeEmbedUrl(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <section className="px-5 py-14 md:px-8 md:py-24 max-w-6xl mx-auto space-y-14 md:space-y-20">
      {blocks.map((block, i) => {
        if (block.type === "text") {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {block.heading && (
                <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-4">
                  {block.heading}
                </p>
              )}
              <p className="font-[family-name:var(--font-playfair)] text-2xl leading-relaxed text-[#0a0a0a]">
                {block.body}
              </p>
            </motion.div>
          );
        }

        if (block.type === "image") {
          return (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={block.full ? "-mx-5 md:-mx-8" : ""}
            >
              <div className="relative w-full overflow-hidden rounded-sm" style={{ aspectRatio: "16/9" }}>
                <Image src={block.src} alt={block.caption ?? ""} fill className="object-cover" sizes="100vw" />
              </div>
              {block.caption && (
                <figcaption className="mt-3 font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/35 tracking-wide">
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
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div
                className={`grid gap-3 grid-cols-1 ${block.srcs.length >= 2 ? "sm:grid-cols-2" : ""} ${block.srcs.length >= 3 ? "md:grid-cols-3" : ""}`}
              >
                {block.srcs.map((src, j) => (
                  <div key={j} className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "4/3" }}>
                    <Image src={src} alt={block.caption ?? `Image ${j + 1}`} fill className="object-cover" sizes="50vw" />
                  </div>
                ))}
              </div>
              {block.caption && (
                <figcaption className="mt-3 font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/35 tracking-wide">
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
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-full overflow-hidden rounded-sm bg-[#0a0a0a]/05" style={{ aspectRatio: "16/9" }}>
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={block.caption ?? "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={block.url}
                    controls
                    className="absolute inset-0 w-full h-full"
                  />
                )}
              </div>
              {block.caption && (
                <figcaption className="mt-3 font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/35 tracking-wide">
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

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

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
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f5f4f0" }}
    >
      <Nav showBack />

      {/* Hero — cinematic full-viewport */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">

        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY, scale: 1.12, transformOrigin: "center" }}
        >
          {heroSrc ? (
            <Image
              src={heroSrc}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: accent }} />
          )}
        </motion.div>

        {/* Curtain reveal — wipes upward on load */}
        <motion.div
          className="absolute inset-0 z-10 origin-bottom"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          style={{ backgroundColor: accent }}
        />

        {/* Gradient overlay — dark at bottom, light at top */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        {/* Bottom-left text */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-30 px-5 pb-8 md:px-10 md:pb-14"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.6 } } }}
        >
          <motion.p
            variants={fadeUp}
            className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {project.category}&nbsp;&nbsp;·&nbsp;&nbsp;{project.year}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-[family-name:var(--font-playfair)] leading-[0.88]"
            style={{
              fontSize: "clamp(3.5rem,9vw,10rem)",
              color: "#ffffff",
            }}
          >
            {project.title}
          </motion.h1>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="hidden md:flex absolute bottom-10 right-10 z-30 items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{ opacity: overlayOpacity }}
        >
          <span
            className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
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
      <section className="px-5 py-14 md:px-8 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={fadeUp}
        >
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-4">
            Overview
          </p>
          <p className="font-[family-name:var(--font-playfair)] text-2xl leading-relaxed text-[#0a0a0a]">
            {project.fullDescription}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const, delay: 0.15 } } }}
          className="grid grid-cols-2 gap-8 content-start"
        >
          {[
            { label: "Role", value: project.role },
            { label: "Timeline", value: project.timeline },
            { label: "Team", value: project.team },
            { label: "Industry", value: project.industry },
            { label: "Year", value: project.year },
            { label: "Tools", value: project.tools.join(", ") },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-[family-name:var(--font-inter)] text-[0.6rem] tracking-widest uppercase text-[#0a0a0a]/30 mb-1">
                {label}
              </p>
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]">
                {value}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Divider */}
      <div className="px-5 md:px-8">
        <div className="border-t border-[#0a0a0a]/10" />
      </div>

      {/* Problem */}
      <section className="px-5 py-14 md:px-8 md:py-24 max-w-6xl mx-auto">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-8"
        >
          The Challenge
        </motion.p>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={fadeUp}
          className="font-[family-name:var(--font-playfair)] text-[clamp(1.6rem,3.5vw,3rem)] leading-[1.3] text-[#0a0a0a] max-w-4xl whitespace-pre-line"
        >
          {project.problem}
        </motion.p>
      </section>

      {/* Process */}
      <section className="px-5 py-14 md:px-8 md:py-24 max-w-6xl mx-auto">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-12"
        >
          Process
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.process.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-5%" }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="flex gap-4 p-6 border border-[#0a0a0a]/08 rounded-sm"
            >
              <span className="font-[family-name:var(--font-playfair)] text-4xl text-[#0a0a0a]/10 flex-shrink-0 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/70 leading-relaxed">
                {step}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rich content blocks */}
      {project.content && project.content.length > 0 && (
        <ContentBlocks blocks={project.content} />
      )}

      {/* Solution — full bleed color */}
      <section
        className="px-5 py-20 md:px-8 md:py-32"
        style={{ backgroundColor: accent }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase mb-8"
            style={{ color: textColor + "80" }}
          >
            Solution
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeUp}
            className="font-[family-name:var(--font-playfair)] text-[clamp(1.8rem,4vw,3.5rem)] leading-[1.2]"
            style={{ color: textColor }}
          >
            {project.solution}
          </motion.p>
        </div>
      </section>

      {/* Outcomes */}
      <section className="px-5 py-14 md:px-8 md:py-24 max-w-6xl mx-auto">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-12"
        >
          Outcomes
        </motion.p>
        <div className="flex flex-wrap gap-12">
          {project.outcomes.map((o, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <p
                className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] leading-none mb-2"
                style={{ color: accent }}
              >
                {o.value}
              </p>
              <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/40">
                {o.metric}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Next project prompt */}
      <div className="px-5 py-12 md:px-8 md:py-16 border-t border-[#0a0a0a]/10 text-center">
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-4">
          Next
        </p>
        <a
          href="/"
          className="font-[family-name:var(--font-playfair)] italic text-[clamp(1.5rem,4vw,3rem)] text-[#0a0a0a] hover:opacity-60 transition-opacity"
        >
          Back to all work →
        </a>
      </div>
    </div>
  );
}
