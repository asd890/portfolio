"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* LocalBitcoins case study, sections 01-04.
 *
 * Too bespoke for the generic acts/content schema, so ProjectDetail renders this in
 * place of thesis/acts/content/closing. Hero, nav, meta grid and footer stay shared.
 *
 * Structure and copy follow Figma "Case study v2 (desktop)" (3qJrOxmyV9M65NubLPByd8),
 * but the styling deliberately does NOT: the Figma uses the LocalBitcoins brand
 * palette, which reads as a different site when dropped inside this portfolio. The
 * page keeps the v2 language (cream, #eceae5 cards, the blue accent, Inter) and lets
 * the LocalBitcoins brand live in the imagery instead. */

const ACCENT = "#3631F5";
/* LocalBitcoins brand blue, used sparingly: the chart, section labels and the
 * goal emphasis. Structural accents stay on the portfolio blue. */
const LBC = "#006eb9";
const INK = "#0a0a0a";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const inter = "font-[family-name:var(--font-inter)]";
const section = "mx-auto max-w-5xl px-6 py-16 md:py-24 border-t border-black/5";

/* Reveals are withheld entirely under prefers-reduced-motion rather than shortened,
 * so a reduced-motion reader gets the finished layout with nothing animating in. */
function useReveal() {
  const reduced = useReducedMotion();
  return reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-12%" },
        variants: fadeUp,
      };
}

function useStagger() {
  const reduced = useReducedMotion();
  return (i: number, step = 0.08) =>
    reduced
      ? {}
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, margin: "-8%" },
          variants: {
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.65, delay: i * step, ease },
            },
          },
        };
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
      <span className={`${inter} text-xs tracking-widest uppercase text-[#0a0a0a]/45`}>
        {children}
      </span>
    </div>
  );
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className={`${inter} font-semibold tracking-tight text-[#0a0a0a]`}
      style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)", lineHeight: 1.1 }}
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ 01 setup */

const MY_PART = [
  "UX strategy and the key flow decisions",
  "The design system (UI Library)",
  "Visual identity and brand book",
  "The closure and offboarding experience",
];

function SectionSetup() {
  const reveal = useReveal();
  return (
    <section className={section}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16">
        <motion.div {...reveal}>
          <Eyebrow>01 · The setup</Eyebrow>
          <Headline>Never really a trading product</Headline>
          <p className={`${inter} mt-6 text-base md:text-lg leading-relaxed text-[#0a0a0a]/75`}>
            It was a machine for getting two strangers to swap money that could never be
            un-swapped. Millions used it, but by 2021 it no longer behaved like something you’d
            trust with your savings, and shinier competitors were taking the users who left.
          </p>
        </motion.div>

        <motion.div {...reveal} className="rounded-3xl bg-[#eceae5] p-7 self-start">
          <p className={`${inter} text-[10px] tracking-widest uppercase text-[#0a0a0a]/35 mb-5`}>
            My part
          </p>
          <ul className="flex flex-col gap-3.5">
            {MY_PART.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
                <span className={`${inter} text-sm leading-relaxed text-[#0a0a0a]/75`}>{item}</span>
              </li>
            ))}
          </ul>
          <p className={`${inter} mt-6 text-xs text-[#0a0a0a]/45`}>
            Research and delivery were a team sport.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 02 problem */

const QUOTES = [
  { label: "Trust", quote: "“If I’m risking real money, I need to see proof that this place is safe.”" },
  { label: "Complexity", quote: "“I uploaded my ID three times and still have no idea what’s missing.”" },
  { label: "Built for someone else", quote: "“It feels like the platform wasn’t made for people outside Europe.”" },
];

function SectionProblem() {
  const reveal = useReveal();
  const stagger = useStagger();
  return (
    <section className={section}>
      <motion.div {...reveal}>
        <Eyebrow>02 · The problem</Eyebrow>
        <Headline>Three cracks, in our users’ own words</Headline>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {QUOTES.map((q, i) => (
          <motion.figure key={q.label} {...stagger(i)} className="rounded-3xl bg-[#eceae5] p-7">
            <figcaption
              className={`${inter} text-[10px] tracking-widest uppercase mb-5`}
              style={{ color: LBC }}
            >
              {q.label}
            </figcaption>
            <blockquote
              className={`${inter} font-medium tracking-tight text-[#0a0a0a]`}
              style={{ fontSize: "clamp(1.15rem, 1.7vw, 1.4rem)", lineHeight: 1.4 }}
            >
              {q.quote}
            </blockquote>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- 03 listening */

const STATS = [
  { n: "50", l: "interviews" },
  { n: "6", l: "countries" },
  { n: "3", l: "journey maps" },
  { n: "40%+", l: "hit a language barrier" },
];

/* The map is a 2240px poster. Fitted to the column it is unreadable mush, which is
 * most of why it reads as dated, so it opens full size instead of being squinted at. */
function ExpandableMap() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the Casual Trader journey map full size"
        className="group relative block w-full overflow-hidden rounded-3xl bg-[#eceae5] cursor-none text-left"
        style={{ border: "1px solid rgba(10,10,10,0.07)" }}
      >
        <Image
          src="/projects/lbc/journey-casual-trader.jpg"
          alt="Customer journey map for the casual trader, tracking goals, thoughts, emotions, pain points and the internal team owning each moment"
          width={2240}
          height={1478}
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="w-full h-auto"
        />
        <span
          className={`${inter} absolute bottom-4 right-4 rounded-full px-4 py-2 text-xs text-white transition-transform duration-200 group-hover:scale-[1.04]`}
          style={{ backgroundColor: LBC }}
        >
          View full size
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Casual Trader journey map, full size"
          className="fixed inset-0 z-[100] flex flex-col"
          style={{ backgroundColor: "rgba(10,10,10,0.92)" }}
          onClick={() => setOpen(false)}
        >
          <div className="flex items-center justify-between px-5 py-4 shrink-0">
            <p className={`${inter} text-sm text-white/70`}>
              Casual Trader journey map · scroll to explore
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`${inter} rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 hover:text-white cursor-none`}
            >
              Close
            </button>
          </div>
          <div
            className="flex-1 overflow-auto px-5 pb-5"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src="/projects/lbc/journey-casual-trader.jpg"
              alt="Customer journey map for the casual trader, shown at full size"
              width={2240}
              height={1478}
              className="max-w-none rounded-xl"
              style={{ width: 2240, height: "auto" }}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            />
          </div>
        </div>
      )}
    </>
  );
}

function SectionListening() {
  const reveal = useReveal();
  return (
    <section className={section}>
      <motion.div {...reveal}>
        <Eyebrow>03 · How we listened</Eyebrow>
        <Headline>Fifty conversations, six countries</Headline>
        <p className={`${inter} mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-[#0a0a0a]/75`}>
          We wanted the why, not just the what. Interviews across Mexico, Finland, the US, India,
          Nigeria and the Philippines, paired with analytics on where people dropped out of
          verification and payment, then mapped as a journey with the emotions left in.
        </p>
      </motion.div>

      <motion.div {...reveal} className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div key={s.l}>
            <p
              className={`${inter} font-medium tracking-tight text-[#0a0a0a]`}
              style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.2rem)" }}
            >
              {s.n}
            </p>
            <p className={`${inter} mt-1 text-xs text-[#0a0a0a]/45`}>{s.l}</p>
          </div>
        ))}
      </motion.div>

      <motion.figure {...reveal} className="mt-12">
        <ExpandableMap />
        <figcaption className={`${inter} mt-4 text-sm text-[#0a0a0a]/45`}>
          The Casual Trader journey map, May 2022. Goals, steps, thoughts, emotions, pain points,
          opportunities, touchpoints and the internal team owning every moment. Two more covered
          the Market Maker and Company accounts.
        </figcaption>
      </motion.figure>
    </section>
  );
}

/* ----------------------------------------------------------- 04 anxiety line */

/* Plot geometry mirrors Figma chart 38:63: stages evenly across x 150-1040, and
 * value (0 calm, 1 anxious) maps to y = 164 + value * 252. */
const STAGES = ["Awareness", "Onboarding", "First trade", "Repeat trading", "Verification tier 2", "Verification tier 3", "Pro trader"];
const VALUES = [0.45, 0.92, 0.8, 0.1, 0.9, 0.82, 0.08];
const PLOT_X0 = 150;
const PLOT_X1 = 1040;

const px = (i: number) => PLOT_X0 + (i * (PLOT_X1 - PLOT_X0)) / (STAGES.length - 1);
const py = (v: number) => 164 + v * 252;

/* Cardinal spline through the points; the eased curve is the whole point of the
 * visual, so it is computed rather than hand-authored. */
function splinePath(pts: { x: number; y: number }[], tension = 0.5) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = tension * 2;
    d += ` C ${p1.x + ((p2.x - p0.x) / 6) * t} ${p1.y + ((p2.y - p0.y) / 6) * t}, ${
      p2.x - ((p3.x - p1.x) / 6) * t
    } ${p2.y - ((p3.y - p1.y) / 6) * t}, ${p2.x} ${p2.y}`;
  }
  return d;
}

type Callout = { stage: number; label?: string; quote: string; side: "above" | "below"; row?: number };
/* Stages 1 and 2 sit 148px apart, closer than a callout is wide, so the second
 * drops to a lower row rather than overlapping its neighbour. */
const CALLOUTS: Callout[] = [
  { stage: 0, label: "Finding 1 · 5", quote: "“Looks a bit old.” “Not clear where to start.”", side: "above" },
  { stage: 3, quote: "“I’m making money!”", side: "above" },
  { stage: 6, quote: "“I’m a pro.”", side: "above" },
  { stage: 1, label: "Finding 3", quote: "“Why do they need so much personal info?”", side: "below", row: 0 },
  { stage: 2, label: "Finding 2", quote: "“How can I be safe against scammers?”", side: "below", row: 1 },
  { stage: 4, label: "Finding 4", quote: "“Language barrier. Documents not valid.”", side: "below", row: 0 },
];
const BELOW_TOP = 486;
const ROW_GAP = 96;

/* SVG text does not wrap, so quotes are split into tspans by width. */
function wrap(text: string, maxChars: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((`${line} ${word}`).trim().length > maxChars && line) {
      lines.push(line.trim());
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines;
}

function AnxietyChart() {
  const reduced = useReducedMotion();
  const d = splinePath(VALUES.map((v, i) => ({ x: px(i), y: py(v) })));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[860px]">
        <svg
          viewBox="0 0 1120 700"
          className="w-full h-auto"
          role="img"
          aria-label="Line chart of user anxiety across seven stages of the LocalBitcoins journey. Anxiety peaks at onboarding and at both verification tiers, and is calmest during repeat trading and at pro trader status."
        >
          <defs>
            <linearGradient id="lbc-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LBC} stopOpacity="0.20" />
              <stop offset="100%" stopColor={LBC} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* a single weighted band: lower on the chart reads as heavier */}
          <rect x="0" y="290" width="1120" height="150" fill="rgba(10,10,10,0.04)" />
          <text x="0" y="160" className={inter} fill={INK} fillOpacity="0.4" fontSize="11"
            letterSpacing="2">CALM</text>
          <text x="0" y="432" className={inter} fill={INK} fillOpacity="0.4" fontSize="11"
            letterSpacing="2">ANXIOUS</text>

          {STAGES.map((s, i) => (
            <g key={s}>
              <line x1={px(i)} y1="140" x2={px(i)} y2="440" stroke="rgba(10,10,10,0.09)"
                strokeWidth="1" strokeDasharray="3 5" />
              <text x={px(i)} y="468" textAnchor="middle" className={inter} fill={INK}
                fillOpacity="0.45" fontSize="13">{s}</text>
            </g>
          ))}

          {CALLOUTS.map((c) => {
            const x = px(c.stage);
            const yPoint = py(VALUES[c.stage]);
            return (
              <line key={`lead-${c.stage}`} x1={x} x2={x}
                y1={c.side === "above" ? 100 : yPoint + 12}
                y2={c.side === "above" ? yPoint - 12 : BELOW_TOP + (c.row ?? 0) * ROW_GAP}
                stroke="rgba(10,10,10,0.2)" strokeWidth="1" strokeDasharray="3 4" />
            );
          })}

          {/* area under the curve, so the chart reads as a volume rather than a wire */}
          <motion.path
            d={`${d} L ${PLOT_X1} 440 L ${PLOT_X0} 440 Z`}
            fill="url(#lbc-area)"
            stroke="none"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: reduced ? 0 : 1.1, delay: reduced ? 0 : 0.7 }}
          />

          <motion.path
            d={d}
            fill="none"
            stroke={LBC}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: reduced ? 0 : 1.8, ease: "easeInOut" }}
          />

          {VALUES.map((v, i) => (
            <motion.circle
              key={STAGES[i]}
              cx={px(i)}
              cy={py(v)}
              r="8"
              fill={v < 0.5 ? "#f1f0ec" : LBC}
              stroke={v < 0.5 ? LBC : "#f1f0ec"}
              strokeWidth={v < 0.5 ? 3 : 3.5}
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.3, delay: reduced ? 0 : 0.3 + i * 0.2 }}
            />
          ))}

          {CALLOUTS.map((c) => {
            const x = px(c.stage);
            const w = c.label ? 196 : 172;
            const h = c.label ? 70 : 38;
            const bx = Math.min(Math.max(x - w / 2, 2), 1120 - w - 2);
            const by = c.side === "above" ? 100 - h : BELOW_TOP + (c.row ?? 0) * ROW_GAP;
            return (
              <motion.g
                key={`box-${c.stage}`}
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.45, delay: reduced ? 0 : 1.05 }}
              >
                <rect x={bx} y={by} width={w} height={h} rx="12" fill="#ffffff" />
                {c.label && (
                  <text x={bx + 14} y={by + 21} className={inter} fill={LBC} fontSize="10"
                    letterSpacing="1.2">
                    {c.label.toUpperCase()}
                  </text>
                )}
                <text x={bx + 14} y={by + (c.label ? 40 : 24)} className={inter} fill={INK}
                  fillOpacity="0.75" fontSize="12.5">
                  {wrap(c.quote, 27).map((line, li) => (
                    <tspan key={li} x={bx + 14} dy={li === 0 ? 0 : 15}>{line}</tspan>
                  ))}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

const FINDINGS = [
  { n: "1", title: "Outdated = unsafe", body: "People judged reliability by looks." },
  { n: "2", title: "Panic peaks at payment", body: "Anxiety the second money left their hands." },
  { n: "3", title: "KYC felt like bureaucracy", body: "Long, repetitive, worst in stricter markets." },
  { n: "4", title: "The world was an afterthought", body: "Jargon, unfamiliar ID examples, missing payment methods." },
  { n: "5", title: "Nowhere to start", body: "The dashboard was “cluttered.”" },
];

function SectionLearned() {
  const reveal = useReveal();
  const stagger = useStagger();
  return (
    <section className={section}>
      <motion.div {...reveal}>
        <Eyebrow>04 · What we learned</Eyebrow>
        <Headline>The anxiety line</Headline>
        <p className={`${inter} mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-[#0a0a0a]/75`}>
          Redrawn from the emotion row of the Casual Trader map. The panic didn’t peak at signup.
          It peaked every time we asked for documents, and the moment money left people’s hands.
        </p>
      </motion.div>

      <motion.div {...reveal} className="mt-10 rounded-3xl px-4 py-8 md:px-8"
        style={{ backgroundColor: "rgba(0,110,185,0.055)", border: "1px solid rgba(0,110,185,0.12)" }}>
        <AnxietyChart />
      </motion.div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {FINDINGS.map((f, i) => (
          <motion.div key={f.n} {...stagger(i)} className="rounded-3xl bg-[#eceae5] p-6">
            <p className={`${inter} font-semibold text-lg leading-none`} style={{ color: ACCENT }}>
              {f.n}
            </p>
            <p className={`${inter} mt-4 text-sm font-medium text-[#0a0a0a] leading-snug`}>
              {f.title}
            </p>
            <p className={`${inter} mt-2 text-sm leading-relaxed text-[#0a0a0a]/60`}>{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 05 goals */

const GOALS = [
  { found: "Outdated = unsafe", goal: "Make safety ", em: "visible", rest: ", not implied" },
  { found: "Panic at payment", goal: "Make escrow something you can ", em: "follow", rest: ", step by step" },
  { found: "KYC feels like bureaucracy", goal: "Ask only for ", em: "what’s needed, when it’s needed", rest: "" },
  { found: "Built for Europe", goal: "Design for ", em: "190 countries", rest: ", not one" },
  { found: "Cluttered dashboard", goal: "Always make the ", em: "next step obvious", rest: "" },
];

function SectionGoals() {
  const reveal = useReveal();
  const stagger = useStagger();
  return (
    <section className={section}>
      <motion.div {...reveal}>
        <Eyebrow>05 · What we set out to do</Eyebrow>
        <Headline>Each finding became a goal</Headline>
      </motion.div>

      <div className="mt-10">
        {GOALS.map((g, i) => (
          <motion.div
            key={g.found}
            {...stagger(i, 0.06)}
            className="grid grid-cols-1 md:grid-cols-[1fr_auto_1.4fr] gap-2 md:gap-6 items-baseline py-5 border-t border-black/5"
          >
            <p className={`${inter} text-sm md:text-base text-[#0a0a0a]/45`}>{g.found}</p>
            <span className={`${inter} hidden md:block text-sm`} style={{ color: LBC }}>→</span>
            <p className={`${inter} text-base md:text-lg text-[#0a0a0a]/85`}>
              {g.goal}
              <span style={{ color: LBC }}>{g.em}</span>
              {g.rest}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 06 changes */

const ESCROW_STEPS = ["Offer accepted", "Money in escrow", "Seller confirms", "Bitcoin released"];

function EscrowVisual() {
  return (
    <div className="flex flex-col gap-5">
      {(["before", "after"] as const).map((state) => (
        <div key={state} className="rounded-3xl bg-[#eceae5] p-5">
          <p className={`${inter} text-[10px] tracking-widest uppercase text-[#0a0a0a]/35 mb-4`}>
            {state}
          </p>
          <div className="flex items-center gap-2">
            {ESCROW_STEPS.map((label, i) => {
              /* before: only the first checkpoint is known, the rest is a dark box */
              const lit = state === "after" || i === 0;
              return (
                <div key={label} className="flex-1 flex flex-col gap-2">
                  <div
                    className="h-1.5 rounded-full w-full"
                    style={{ backgroundColor: lit ? LBC : "rgba(10,10,10,0.14)" }}
                  />
                  <span
                    className={`${inter} text-[10px] leading-tight`}
                    style={{ color: lit ? "rgba(10,10,10,0.7)" : "rgba(10,10,10,0.3)" }}
                  >
                    {state === "after" || i === 0 ? label : "?"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="rounded-3xl bg-[#eceae5] p-5">
        <p className={`${inter} text-sm text-[#0a0a0a]/35 line-through`}>“Funds pending release.”</p>
        <p className={`${inter} mt-2 text-sm text-[#0a0a0a]/85`}>
          “Your money is safely held until you confirm you’ve been paid.”
        </p>
      </div>
    </div>
  );
}

const SIGNALS = [
  { k: "Completed trades", a: "1,200+", b: "3" },
  { k: "Verification", a: "Tier 3", b: "Tier 1" },
  { k: "Feedback", a: "99%+", b: "None yet" },
  { k: "Typical release", a: "Minutes", b: "Unknown" },
];

function TrustVisual() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {(["a", "b"] as const).map((who) => (
          <div key={who} className="rounded-3xl bg-[#eceae5] p-5">
            <p className={`${inter} text-[10px] tracking-widest uppercase text-[#0a0a0a]/35 mb-4`}>
              Trader {who.toUpperCase()}
            </p>
            <dl className="flex flex-col gap-3">
              {SIGNALS.map((s) => (
                <div key={s.k}>
                  <dt className={`${inter} text-[11px] text-[#0a0a0a]/40`}>{s.k}</dt>
                  <dd
                    className={`${inter} text-sm`}
                    style={{ color: who === "a" ? LBC : "rgba(10,10,10,0.55)" }}
                  >
                    {who === "a" ? s.a : s.b}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <p className={`${inter} mt-4 text-sm text-[#0a0a0a]/60`}>
        Who would you send €200 to?{" "}
        <span className="text-[#0a0a0a]/35">Illustrative values; the four signals are real.</span>
      </p>
    </div>
  );
}

const UNLOCKS = [
  { ask: "Email and phone", get: "Start trading" },
  { ask: "ID document", get: "Higher limits" },
  { ask: "Proof of address", get: "Full access" },
];

function VerificationVisual() {
  return (
    <div className="flex flex-col gap-3">
      {UNLOCKS.map((u, i) => (
        <div
          key={u.ask}
          className="rounded-3xl bg-[#eceae5] p-5 flex items-center justify-between gap-4"
          style={{ marginLeft: `${i * 10}%` }}
        >
          <span className={`${inter} text-sm text-[#0a0a0a]/55`}>{u.ask}</span>
          <span className={`${inter} text-sm`} style={{ color: LBC }}>
            → {u.get}
          </span>
        </div>
      ))}
      <p className={`${inter} mt-1 text-sm text-[#0a0a0a]/45`}>
        One ask, one unlock. Tier 0 was removed entirely, so signup and Tier 1 became a single
        journey.
      </p>
    </div>
  );
}

const MARKETS = ["MX", "FI", "US", "IN", "NG", "PH"];

function WorldVisual() {
  return (
    <div className="flex flex-wrap gap-2">
      {MARKETS.map((m) => (
        <span
          key={m}
          className={`${inter} rounded-full border px-4 py-2 text-sm`}
          style={{ borderColor: "rgba(0,110,185,0.25)", color: LBC }}
        >
          {m}
        </span>
      ))}
    </div>
  );
}

const HOMES = ["Active trades", "Wallet", "Reputation"];

function DashboardVisual() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {HOMES.map((h) => (
        <div key={h} className="rounded-3xl bg-[#eceae5] p-5">
          <div className="h-1.5 w-8 rounded-full mb-4" style={{ backgroundColor: LBC }} />
          <p className={`${inter} text-sm text-[#0a0a0a]/75`}>{h}</p>
        </div>
      ))}
    </div>
  );
}

const CHANGES = [
  {
    title: "Escrow you can follow",
    body: "The old flow went silent after you paid. We made escrow a visible timeline: who holds the money, what just happened, what happens next. Then we rewrote the system’s voice.",
    visual: <EscrowVisual />,
  },
  {
    title: "Trust you can see",
    body: "The offer list ranked strangers by price alone. We surfaced the signals that actually predict a safe trade, and deliberately skipped a single trust score, because a number nobody can explain doesn’t build trust.",
    visual: <TrustVisual />,
  },
  {
    title: "Verification that makes sense",
    body: "A guided flow replaced the maze. Extra checks appear only where they are genuinely required, and live status means nobody uploads their ID three times again.",
    visual: <VerificationVisual />,
  },
  {
    title: "Built for the world",
    body: "We adapted wording, ID examples and payment methods to local reality, and stripped the jargon that left non-native speakers guessing.",
    visual: <WorldVisual />,
  },
  {
    title: "A dashboard that knows where to start",
    body: "We regrouped the clutter into three clear homes, so the next step was always obvious on web and mobile.",
    visual: <DashboardVisual />,
  },
];

function SectionChanges() {
  const reveal = useReveal();
  const stagger = useStagger();
  return (
    <section className={section}>
      <motion.div {...reveal}>
        <Eyebrow>06 · What we changed</Eyebrow>
        <Headline>Five decisions that moved the needle</Headline>
      </motion.div>

      <div className="mt-12 flex flex-col gap-14 md:gap-20">
        {CHANGES.map((c, i) => (
          <motion.div
            key={c.title}
            {...stagger(i, 0.04)}
            className="grid grid-cols-1 md:grid-cols-[1fr_1.25fr] gap-6 md:gap-12 items-start"
          >
            <div>
              <p className={`${inter} text-lg md:text-xl font-medium tracking-tight text-[#0a0a0a]`}>
                {c.title}
              </p>
              <p className={`${inter} mt-3 text-sm md:text-base leading-relaxed text-[#0a0a0a]/70`}>
                {c.body}
              </p>
            </div>
            {c.visual}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 07 system */

const SYSTEM_STATS = [
  { n: "456", l: "components" },
  { n: "20", l: "documented sections" },
  { n: "30", l: "colour styles" },
  { n: "22", l: "text styles" },
  { n: "6", l: "breakpoints" },
];

const DOMAIN_PARTS = [
  { t: "Verification tier cards", d: "What you’ve unlocked, and what’s next." },
  { t: "Document-upload widget", d: "Real-time status, so the verification fix works everywhere." },
  { t: "Trade chat bubbles", d: "The conversation between buyer and seller during escrow." },
];

function SectionSystem() {
  const reveal = useReveal();
  const stagger = useStagger();
  return (
    <section className={section}>
      <motion.div {...reveal}>
        <Eyebrow>07 · The system</Eyebrow>
        <Headline>What let the trust decisions scale</Headline>
        <p className={`${inter} mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-[#0a0a0a]/75`}>
          None of this would survive 190 countries and two platforms without a shared language, so
          I built one. Fix verification once, and it’s fixed on web, mobile, and every flow that
          touches it.
        </p>
      </motion.div>

      <motion.div {...reveal} className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-6">
        {SYSTEM_STATS.map((s) => (
          <div key={s.l}>
            <p
              className={`${inter} font-medium tracking-tight text-[#0a0a0a]`}
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
            >
              {s.n}
            </p>
            <p className={`${inter} mt-1 text-xs text-[#0a0a0a]/45`}>{s.l}</p>
          </div>
        ))}
      </motion.div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {DOMAIN_PARTS.map((d, i) => (
          <motion.div key={d.t} {...stagger(i)} className="rounded-3xl bg-[#eceae5] p-6">
            <div className="h-1.5 w-8 rounded-full mb-4" style={{ backgroundColor: LBC }} />
            <p className={`${inter} text-sm font-medium text-[#0a0a0a]`}>{d.t}</p>
            <p className={`${inter} mt-2 text-sm leading-relaxed text-[#0a0a0a]/60`}>{d.d}</p>
          </motion.div>
        ))}
      </div>

      <motion.p {...reveal} className={`${inter} mt-6 text-sm text-[#0a0a0a]/45`}>
        Built for this product’s problems, not borrowed from a generic kit. Designed and maintained
        by me, 2021–2022.
      </motion.p>
    </section>
  );
}

/* ----------------------------------------------------------------- 08 brand */

const PALETTE = [
  { hex: "#00375d", name: "Navy" },
  { hex: "#006eb9", name: "Blue" },
  { hex: "#f5821f", name: "Orange" },
  { hex: "#9bb3dc", name: "River" },
  { hex: "#f6f9fc", name: "Cloud" },
];

function SectionBrand() {
  const reveal = useReveal();
  return (
    <section className={section}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <motion.div {...reveal}>
          <Eyebrow>08 · The brand</Eyebrow>
          <Headline>A brand that feels safe</Headline>
          <p className={`${inter} mt-6 text-base md:text-lg leading-relaxed text-[#0a0a0a]/75`}>
            The old identity felt cold and technical, and in a trust business that is a real cost.
            The refresh did one job: make safety visible. A steadier grid, warmer shapes, deep navy
            for reliability and a confident orange for action.
          </p>
        </motion.div>

        <motion.div {...reveal} className="rounded-3xl bg-[#eceae5] p-6">
          <p className={`${inter} text-[10px] tracking-widest uppercase text-[#0a0a0a]/35 mb-5`}>
            Palette
          </p>
          <div className="flex flex-col gap-3">
            {PALETTE.map((c) => (
              <div key={c.hex} className="flex items-center gap-3">
                <span
                  className="h-8 w-8 rounded-lg shrink-0"
                  style={{ backgroundColor: c.hex, border: "1px solid rgba(10,10,10,0.08)" }}
                />
                <span className={`${inter} text-sm text-[#0a0a0a]/75`}>{c.name}</span>
                <span className={`${inter} ml-auto text-xs text-[#0a0a0a]/35`}>{c.hex}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- 09 testing */

function SectionTesting() {
  const reveal = useReveal();
  return (
    <section className={section}>
      <motion.div {...reveal}>
        <Eyebrow>09 · What testing changed</Eyebrow>
        <Headline>The escrow timeline was too honest</Headline>
      </motion.div>

      <motion.div {...reveal} className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-center">
        <div className="rounded-3xl bg-[#eceae5] p-6">
          <p className={`${inter} text-[10px] tracking-widest uppercase text-[#0a0a0a]/35 mb-4`}>
            First version
          </p>
          <div className="flex flex-col gap-2">
            {["Offer accepted", "Payment window opened", "Buyer marked as paid", "Awaiting seller confirmation", "Escrow release queued", "Bitcoin released"].map((r) => (
              <p key={r} className={`${inter} text-xs text-[#0a0a0a]/45`}>{r}</p>
            ))}
          </div>
        </div>

        <p className={`${inter} text-center text-sm`} style={{ color: LBC }}>→</p>

        <div className="rounded-3xl bg-[#eceae5] p-6">
          <p className={`${inter} text-[10px] tracking-widest uppercase text-[#0a0a0a]/35 mb-4`}>
            After testing
          </p>
          <div className="flex flex-col gap-3">
            <p className={`${inter} text-sm text-[#0a0a0a]/85`}>Where’s my money?</p>
            <p className={`${inter} text-sm text-[#0a0a0a]/85`}>What happens next?</p>
          </div>
        </div>
      </motion.div>

      <motion.p {...reveal} className={`${inter} mt-6 max-w-3xl text-base leading-relaxed text-[#0a0a0a]/70`}>
        We assumed more detail would mean more reassurance. Testers skimmed the full timeline and
        still felt anxious, because it answered questions they weren’t asking. Cutting it to the
        only two that mattered did more for confidence than any amount of completeness.
      </motion.p>
    </section>
  );
}

/* --------------------------------------------------------------- 10 closure */

const SWITCHES = [
  { label: "New signups", stays: false },
  { label: "New trades", stays: false },
  { label: "Posting ads", stays: false },
  { label: "Everything else", stays: false },
  { label: "Withdraw your funds", stays: true },
];

function SwitchBoard() {
  const reduced = useReducedMotion();
  return (
    <div className="rounded-3xl bg-[#eceae5] p-6 md:p-8 flex flex-col gap-3">
      {SWITCHES.map((s, i) => (
        <motion.div
          key={s.label}
          className="flex items-center justify-between gap-4 py-2"
          initial={reduced ? false : { opacity: 1 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <span
            className={`${inter} text-sm`}
            style={{ color: s.stays ? "rgba(10,10,10,0.85)" : "rgba(10,10,10,0.4)" }}
          >
            {s.label}
          </span>
          <motion.span
            className="h-2.5 w-9 rounded-full shrink-0"
            initial={reduced ? false : { backgroundColor: LBC }}
            whileInView={{ backgroundColor: s.stays ? LBC : "rgba(10,10,10,0.14)" }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.35 + i * 0.3 }}
          />
        </motion.div>
      ))}
      <p className={`${inter} mt-2 text-xs text-[#0a0a0a]/40`}>
        Sequenced so nobody was stranded mid-trade.
      </p>
    </div>
  );
}

const CLOSURE_MOVES = [
  {
    t: "One honest message, everywhere at once",
    d: "In-app, email, blog and every social channel carried the same calm letter, and a generous 12-month withdrawal window. No spin.",
  },
  {
    t: "Staged, not a bombshell",
    d: "A clear timeline of what switched off and when, with reminders along the way. The news landed as a plan, not a fire alarm.",
  },
  {
    t: "A scam shield",
    d: "A “we’ll never contact you” warning published alongside the announcement, because a shutdown is exactly when fake support agents appear.",
  },
  {
    t: "The product turned toward the exit",
    d: "The primary call-to-action changed from “trade” to “move your funds out safely,” and the dashboard reordered around the next safe step.",
  },
];

const FLOWS = [
  {
    t: "Closing mode",
    items: ["Balance and countdown lead the dashboard", "One “Withdraw all funds” button", "Reminders at 6, 3 and 1 month, then 1 week"],
  },
  {
    t: "Withdraw everything, safely",
    items: ["“Withdraw all” selected by default", "A review step that makes you check the address", "Live status ending at “Remaining balance: 0 BTC”"],
  },
  {
    t: "Wind down and leave cleanly",
    items: ["Open trades finish under escrow", "Ads pause automatically", "Records download, then a goodbye screen"],
  },
];

function SectionClosure() {
  const reveal = useReveal();
  const stagger = useStagger();
  return (
    <section className={section}>
      <motion.div {...reveal}>
        <Eyebrow>10 · Act 2 · The hardest brief</Eyebrow>
        <Headline>Closing down, while still holding people’s money</Headline>
        <p className={`${inter} mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-[#0a0a0a]/75`}>
          In February 2023 LocalBitcoins announced it would close. After years of earning trust,
          this was the final exam: tell the truth early without setting off a panic, get everyone’s
          funds out before the deadlines, and keep the brand’s trust intact to the very last click.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 md:gap-10 items-start">
        <SwitchBoard />
        <div className="flex flex-col gap-5">
          {CLOSURE_MOVES.map((m, i) => (
            <motion.div key={m.t} {...stagger(i, 0.05)}>
              <p className={`${inter} text-sm font-medium text-[#0a0a0a]`}>{m.t}</p>
              <p className={`${inter} mt-1.5 text-sm leading-relaxed text-[#0a0a0a]/65`}>{m.d}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* the artifacts as published */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { src: "/projects/lbc/closure-letter.jpg", alt: "The published LocalBitcoins closure letter to customers", cap: "The letter, as published." },
          { src: "/projects/lbc/scam-warning.jpg", alt: "The published “be aware” warning about scammers impersonating LocalBitcoins support", cap: "The scam warning, published alongside it." },
        ].map((img, i) => (
          <motion.figure key={img.src} {...stagger(i)}>
            <div className="overflow-hidden rounded-3xl bg-[#eceae5]">
              <Image src={img.src} alt={img.alt} width={1200} height={1200}
                sizes="(max-width: 768px) 100vw, 500px" className="w-full h-auto" />
            </div>
            <figcaption className={`${inter} mt-3 text-sm text-[#0a0a0a]/45`}>{img.cap}</figcaption>
          </motion.figure>
        ))}
      </div>

      {/* reconstructed offboarding flows */}
      <motion.p {...reveal} className={`${inter} mt-12 text-sm text-[#0a0a0a]/45`}>
        The offboarding files did not survive, so these three flows are reconstructed from memory
        and the surviving comms.
      </motion.p>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {FLOWS.map((f, i) => (
          <motion.div key={f.t} {...stagger(i)} className="rounded-3xl bg-[#eceae5] p-6">
            <span
              className={`${inter} inline-block rounded-full px-2.5 py-1 text-[10px] tracking-widest uppercase mb-4`}
              style={{ backgroundColor: "rgba(0,110,185,0.1)", color: LBC }}
            >
              Reconstructed
            </span>
            <p className={`${inter} text-sm font-medium text-[#0a0a0a]`}>{f.t}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {f.items.map((it) => (
                <li key={it} className={`${inter} text-sm leading-relaxed text-[#0a0a0a]/60`}>
                  {it}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.p {...reveal} className={`${inter} mt-10 max-w-3xl text-lg md:text-xl font-medium tracking-tight text-[#0a0a0a]`}>
        We knew this would deliberately reduce engagement, and we did it anyway. Helping people
        leave safely was the most on-brand thing left to do.
      </motion.p>
    </section>
  );
}

/* --------------------------------------------------------------- 11 outcome */

const BEFORE_WORDS = ["risky", "complex", "outdated"];
const AFTER_WORDS = ["clear", "secure", "in control"];

function SectionOutcome() {
  const reveal = useReveal();
  const reduced = useReducedMotion();
  return (
    <section className={section}>
      <motion.div {...reveal}>
        <Eyebrow>11 · Outcome</Eyebrow>
        <Headline>Words, not numbers</Headline>
        <p className={`${inter} mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-[#0a0a0a]/75`}>
          The honest version: user language shifted, most of all around the escrow moment that used
          to be the low point of the journey. And the wind-down was orderly, with people moving
          funds out without confusion.
        </p>
      </motion.div>

      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
        {BEFORE_WORDS.map((w, i) => (
          <motion.span
            key={w}
            className={`${inter} text-2xl md:text-3xl tracking-tight text-[#0a0a0a]/25 line-through`}
            initial={reduced ? false : { opacity: 1 }}
            whileInView={{ opacity: 0.45 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : i * 0.12 }}
          >
            {w}
          </motion.span>
        ))}
        <span className={`${inter} text-xl text-[#0a0a0a]/25`}>→</span>
        {AFTER_WORDS.map((w, i) => (
          <motion.span
            key={w}
            className={`${inter} text-2xl md:text-3xl font-medium tracking-tight`}
            style={{ color: LBC }}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.5 + i * 0.14 }}
          >
            {w}
          </motion.span>
        ))}
      </div>

      <motion.p {...reveal} className={`${inter} mt-8 text-sm text-[#0a0a0a]/40`}>
        No invented metrics. The figures that would prove this did not leave the company with me.
      </motion.p>
    </section>
  );
}

/* -------------------------------------------------------------- 12 takeaway */

function SectionTakeaway({ closing, accent }: { closing?: string; accent: string }) {
  const reveal = useReveal();
  return (
    <>
      <section className={section}>
        <motion.div {...reveal}>
          <Eyebrow>12 · What I took away</Eyebrow>
          <Headline>Trust is behaviour, not decoration</Headline>
          <div className="mt-6 max-w-3xl flex flex-col gap-5">
            <p className={`${inter} text-base md:text-lg leading-relaxed text-[#0a0a0a]/75`}>
              Design can’t just look trustworthy, it has to behave that way. One verification
              message did more for how safe someone felt than any hero image. The closure proved
              it: the trust we built held at the moment it mattered most, when we spent it helping
              everyone walk away.
            </p>
            <p className={`${inter} text-base md:text-lg leading-relaxed text-[#0a0a0a]/75`}>
              If I ran it back, I’d measure the escrow anxiety from day one instead of leaning on
              interviews alone.
            </p>
          </div>
        </motion.div>
      </section>

      {closing && (
        <section className="px-6 py-8 md:py-12 border-t border-black/5">
          <motion.div
            {...reveal}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] p-8 md:p-14"
            style={{ backgroundColor: accent }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                maskImage: "radial-gradient(120% 120% at 80% 0%, #000 40%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(120% 120% at 80% 0%, #000 40%, transparent 100%)",
              }}
            />
            <div className="relative">
              <p className={`${inter} text-xs tracking-widest uppercase mb-5 text-white/60`}>
                In closing
              </p>
              <p
                className={`${inter} font-medium tracking-tight max-w-2xl text-white`}
                style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)", lineHeight: 1.2 }}
              >
                {closing}
              </p>
            </div>
          </motion.div>
        </section>
      )}
    </>
  );
}

export default function LocalBitcoinsBody({
  closing,
  accent,
}: {
  closing?: string;
  accent: string;
}) {
  return (
    <>
      <SectionSetup />
      <SectionProblem />
      <SectionListening />
      <SectionLearned />
      <SectionGoals />
      <SectionChanges />
      <SectionSystem />
      <SectionBrand />
      <SectionTesting />
      <SectionClosure />
      <SectionOutcome />
      <SectionTakeaway closing={closing} accent={accent} />
    </>
  );
}
