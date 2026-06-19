"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Nav from "@/components/layout/Nav";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const experience = [
  {
    period: "Feb 2023 – Present",
    company: "Valmet",
    location: "Tampere",
    role: "UX Designer",
    bullets: [
      "Designed 30+ components for Distributed Control Systems, Safety Systems, and Machine Control interfaces — directly improving operational efficiency.",
      "Defined design guidelines and specification practices now adopted as standard across R&D.",
      "Partnered with engineers, PMs, and stakeholders to turn complex industrial requirements into intuitive interfaces.",
    ],
  },
  {
    period: "Feb 2022 – Feb 2023",
    company: "LocalBitcoins",
    location: "Helsinki",
    role: "Product Designer",
    bullets: [
      "Core contributor to a full website and app redesign, leading the UX end-to-end from user research through delivery.",
      "Launched 5 new product initiatives and participated in a comprehensive brand redesign.",
      "Built and maintained the design system used across the entire product.",
    ],
  },
  {
    period: "May 2021 – Aug 2022",
    company: "MyTownDoesGood",
    location: "Espoo",
    role: "Product Designer",
    bullets: [
      "Led design and development of a new platform from concept sketches through to launch.",
      "Created landing pages, growth marketing content, and redesigned the company website.",
    ],
  },
];

const skills = {
  Design: ["UX Design", "UI Design", "Product Design", "Visual Design", "Brand Identity", "Design Systems"],
  Methods: ["User Research", "Wireframing", "Prototyping", "Interaction Design", "Lean Design", "Agile"],
  Tools: ["Figma", "Adobe Creative Suite", "HTML", "CSS", "JavaScript"],
};

const education = [
  {
    period: "Graduated Jul 2024",
    institution: "Tampere University",
    location: "Tampere",
    degree: "Master's in Human-Technology Interaction",
    summary: "Focused on human-computer interaction principles, user-centred design methods, and the research skills needed to understand people before solving for them.",
  },
  {
    period: "Graduated 2021",
    institution: "COMSATS University",
    location: "Islamabad",
    degree: "Bachelor's in Computer Science",
    summary: "Grounding in software engineering, algorithms, and systems thinking — the technical foundation that informs how I collaborate with engineers and reason about product constraints.",
  },
];

const philosophy = [
  {
    quote: "Design with purpose.",
    body: "Every element should earn its place. I start with the problem — the right solution follows from deep understanding of the user, not from aesthetic preference.",
  },
  {
    quote: "Details matter enormously.",
    body: "The best design feels inevitable — because someone obsessed over the details until they disappeared. That someone is usually me.",
  },
  {
    quote: "Collaboration is the process.",
    body: "Great design doesn't happen in isolation. I believe in designing with people, not for them — engineers, PMs, and users included.",
  },
];

const now = [
  { label: "Currently at", value: "Valmet" },
  { label: "Based in", value: "Tampere, Finland" },
  { label: "Open to", value: "Freelance & new roles" },
];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f4f0" }}>
      <Nav showBack />

      {/* ── Hero ── */}
      <section className="px-5 md:px-8 pt-36 md:pt-44 pb-20 md:pb-28">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-10">
            About
          </p>
        </FadeUp>

        <FadeUp delay={0.08}>
          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,8vw,9rem)] leading-[0.88] text-[#0a0a0a] mb-12">
            Designer.<br />
            <em>Problem-solver.</em><br />
            Visual thinker.
          </h1>
        </FadeUp>

        {/* Now strip */}
        <FadeUp delay={0.16}>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-b border-[#0a0a0a]/10 py-5 mb-16">
            {now.map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30">
                  {label}
                </span>
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/70 font-medium">
                  {value}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <span className="relative flex h-[7px] w-[7px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-emerald-500" />
              </span>
              <span className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/40">
                Available
              </span>
            </div>
          </div>
        </FadeUp>

        {/* Intro + skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <FadeUp delay={0.2}>
            <p className="font-[family-name:var(--font-inter)] text-base md:text-lg text-[#0a0a0a]/60 leading-relaxed mb-5">
              I&apos;m Muhammad Ahmed — a UX Designer with 5 years of UX experience and 7 years in UI and visual design. Currently at Valmet in Tampere, designing industrial control system interfaces within the R&D team.
            </p>
            <p className="font-[family-name:var(--font-inter)] text-base md:text-lg text-[#0a0a0a]/60 leading-relaxed">
              I hold a Master&apos;s in Human-Technology Interaction from Tampere University and have worked across product design, design systems, and brand — from a Helsinki crypto exchange to a social impact startup in Espoo. I&apos;m passionate about creating intuitive experiences where complexity is hidden and clarity is felt.
            </p>
          </FadeUp>

          {/* Skills — categorised */}
          <FadeUp delay={0.28}>
            <div className="grid grid-cols-3 gap-6">
              {(Object.entries(skills) as [string, string[]][]).map(([category, items]) => (
                <div key={category}>
                  <p className="font-[family-name:var(--font-inter)] text-[0.6rem] tracking-widest uppercase text-[#0a0a0a]/30 mb-4">
                    {category}
                  </p>
                  <ul className="space-y-2">
                    {items.map((s) => (
                      <li
                        key={s}
                        className="font-[family-name:var(--font-inter)] text-[0.8rem] text-[#0a0a0a]/65 leading-snug"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Experience ── */}
      <section className="px-5 md:px-8 py-20 md:py-28 border-t border-[#0a0a0a]/10">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-16">
            Experience
          </p>
        </FadeUp>

        <div>
          {experience.map((item, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-16 py-12 border-b border-[#0a0a0a]/10 first:border-t first:border-[#0a0a0a]/10">
                {/* Left — company anchor */}
                <div>
                  <h3
                    className="font-[family-name:var(--font-playfair)] text-[#0a0a0a] leading-[0.9] mb-3"
                    style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
                  >
                    {item.company}
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/40 mb-1">
                    {item.role}
                  </p>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/25">
                    {item.period} · {item.location}
                  </p>
                </div>

                {/* Right — outcomes */}
                <ul className="space-y-4 md:pt-1">
                  {item.bullets.map((b, j) => (
                    <li key={j} className="flex gap-4">
                      <span className="mt-[9px] flex-shrink-0 w-1 h-1 rounded-full bg-[#0a0a0a]/20" />
                      <span className="font-[family-name:var(--font-inter)] text-[0.9rem] text-[#0a0a0a]/55 leading-relaxed">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Philosophy — dark band ── */}
      <section className="px-5 md:px-8 py-20 md:py-28" style={{ backgroundColor: "#0a0a0a" }}>
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#f5f4f0]/25 mb-16">
            Design Philosophy
          </p>
        </FadeUp>

        <div>
          {philosophy.map((p, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 md:gap-20 py-10 border-b border-[#f5f4f0]/10 first:border-t first:border-[#f5f4f0]/10 items-start">
                <h3
                  className="font-[family-name:var(--font-playfair)] italic text-[#f5f4f0] leading-[1.05]"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
                >
                  &ldquo;{p.quote}&rdquo;
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#f5f4f0]/45 leading-relaxed md:pt-2">
                  {p.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Education ── */}
      <section className="px-5 md:px-8 py-20 md:py-28 border-b border-[#0a0a0a]/10">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-16">
            Education
          </p>
        </FadeUp>

        {education.map((item, i) => (
          <FadeUp key={i} delay={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-16">
              <div>
                <h3
                  className="font-[family-name:var(--font-playfair)] text-[#0a0a0a] leading-[0.9] mb-3"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
                >
                  {item.institution}
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/25">
                  {item.period} · {item.location}
                </p>
              </div>
              <div className="md:pt-1">
                <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/40 mb-3">
                  {item.degree}
                </p>
                <p className="font-[family-name:var(--font-inter)] text-[0.9rem] text-[#0a0a0a]/50 leading-relaxed max-w-md">
                  {item.summary}
                </p>
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="px-5 md:px-8 py-28 md:py-40">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-8">
            Get in touch
          </p>
          <h2
            className="font-[family-name:var(--font-playfair)] text-[#0a0a0a] leading-[0.92] mb-14"
            style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
          >
            Want to work<br />
            <em>together?</em>
          </h2>
          <a
            href="mailto:admin@ahmednaik.com"
            className="group inline-flex items-center gap-3 font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase text-[#0a0a0a] border border-[#0a0a0a]/20 px-8 py-4 rounded-full hover:bg-[#0a0a0a] hover:text-[#f5f4f0] transition-all duration-300 cursor-none"
          >
            <span>Say hello</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </a>
        </FadeUp>
      </section>
    </div>
  );
}
