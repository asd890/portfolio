"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const ACCENT = "#3631F5";
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Drop your photo here: /public/portrait.jpg
const PORTRAIT = "/portrait.jpg";

const stats = [
  { n: "8+", l: "Years experience" },
  { n: "30+", l: "Projects shipped" },
  { n: "5", l: "Industries" },
];

const skills = [
  "Product Design",
  "UX / UI",
  "Design Systems",
  "Prototyping",
  "User Research",
  "Branding",
  "Figma",
  "Framer",
];

function Portrait() {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl"
      style={{ aspectRatio: "4 / 5", backgroundColor: ACCENT }}
    >
      {!failed ? (
        <Image
          src={PORTRAIT}
          alt="Ahmed Naik"
          fill
          onError={() => setFailed(true)}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 340px"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-[family-name:var(--font-inter)] font-medium tracking-tight select-none text-white/90"
            style={{ fontSize: "clamp(3rem, 8vw, 5rem)" }}
          >
            AN
          </span>
        </div>
      )}

      {/* Availability badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/70">
          Available for work
        </span>
      </div>
    </div>
  );
}

export default function V2About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      id="about"
      ref={ref}
      className="mx-auto max-w-3xl px-6 py-24 md:py-28 border-t border-black/5"
    >
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease }}
        className="flex items-center gap-2 mb-10"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
        <span className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/45">About</span>
      </motion.div>

      <div className="grid md:grid-cols-[0.8fr_1fr] gap-10 md:gap-12 items-start">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          <Portrait />
        </motion.div>

        {/* Bio */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="font-[family-name:var(--font-inter)] tracking-tight text-[#0a0a0a]"
            style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.7rem)", lineHeight: 1.34 }}
          >
            I&apos;m a UX/UI designer with over eight years turning complex problems
            into clear, human products — across fintech, enterprise, and consumer
            apps. I care about the details most people never notice.{" "}
            <span style={{ color: ACCENT }}>Currently open to new work.</span>
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mt-10"
          >
            {stats.map((s) => (
              <div key={s.l}>
                <p
                  className="font-[family-name:var(--font-inter)] font-medium tracking-tight text-[#0a0a0a]"
                  style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.2rem)" }}
                >
                  {s.n}
                </p>
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/45 mt-1">
                  {s.l}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="mt-10"
          >
            <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/35 mb-4">
              Skills &amp; tools
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/70
                    transition-colors duration-200 hover:border-[#3631F5] hover:text-[#3631F5] cursor-none"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
