"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Nav from "@/components/layout/Nav";

const experience = [
  { year: "2022–Now", company: "Freelance / Studio", role: "Senior UX/UI Designer", desc: "Working with startups and agencies across product design, design systems, and brand campaigns." },
  { year: "2019–2022", company: "Product Co.", role: "Lead Product Designer", desc: "Led design for core product suite. Built and scaled the design system from 0 to 600+ components." },
  { year: "2017–2019", company: "Digital Agency", role: "UI/UX Designer", desc: "Designed digital experiences for clients in fintech, e-commerce, and consumer apps." },
  { year: "2016–2017", company: "Creative Studio", role: "Junior Designer", desc: "Visual design, marketing materials, print, and brand identity work." },
];

const skills = [
  "UX Strategy", "Product Design", "Design Systems", "User Research",
  "Interaction Design", "Prototyping", "UI Design", "Visual Design",
  "Brand Identity", "Marketing Design", "Print Design", "Social Campaigns",
];

const philosophy = [
  { num: "01", title: "Design with purpose", body: "Every pixel should earn its place. I start with the problem, not the solution." },
  { num: "02", title: "Details matter enormously", body: "The best design feels inevitable—because someone obsessed over the details." },
  { num: "03", title: "Collaboration is the process", body: "Great design doesn't happen in isolation. I believe in designing with people, not for them." },
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
      <section className="px-8 pt-40 pb-24 max-w-6xl mx-auto">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-8">
            About
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,7vw,8rem)] leading-[0.9] text-[#0a0a0a] mb-16">
            Designer.<br />
            <em>Problem-solver.</em><br />
            Visual thinker.
          </h1>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <FadeUp delay={0.2}>
            <p className="font-[family-name:var(--font-inter)] text-base text-[#0a0a0a]/60 leading-relaxed mb-6">
              I&apos;m a UX/UI Designer with 8+ years of experience working across the full design spectrum—from product strategy and interaction design to brand identity and marketing campaigns.
            </p>
            <p className="font-[family-name:var(--font-inter)] text-base text-[#0a0a0a]/60 leading-relaxed mb-6">
              I believe the best design work lives at the intersection of deep empathy for users, rigorous systems thinking, and genuine craft. Whether I&apos;m designing a fintech product or a poster, I bring the same curiosity and care to every project.
            </p>
            <p className="font-[family-name:var(--font-inter)] text-base text-[#0a0a0a]/60 leading-relaxed">
              When I&apos;m not designing, I&apos;m reading about typography, visiting design exhibitions, or mentoring junior designers.
            </p>
          </FadeUp>

          {/* Skills */}
          <FadeUp delay={0.3}>
            <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-6">
              Expertise
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
      <section className="px-8 py-24 border-t border-[#0a0a0a]/10 max-w-6xl mx-auto">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-12">
            Experience
          </p>
        </FadeUp>

        <div className="space-y-0">
          {experience.map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="grid grid-cols-[140px_1fr] gap-8 py-8 border-b border-[#0a0a0a]/10">
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#0a0a0a]/30">
                    {item.year}
                  </p>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#0a0a0a] mb-1">
                    {item.role}
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/40 mb-3">
                    {item.company}
                  </p>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#0a0a0a]/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-8 py-24 max-w-6xl mx-auto">
        <FadeUp>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#0a0a0a]/30 mb-12">
            Design Philosophy
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="px-8 py-24 border-t border-[#0a0a0a]/10 text-center">
        <FadeUp>
          <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,5vw,5rem)] text-[#0a0a0a] mb-8">
            Want to work together?
          </h2>
          <a
            href="mailto:hello@yourname.com"
            className="inline-block font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase border border-[#0a0a0a] px-8 py-4 text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#f5f4f0] transition-colors duration-300"
          >
            Get in touch
          </a>
        </FadeUp>
      </section>
    </div>
  );
}
