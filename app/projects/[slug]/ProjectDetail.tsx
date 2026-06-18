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
    <section className="px-8 py-24 max-w-6xl mx-auto space-y-20">
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
              className={block.full ? "-mx-8" : ""}
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
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${block.srcs.length}, 1fr)` }}
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
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f5f4f0" }}
    >
      <Nav showBack />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-8 pt-32 pb-24 overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="relative z-10"
        >
          <motion.p
            variants={fadeUp}
            className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-6"
          >
            {project.category}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-[family-name:var(--font-playfair)] text-[clamp(4rem,10vw,11rem)] leading-[0.88] text-[#0a0a0a] mb-16 max-w-4xl"
          >
            {project.title}
          </motion.h1>
        </motion.div>

        {/* Hero image */}
        <motion.div
          className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-sm shadow-2xl"
          style={{ aspectRatio: "16/10", y: imageY, scale: imageScale }}
        >
          <motion.div
            initial={{ scaleY: 1, originY: 0 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 z-10 origin-top"
            style={{ backgroundColor: accent }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: accent + "33" }}
          >
            <span
              className="font-[family-name:var(--font-playfair)] italic select-none"
              style={{
                fontSize: "clamp(5rem,15vw,14rem)",
                color: accent + "66",
              }}
            >
              {project.title[0]}
            </span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 rounded-full border border-[#0a0a0a]/20 flex items-center justify-center"
          >
            <span className="text-[#0a0a0a]/40 text-xs">↓</span>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
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
      <div className="px-8">
        <div className="border-t border-[#0a0a0a]/10" />
      </div>

      {/* Problem */}
      <section className="px-8 py-24 max-w-6xl mx-auto">
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
          className="font-[family-name:var(--font-playfair)] text-[clamp(1.6rem,3.5vw,3rem)] leading-[1.3] text-[#0a0a0a] max-w-4xl"
        >
          {project.problem}
        </motion.p>
      </section>

      {/* Process */}
      <section className="px-8 py-24 max-w-6xl mx-auto">
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
        className="px-8 py-32"
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
      <section className="px-8 py-24 max-w-6xl mx-auto">
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
      <div className="px-8 py-16 border-t border-[#0a0a0a]/10 text-center">
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
