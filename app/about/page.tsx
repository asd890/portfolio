"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Nav from "@/components/layout/Nav";

const experience = [
  {
    period: "Feb 2023 – Present",
    company: "Valmet",
    location: "Tampere",
    role: "UX Designer",
    bullets: [
      "Part of Valmet's R&D team, designing industrial applications for Distributed Control Systems (DCS), Safety Systems, and Machine Control Systems.",
      "Designed and implemented 30+ components that enhanced operational efficiency and user interaction across control system interfaces.",
      "Collaborated closely with engineers, product managers, and stakeholders to translate complex user needs into effective design solutions.",
      "Developed comprehensive design guidelines and best practices for faceplates, ensuring consistency and usability across all projects.",
      "Played a key role in defining specification practices and establishing a standardised approach to design documentation.",
    ],
  },
  {
    period: "Feb 2022 – Feb 2023",
    company: "Localbitcoins Oy",
    location: "Helsinki",
    role: "Product Designer",
    bullets: [
      "Core contributor to a full website redesign that measurably improved user experience and engagement.",
      "Contributed to the successful launch of 5 new product initiatives.",
      "Led app redesign end-to-end — conducting user research and implementing data-driven design improvements.",
      "Participated in a comprehensive brand redesign ensuring consistency across all touchpoints and channels.",
      "Built and maintained the design system and style guides used across the entire product.",
    ],
  },
  {
    period: "May 2021 – Aug 2022",
    company: "MyTownDoesGood",
    location: "Espoo",
    role: "Product Designer",
    bullets: [
      "Led design and development of a new platform from initial concept and sketches through to launch.",
      "Created landing pages for company validation experiments and growth marketing.",
      "Redesigned the company website and blog to improve clarity and conversion.",
      "Produced all promotional content — graphics, videos, and digital ads.",
    ],
  },
];

const skills = [
  "UX Design", "UI Design", "Product Design", "Visual Design",
  "Design Systems", "User Research", "Wireframing", "Prototyping",
  "Interaction Design", "Brand Identity", "Lean Design", "Agile",
  "Figma", "Adobe Creative Suite", "HTML", "CSS", "JavaScript",
];

const education = [
  {
    period: "Graduated Jul 2024",
    institution: "Tampere University",
    location: "Tampere",
    degree: "Master's in Human-Technology Interaction",
    bullets: [
      "Deep understanding of human-computer interaction (HCI) principles and theories.",
      "Conducted user research and usability testing to identify user needs and pain points.",
      "Developed skills in user-centred design — wireframes, prototypes, and user flows.",
      "Learned to create and maintain design systems and style guides at scale.",
    ],
  },
];

const philosophy = [
  {
    num: "01",
    title: "Design with purpose",
    body: "Every element should earn its place. I start with the problem — the right solution follows from deep understanding of the user.",
  },
  {
    num: "02",
    title: "Details matter enormously",
    body: "The best design feels inevitable — because someone obsessed over the details until they disappeared.",
  },
  {
    num: "03",
    title: "Collaboration is the process",
    body: "Great design doesn't happen in isolation. I believe in designing with people, not for them.",
  },
];

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f4f0" }}>
      <Nav />

      {/* Hero */}
      <section className="px-5 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24 max-w-6xl mx-auto">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-8">
            About
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(2.8rem,7vw,8rem)] leading-[0.9] text-[#0a0a0a] mb-14 md:mb-16">
            Designer.<br />
            <em>Problem-solver.</em><br />
            Visual thinker.
          </h1>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <FadeUp delay={0.2}>
            <p className="font-[family-name:var(--font-inter)] text-base text-[#0a0a0a]/60 leading-relaxed mb-6">
              I&apos;m Muhammad Ahmed — a UX Designer with 5 years of UX experience and 7 years in UI and visual design. Currently at Valmet in Tampere, where I design industrial control system interfaces within the R&D team.
            </p>
            <p className="font-[family-name:var(--font-inter)] text-base text-[#0a0a0a]/60 leading-relaxed mb-6">
              I hold a Master&apos;s in Human-Technology Interaction from Tampere University and have worked across product design, design systems, and brand — at companies ranging from a Helsinki crypto exchange to a social impact startup in Espoo.
            </p>
            <p className="font-[family-name:var(--font-inter)] text-base text-[#0a0a0a]/60 leading-relaxed">
              I&apos;m passionate about creating intuitive experiences where complexity is hidden and clarity is felt. Based in Tampere, Finland.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-6">
              Skills &amp; Tools
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="font-[family-name:var(--font-inter)] text-xs tracking-wide px-3 py-1.5 border border-[#0a0a0a]/15 text-[#0a0a0a]/60 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Experience */}
      <section className="px-5 md:px-8 py-16 md:py-24 border-t border-[#0a0a0a]/10 max-w-6xl mx-auto">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-12">
            Experience
          </p>
        </FadeUp>

        <div className="space-y-0">
          {experience.map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-8 border-b border-[#0a0a0a]/10">
                <div className="md:pt-1">
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/30 leading-relaxed">
                    {item.period}
                  </p>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/20 mt-1">
                    {item.location}
                  </p>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#0a0a0a] mb-1">
                    {item.role}
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/40 mb-4">
                    {item.company}
                  </p>
                  <ul className="space-y-2">
                    {item.bullets.map((b, j) => (
                      <li key={j} className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/55 leading-relaxed flex gap-3">
                        <span className="mt-[6px] flex-shrink-0 w-1 h-1 rounded-full bg-[#0a0a0a]/25" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="px-5 md:px-8 py-16 md:py-24 border-t border-[#0a0a0a]/10 max-w-6xl mx-auto">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-12">
            Education
          </p>
        </FadeUp>

        {education.map((item, i) => (
          <FadeUp key={i} delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-8 border-b border-[#0a0a0a]/10">
              <div className="md:pt-1">
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/30 leading-relaxed">
                  {item.period}
                </p>
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/20 mt-1">
                  {item.location}
                </p>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#0a0a0a] mb-1">
                  {item.degree}
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/40 mb-4">
                  {item.institution}
                </p>
                <ul className="space-y-2">
                  {item.bullets.map((b, j) => (
                    <li key={j} className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/55 leading-relaxed flex gap-3">
                      <span className="mt-[6px] flex-shrink-0 w-1 h-1 rounded-full bg-[#0a0a0a]/25" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* Philosophy */}
      <section className="px-5 md:px-8 py-16 md:py-24 max-w-6xl mx-auto">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-12">
            Design Philosophy
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {philosophy.map((p, i) => (
            <FadeUp key={p.num} delay={i * 0.1}>
              <div>
                <span className="font-[family-name:var(--font-playfair)] text-5xl text-[#0a0a0a]/10 block mb-4">
                  {p.num}
                </span>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#0a0a0a] mb-3">
                  {p.title}
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/50 leading-relaxed">
                  {p.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-16 md:py-24 border-t border-[#0a0a0a]/10 text-center">
        <FadeUp>
          <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,5vw,5rem)] text-[#0a0a0a] mb-8">
            Want to work together?
          </h2>
          <a
            href="mailto:ahmednaik1196@gmail.com"
            className="inline-block font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase border border-[#0a0a0a] px-8 py-4 text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#f5f4f0] transition-colors duration-300"
          >
            Get in touch
          </a>
        </FadeUp>
      </section>
    </div>
  );
}
