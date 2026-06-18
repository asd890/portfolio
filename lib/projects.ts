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
  accentColor: string;
  bgColor: string;
  textColor: string;
  image: string;
  images: string[];
  problem: string;
  process: string[];
  solution: string;
  outcomes: { metric: string; value: string }[];
}

export const projects: Project[] = [
  {
    slug: "localbitcoins",
    title: "LocalBitcoins",
    category: "UX / UI Design | Visual Design",
    description:
      "Designing a new way for close friends to communicate through voice and video.",
    fullDescription:
      "SnackSnack reimagines how close friends stay connected through ephemeral audio and video moments—intimate, playful, and always authentic.",
    year: "2024",
    role: "Lead Product Designer",
    timeline: "8 months",
    team: "4 designers, 6 engineers",
    tools: ["Figma", "Protopie", "Maze", "Notion"],
    industry: "Social / Consumer",
    accentColor: "#5e91f7",
    bgColor: "#1d61f4",
    textColor: "#FFFFFF",
    image: "/projects/snacksnack.jpg",
    images: ["/projects/snacksnack-1.jpg", "/projects/snacksnack-2.jpg"],
    problem:
      "Friends lose touch not because they stop caring, but because digital communication feels performative. We needed to strip that away.",
    process: [
      "Conducted 24 qualitative interviews across three age groups",
      "Mapped communication patterns and friction points",
      "Rapid prototyping across 6 concept directions",
      "Usability testing with 60 participants over 3 rounds",
    ],
    solution:
      "A feed of short audio and video snacks from your closest circle—no likes, no public audience, just presence.",
    outcomes: [
      { metric: "DAU retention", value: "+42%" },
      { metric: "Avg. sessions/day", value: "3.7" },
      { metric: "App Store rating", value: "4.8" },
    ],
  },
  {
    slug: "fintech-platform",
    title: "Meridian",
    category: "Product Design / Fintech",
    description:
      "Building trust and transparency for a next-generation digital banking experience.",
    fullDescription:
      "Meridian is a digital-first banking platform designed around radical transparency—helping users understand their money, not just manage it.",
    year: "2023",
    role: "Senior Product Designer",
    timeline: "12 months",
    team: "3 designers, 10 engineers",
    tools: ["Figma", "FigJam", "UserTesting", "Amplitude"],
    industry: "Fintech / Banking",
    accentColor: "#00D4C8",
    bgColor: "#00D4C8",
    textColor: "#0A0A0A",
    image: "/projects/meridian.jpg",
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
      "A dashboard that speaks plainly—predictive insights, plain-language statements, and friction-free transfers.",
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
      "Nucleus is a comprehensive design system serving 12 product teams—600+ components, full token architecture, and living documentation.",
    year: "2023",
    role: "Design Systems Lead",
    timeline: "18 months",
    team: "2 designers, 4 engineers",
    tools: ["Figma", "Storybook", "Tokens Studio", "Zeroheight"],
    industry: "SaaS / Enterprise",
    accentColor: "#7B5CF0",
    bgColor: "#7B5CF0",
    textColor: "#FFFFFF",
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
    bgColor: "#FF6B35",
    textColor: "#FFFFFF",
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
    bgColor: "#2ECC7F",
    textColor: "#0A0A0A",
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
