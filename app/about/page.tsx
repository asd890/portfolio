"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import V2Nav from "@/components/v2/V2Nav";
import V2Contact from "@/components/v2/V2Contact";

const ACCENT = "#3631F5";
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const PORTRAIT = "/portrait.jpg";

const now = [
  { label: "Currently at", value: "Valmet" },
  { label: "Based in", value: "Tampere, Finland" },
  { label: "Open to", value: "Freelance & new roles" },
];

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
      "Core contributor to a full website and app redesign, leading UX end-to-end from research through delivery.",
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

const skills: Record<string, string[]> = {
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
    summary: "Human-computer interaction principles, user-centred design methods, and the research skills to understand people before solving for them.",
  },
  {
    period: "Graduated 2021",
    institution: "COMSATS University",
    location: "Islamabad",
    degree: "Bachelor's in Computer Science",
    summary: "Software engineering, algorithms, and systems thinking — the technical foundation that informs how I collaborate with engineers.",
  },
];

const philosophy = [
  { quote: "Design with purpose.", body: "Every element should earn its place. I start with the problem — the right solution follows from understanding the user, not aesthetic preference." },
  { quote: "Details matter enormously.", body: "The best design feels inevitable, because someone obsessed over the details until they disappeared." },
  { quote: "Collaboration is the process.", body: "Great design doesn't happen in isolation. I design with people, not for them — engineers, PMs, and users included." },
];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
      <span className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/45">{children}</span>
    </div>
  );
}

function Portrait() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative w-full overflow-hidden rounded-3xl" style={{ aspectRatio: "4 / 5", backgroundColor: ACCENT }}>
      {!failed ? (
        <Image src={PORTRAIT} alt="Ahmed Naik" fill onError={() => setFailed(true)} className="object-cover" sizes="(max-width: 768px) 100vw, 360px" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-[family-name:var(--font-inter)] font-medium text-white/90" style={{ fontSize: "clamp(3rem,8vw,5rem)" }}>AN</span>
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen" style={{ backgroundColor: "#f1f0ec" }}>
      <V2Nav />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-28 md:pt-36 pb-16 md:pb-20">
        <FadeUp><Label>About</Label></FadeUp>
        <FadeUp delay={0.05}>
          <h1
            className="font-[family-name:var(--font-inter)] font-semibold tracking-tight text-[#0a0a0a] max-w-3xl"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.7rem)", lineHeight: 1.08 }}
          >
            Designer, problem-solver &amp; <span style={{ color: ACCENT }}>visual thinker.</span>
          </h1>
        </FadeUp>

        <div className="grid md:grid-cols-[0.8fr_1fr] gap-10 md:gap-12 items-start mt-14">
          <FadeUp delay={0.1}><Portrait /></FadeUp>
          <FadeUp delay={0.15}>
            <p className="font-[family-name:var(--font-inter)] text-[#0a0a0a]/65 leading-relaxed" style={{ fontSize: "clamp(1.05rem,1.6vw,1.2rem)" }}>
              I&apos;m Muhammad Ahmed — a UX designer with 5 years in UX and 7 in UI &amp; visual design. Currently at Valmet in Tampere, designing industrial control-system interfaces within the R&amp;D team.
            </p>
            <p className="font-[family-name:var(--font-inter)] text-[#0a0a0a]/65 leading-relaxed mt-5" style={{ fontSize: "clamp(1.05rem,1.6vw,1.2rem)" }}>
              I hold a Master&apos;s in Human-Technology Interaction from Tampere University and have worked across product design, design systems, and brand. I&apos;m passionate about experiences where complexity is hidden and clarity is felt.
            </p>

            {/* Now */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {now.map((n) => (
                <div key={n.label}>
                  <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-[#0a0a0a]/35 mb-1">{n.label}</p>
                  <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-[#0a0a0a]">{n.value}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Experience */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20 border-t border-black/5">
        <FadeUp><Label>Experience</Label></FadeUp>
        <div>
          {experience.map((item, i) => (
            <FadeUp key={item.company} delay={i * 0.06}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-5 md:gap-12 py-9 border-b border-black/8 first:border-t first:border-black/8">
                <div>
                  <h3 className="font-[family-name:var(--font-inter)] font-semibold tracking-tight text-[#0a0a0a]" style={{ fontSize: "clamp(1.3rem,2.2vw,1.7rem)" }}>
                    {item.company}
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/55 mt-1">{item.role}</p>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/35 mt-1">{item.period} · {item.location}</p>
                </div>
                <ul className="space-y-3 md:pt-1">
                  {item.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="mt-[8px] flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                      <span className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/60 leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20 border-t border-black/5">
        <FadeUp><Label>Skills &amp; tools</Label></FadeUp>
        <div className="grid md:grid-cols-3 gap-10">
          {Object.entries(skills).map(([category, items], i) => (
            <FadeUp key={category} delay={i * 0.08}>
              <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-widest uppercase text-[#0a0a0a]/35 mb-4">{category}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/70 transition-colors duration-200 hover:border-[#3631F5] hover:text-[#3631F5] cursor-none"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20 border-t border-black/5">
        <FadeUp><Label>Education</Label></FadeUp>
        <div>
          {education.map((item, i) => (
            <FadeUp key={item.institution} delay={i * 0.06}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-5 md:gap-12 py-9 border-b border-black/8 first:border-t first:border-black/8">
                <div>
                  <h3 className="font-[family-name:var(--font-inter)] font-semibold tracking-tight text-[#0a0a0a]" style={{ fontSize: "clamp(1.3rem,2.2vw,1.7rem)" }}>
                    {item.institution}
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/35 mt-1">{item.period} · {item.location}</p>
                </div>
                <div className="md:pt-1">
                  <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-[#0a0a0a] mb-2">{item.degree}</p>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/55 leading-relaxed max-w-md">{item.summary}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20 border-t border-black/5">
        <FadeUp><Label>How I work</Label></FadeUp>
        <div className="grid md:grid-cols-3 gap-6">
          {philosophy.map((p, i) => (
            <FadeUp key={p.quote} delay={i * 0.08}>
              <div className="rounded-3xl bg-[#eceae5] p-6 h-full">
                <p className="font-[family-name:var(--font-inter)] font-semibold tracking-tight text-[#0a0a0a] mb-3" style={{ fontSize: "1.15rem" }}>
                  <span style={{ color: ACCENT }}>&ldquo;</span>{p.quote}<span style={{ color: ACCENT }}>&rdquo;</span>
                </p>
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/55 leading-relaxed">{p.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <V2Contact />
    </main>
  );
}
