export interface ProjectDetail {
  slug: string
  title: string
  subtitle: string
  year: string
  role: string
  stack: string[]
  liveUrl?: string
  githubUrl?: string
  coverImage?: string
  icon?: 'trading' | 'fashion' | 'health' | 'news' | 'beauty' | 'fintech'
  gradient?: string
  problem: string
  approach: string[]
  outcome: string
  highlights: string[]
}

export const PROJECTS_DETAIL: ProjectDetail[] = [
  {
    slug: 'realssa',
    title: 'RealSSA',
    subtitle: 'Global news and intelligence delivery platform',
    year: '2025',
    role: 'Founder · Full-stack',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Playwright'],
    liveUrl: 'https://realssanews.com.ng',
    coverImage: '/realssa.jpg',
    icon: 'news',
    problem:
      'News consumption in emerging markets is fragmented, slow, and often unreliable. Existing aggregators prioritize volume over signal quality and delivery speed.',
    approach: [
      'Built automated crawlers with live database sync for near-real-time ingestion.',
      'Designed a clean, mobile-first delivery surface optimized for low-bandwidth networks.',
      'Implemented intelligent ranking so high-signal stories surface first.',
    ],
    outcome:
      'Shipped a production news platform serving readers across Nigeria with automated pipelines and responsive delivery.',
    highlights: [
      'Automated ingestion pipeline',
      'Live database sync',
      'Mobile-first responsive UI',
      'Production traffic in market',
    ],
  },
  {
    slug: 'splendid-empire',
    title: 'Splendid Empire',
    subtitle: 'Premium cosmetics and beauty experience store',
    year: '2025',
    role: 'Product · Frontend',
    stack: ['React', 'Tailwind', 'Vite', 'Stripe'],
    liveUrl: 'https://splendidcosmetics.com.ng',
    coverImage: '/splendid.jpg',
    icon: 'beauty',
    problem:
      'Premium beauty brands in local markets often lack digital storefronts that match the quality of their physical products.',
    approach: [
      'Crafted a high-conversion e-commerce experience with strong visual hierarchy.',
      'Optimized product imagery and micro-interactions for perceived quality.',
      'Integrated checkout and inventory flows for a seamless path to purchase.',
    ],
    outcome:
      'Launched a polished online store that elevates the brand and supports direct-to-consumer sales.',
    highlights: [
      'Conversion-focused layout',
      'Premium visual system',
      'Responsive product gallery',
      'Direct checkout path',
    ],
  },
  {
    slug: 'tusha-aesthetics',
    title: 'Tusha Aesthetics',
    subtitle: 'Premium lashes & beauty treatments by Lashify Abuja',
    year: '2025',
    role: 'Frontend · Brand',
    stack: ['React', 'Tailwind', 'Framer Motion'],
    liveUrl: 'https://tushaesthestics.com',
    coverImage: '/lashify.jpg',
    icon: 'beauty',
    problem:
      'Service-based beauty businesses need booking-ready presence that communicates craft and trust without visual noise.',
    approach: [
      'Designed a focused landing experience highlighting treatments and outcomes.',
      'Prioritized photography and typography to convey premium positioning.',
      'Kept the interaction model simple: discover → contact / book.',
    ],
    outcome:
      'Delivered a brand-aligned web presence that supports client acquisition for a high-end aesthetics practice.',
    highlights: [
      'Brand-first visual language',
      'Clear service hierarchy',
      'Mobile booking path',
      'Lightweight performance',
    ],
  },
  {
    slug: 'mt5-control-room',
    title: 'MT5 Control Room',
    subtitle: 'Algorithmic trading dashboard for MetaTrader 5',
    year: '2026',
    role: 'Founder · Full-stack · Systems',
    stack: ['React', 'TypeScript', 'Node.js', 'MetaTrader 5', 'WebSockets'],
    liveUrl: 'https://frontend-three-eta-53.vercel.app/',
    icon: 'trading',
    gradient: 'from-[#1a2e44] via-[#0a0a0a] to-[#4E85BF]/30',
    problem:
      'Running automated strategies on MetaTrader 5 without a real-time operations surface makes risk, signals, and execution opaque. Operators need a single control room.',
    approach: [
      'Designed a dark, density-aware dashboard for balance, equity, positions, and daily P/L.',
      'Implemented a signal pipeline: candle → signal → risk → order, with live counters and rejection tracking.',
      'Exposed bot lifecycle controls (start / stop / restart) and runtime state for Exness-connected accounts.',
    ],
    outcome:
      'Shipped a production-ready control room that operators can use to monitor and drive algorithmic trading systems in real time.',
    highlights: [
      'Live signal pipeline visualization',
      'Risk and execution controls',
      'Position and equity overview',
      'Bot runtime management',
    ],
  },
  {
    slug: 'bv-stitches',
    title: 'BV Stitches',
    subtitle: 'Immersive 3D fashion & atelier experience',
    year: '2026',
    role: 'Frontend · 3D',
    stack: ['React', 'Three.js', 'React Three Fiber', 'Tailwind'],
    liveUrl: 'https://bvstitches-eight.vercel.app/',
    icon: 'fashion',
    gradient: 'from-[#3a1a44] via-[#0a0a0a] to-[#89AACC]/30',
    problem:
      'Fashion brands need digital experiences that go beyond static lookbooks — something that feels like walking into the atelier.',
    approach: [
      'Built an immersive 3D-forward presentation layer for product storytelling.',
      'Combined modern e-commerce patterns with spatial, scroll-driven narrative.',
      'Optimized for performance so 3D assets remain usable on mid-range devices.',
    ],
    outcome:
      'Delivered a distinctive fashion web experience focused on craft, materiality, and conversion-ready presentation.',
    highlights: [
      '3D product storytelling',
      'Scroll-driven narrative',
      'Atelier-inspired UI',
      'Performance-conscious 3D',
    ],
  },
  {
    slug: 'veeda',
    title: 'VEEDA',
    subtitle: 'Clinical wellness intelligence with vital-sign monitoring',
    year: '2025–2026',
    role: 'Founder · Product · Engineering',
    stack: ['React', 'TypeScript', 'Mobile-first', 'Clinical scoring'],
    liveUrl: 'https://veeda-mu.vercel.app/',
    icon: 'health',
    gradient: 'from-[#1a4430] via-[#0a0a0a] to-[#4E85BF]/30',
    problem:
      'Clinical teams and individuals need faster, clearer insight from vital signs — without friction or clutter that slows emergency response.',
    approach: [
      'Engineered a mobile-first clinical platform centered on vital-sign capture and NEWS2-style scoring.',
      'Designed flows that reduce time-to-insight under pressure.',
      'Prioritized clarity, accessibility, and calm UI for high-stakes contexts.',
    ],
    outcome:
      'Shipped a wellness intelligence product that supports vital-sign monitoring and faster clinical decision support.',
    highlights: [
      'Vital-sign monitoring flows',
      'NEWS2-oriented scoring',
      'Mobile-first clinical UX',
      'Emergency-ready clarity',
    ],
  },
]

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return PROJECTS_DETAIL.find((p) => p.slug === slug)
}

export function getAdjacentProjects(slug: string) {
  const idx = PROJECTS_DETAIL.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? PROJECTS_DETAIL[idx - 1] : null,
    next: idx < PROJECTS_DETAIL.length - 1 ? PROJECTS_DETAIL[idx + 1] : null,
  }
}
