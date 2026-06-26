"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { projects, type Project } from "@/lib/projects";

const ACCENT = "#3631F5";
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Card image with a graceful fallback when the file is missing. */
function CardImage({ project, eager }: { project: Project; eager: boolean }) {
  const [failed, setFailed] = useState(false);
  const accent = project.accentColor ?? "#888";

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: "4 / 3", backgroundColor: accent }}
    >
      {project.image && !failed ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 768px) 100vw, 384px"
          priority={eager}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]">
          <span
            className="font-[family-name:var(--font-inter)] font-medium tracking-tight select-none"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "rgba(255,255,255,0.92)" }}
          >
            {project.title}
          </span>
        </div>
      )}

      {/* Tint + arrow badge on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to top, ${accent}40, transparent 60%)` }}
      />
      <div
        className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full
          opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
          transition-all duration-400 ease-out"
        style={{ backgroundColor: ACCENT }}
      >
        <span className="text-white text-base leading-none">↗</span>
      </div>
    </div>
  );
}

export default function V2Projects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="work" ref={ref} className="mx-auto max-w-3xl px-6 pb-28 md:pb-36">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        className="mb-10"
      >
        <h2 className="font-[family-name:var(--font-inter)] text-2xl md:text-3xl font-medium tracking-tight text-[#0a0a0a]">
          Selected projects
        </h2>
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/45 mt-2 max-w-sm leading-relaxed">
          Explore my selected projects, showcasing my dedication to thoughtful, user-centred design.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.08 }}
            whileHover={{ y: -6 }}
          >
            <Link
              href={`/projects/${p.slug}`}
              className="group block rounded-3xl bg-[#eceae5] p-3 transition-[background-color,box-shadow] duration-300 hover:bg-[#e6e4de] hover:shadow-[0_24px_50px_-24px_rgba(54,49,245,0.35)] cursor-none"
            >
              {/* Image */}
              <CardImage project={p} eager={i < 2} />

              {/* Meta */}
              <div className="px-1.5 pt-4 pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="rounded-full bg-[#0a0a0a] px-2.5 py-1 font-[family-name:var(--font-inter)] text-[11px] text-white">
                    {p.year}
                  </span>
                  <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 font-[family-name:var(--font-inter)] text-[11px] text-[#0a0a0a]/70">
                    {p.industry}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-inter)] text-[17px] leading-snug tracking-tight text-[#0a0a0a]">
                  <span className="font-semibold">{p.title}:</span>{" "}
                  <span className="text-[#0a0a0a]/70">{p.description}</span>
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
