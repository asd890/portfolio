/** Free-form content blocks rendered on the project detail page. */
export type ContentBlock =
  | { type: "text"; heading?: string; body: string }
  | { type: "image"; src: string; caption?: string; full?: boolean }
  | { type: "images"; srcs: string[]; caption?: string }
  | { type: "video"; url: string; caption?: string };

/** One narrative act on a story-first project page (goals -> process -> outcome). */
export interface Act {
  label: string;
  title: string;
  /** One-line statement of what the act had to achieve. */
  goalLead: string;
  /** The specific objectives behind that goal. */
  goals: string[];
  process: string;
  outcome: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  year: string;
  role: string;
  timeline: string;
  team: string;
  tools: string[];
  industry: string;
  /** Hex color for the section background. Optional — auto-extracted from image if omitted. */
  accentColor?: string;
  /** Thumbnail shown on the homepage scroll section. */
  image?: string;
  /** Full-bleed hero image for the project detail page. Falls back to `image` if omitted. */
  heroImage?: string;
  /** Animated hero. Two art-directed crops rather than one video scaled down, so
   *  phones get their own framing instead of a slice of the desktop composition.
   *  `poster` is also the reduced-motion and autoplay-blocked fallback. */
  heroVideo?: { desktop: string; mobile: string; poster: string; posterMobile: string };
  images?: string[];
  problem?: string;
  process?: string[];
  solution?: string;
  outcomes?: { metric: string; value: string }[];
  /** Standalone opening paragraph, set above the acts. */
  thesis?: string;
  /** Story-first structure. When present it replaces problem/process/solution/outcomes. */
  acts?: Act[];
  /** Closing line shown in the accent card. */
  closing?: string;
  /** Rich content sections shown between Process and Solution. */
  content?: ContentBlock[];
}

export const projects: Project[] = [
  {
    slug: "localbitcoins",
    title: "LocalBitcoins",
    category: "UX / UI Design · Visual Identity",
    description:
      "Designing trust between strangers, then switching it off gracefully.",
    fullDescription:
      "A peer-to-peer marketplace where people handed real money to people they had never met, in 190+ countries, and just… hoped. I led the UX and visual identity, first through a full redesign, then through the hardest brief of all: switching it off gracefully.",
    year: "2022–2023",
    role: "UX & Visual Identity Lead",
    timeline: "12 months",
    team: "Me + researcher, PM, engineers",
    tools: ["Figma", "Illustrator", "After Effects"],
    industry: "Fintech / Crypto / P2P Marketplace",
    accentColor: "#207ab7",
    image: "/projects/LBCThumb.jpg",
    heroImage: "/projects/lbcbanner2.jpg",
    heroVideo: {
      desktop: "/projects/lbc-hero-desktop.mp4",
      mobile: "/projects/lbc-hero-mobile.mp4",
      poster: "/projects/lbc-hero-desktop.jpg",
      posterMobile: "/projects/lbc-hero-mobile.jpg",
    },
    images: ["/projects/lbcbanner2.jpg", "/projects/lbcBanner2.png"],
    thesis:
      "LocalBitcoins was never really a trading product. It was a machine for getting two strangers, who had every reason to distrust each other, to swap money that could never be un-swapped. My job was to design that trust. And then, in 2023, to help everyone walk away from it safely.",
    acts: [
      {
        label: "Act 1",
        title: "The redesign",
        goalLead: "Make the platform feel as safe as it actually was.",
        goals: [
          "Turn trust from a hope into something you could see on the screen.",
          "Take the fear out of the scariest moments: choosing a trader, paying into escrow, getting verified.",
          "Unify a brand that had to read as trustworthy across 190 countries and a dozen languages.",
        ],
        process:
          "We started with real research: 50 interviews across six very different markets, plus analytics and journey mapping. One finding steered everything: people read “outdated” as “unsafe,” and the real panic hit not at signup, but in the silent seconds after the money left their hands. So we designed for that: the anxiety curve, not the homepage. We made escrow legible (“Your money is safely held…” instead of “Funds pending release”), surfaced the real signals that tell you a stranger is safe to trade with, and swapped the one-size-fits-all KYC maze for verification that only asks for what you need, when you need it. The rebrand had exactly one job: make safety visible.",
        outcome:
          "User language shifted from “complex” and “risky” to “clear,” “secure,” and “in control,” most of all around the escrow moment that used to be the low point of the whole journey.",
      },
      {
        label: "Act 2",
        title: "Closing it down",
        goalLead:
          "In 2023 the platform had to shut down while it was still holding people’s money.",
        goals: [
          "Tell the truth, early, without setting off a panic.",
          "Get everyone’s funds out safely before the deadlines.",
          "Keep the brand’s trust intact right to the very last click.",
        ],
        process:
          "Staged, honest communication instead of one scary bombshell: a clear timeline of what would switch off and when (signups first, then new trades, then a withdrawals-only window), so the news landed as a plan, not a fire alarm. We flipped the product’s primary call-to-action from “trade” to “move your funds out,” reordered the dashboard so the next safe step was always the obvious one, and kept the same calm voice to the end, including a heads-up that shutdowns are scammer prime time. The genuinely hard part: telling people to hurry, gently.",
        outcome:
          "An orderly wind-down. People moved their funds out without confusion, and the brand’s final impression was that it played it straight.",
      },
    ],
    closing:
      "Trust isn’t something you design once. It’s earned in every interaction, right down to the last one.",
    content: [
      {
        type: "images",
        srcs: ["/projects/lbcBanner2.png", "/projects/LBCThumb.jpg"],
        caption:
          "Identity in the wild. The system stretched from product UI to campaign.",
      },
    ],
  },
  {
    slug: "fintech-platform",
    title: "ListoBite",
    category: "Product Design / Fintech",
    description:
      "Building trust and transparency for a next-generation digital banking experience.",
    fullDescription:
      "Meridian is a digital-first banking platform designed around radical transparency, helping users understand their money, not just manage it.",
    year: "2023",
    role: "Senior Product Designer",
    timeline: "12 months",
    team: "3 designers, 10 engineers",
    tools: ["Figma", "FigJam", "UserTesting", "Amplitude"],
    industry: "Fintech / Banking",
    accentColor: "#048b59",
    image: "/projects/listobite.png",
    images: ["/projects/meridian-1.jpg", "/projects/meridian-2.jpg"],
    problem:
      "Traditional banking UX creates anxiety through opacity. Users don't trust what they can't understand.",
    process: [
      "Competitive audit of 12 banking products",
      "Trust and anxiety mapping workshops",
      "Information architecture restructuring",
      "Accessibility-first design process",
    ],
    solution:
      "A dashboard that speaks plainly: predictive insights, plain-language statements, and friction-free transfers.",
    outcomes: [
      { metric: "Customer satisfaction", value: "+67%" },
      { metric: "Support tickets", value: "-38%" },
      { metric: "Onboarding completion", value: "91%" },
    ],
  },
  {
    slug: "design-system",
    title: "Nucleus DS",
    category: "Design Systems / Enterprise",
    description:
      "Scaling design consistency across a suite of enterprise products.",
    fullDescription:
      "Nucleus is a comprehensive design system serving 12 product teams, with 600+ components, full token architecture, and living documentation.",
    year: "2023",
    role: "Design Systems Lead",
    timeline: "18 months",
    team: "2 designers, 4 engineers",
    tools: ["Figma", "Storybook", "Tokens Studio", "Zeroheight"],
    industry: "SaaS / Enterprise",
    accentColor: "#7B5CF0",
    image: "/projects/nucleus.jpg",
    images: ["/projects/nucleus-1.jpg", "/projects/nucleus-2.jpg"],
    problem:
      "12 product teams building independently had created a fragmented experience that was costing engineering time and eroding brand trust.",
    process: [
      "Full component audit across all products",
      "Token architecture design and naming conventions",
      "Component API design and documentation standards",
      "Rollout strategy and adoption playbook",
    ],
    solution:
      "A single source of truth: semantic tokens, 600+ documented components, and automated Figma↔code sync.",
    outcomes: [
      { metric: "Design velocity", value: "+55%" },
      { metric: "Engineering reuse", value: "78%" },
      { metric: "Teams adopted", value: "12/12" },
    ],
  },
  {
    slug: "brand-campaign",
    title: "Pulse Campaign",
    category: "Marketing Design / Brand",
    description:
      "An integrated campaign across digital, print, and social for a fitness tech brand.",
    fullDescription:
      "Pulse needed to reposition from a gadget brand to a lifestyle brand. We built a visual language that lived everywhere.",
    year: "2022",
    role: "Creative Director",
    timeline: "5 months",
    team: "6 designers, 2 strategists",
    tools: ["Figma", "After Effects", "Illustrator", "Photoshop"],
    industry: "Consumer / Health",
    accentColor: "#FF6B35",
    image: "/projects/pulse.jpg",
    images: ["/projects/pulse-1.jpg", "/projects/pulse-2.jpg"],
    problem:
      "Pulse was perceived as a data tool. They needed emotional resonance to compete in a saturated wearables market.",
    process: [
      "Brand audit and competitive positioning",
      "Visual identity exploration and moodboarding",
      "Campaign concept development",
      "Multi-channel asset production",
    ],
    solution:
      "A bold editorial visual system featuring real athletes, kinetic typography, and a unified campaign across 8 channels.",
    outcomes: [
      { metric: "Brand awareness", value: "+89%" },
      { metric: "Social engagement", value: "3.2M" },
      { metric: "Campaign ROI", value: "4.1×" },
    ],
  },
  {
    slug: "ecommerce-redesign",
    title: "Folio Market",
    category: "UX Design / E-Commerce",
    description:
      "Redesigning the discovery and purchase experience for an art marketplace.",
    fullDescription:
      "Folio Market connects artists with collectors. The redesign focused on discovery, emotional connection, and reducing purchase friction.",
    year: "2022",
    role: "UX Lead",
    timeline: "6 months",
    team: "3 designers, 5 engineers",
    tools: ["Figma", "Maze", "Hotjar", "Shopify"],
    industry: "E-Commerce / Art",
    accentColor: "#2ECC7F",
    image: "/projects/folio.jpg",
    images: ["/projects/folio-1.jpg", "/projects/folio-2.jpg"],
    problem:
      "High browse-to-purchase drop-off. Users loved the art but didn't trust the platform or feel the emotional pull to buy.",
    process: [
      "Funnel analysis and session recording review",
      "In-depth interviews with collectors and artists",
      "Jobs-to-be-done framework application",
      "A/B testing across 4 hypothesis variants",
    ],
    solution:
      "Artist-first storytelling, contextual room visualization, and a streamlined checkout reduced friction at every step.",
    outcomes: [
      { metric: "Conversion rate", value: "+34%" },
      { metric: "AOV increase", value: "+22%" },
      { metric: "Return visits", value: "+61%" },
    ],
  },
];
