export interface JournalEntry {
  slug: string
  title: string
  date: string
  readTime: string
  image: string
  tags: string[]
  content: string[]
}

/**
 * Content-driven journal. Structure mirrors what an MDX frontmatter + body
 * would produce so migration to Contentlayer / MDX is a straight swap later.
 */
export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: 'micro-interactions',
    title: 'The Subtle Art of Micro-interactions in Modern Web Design',
    date: 'Aug 12, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop',
    tags: ['Design', 'UX'],
    content: [
      'In the landscape of modern digital design, the difference between a good product and a truly remarkable one often lies in the details. These details are what we call micro-interactions—subtle, functional animations that guide users, provide feedback, and breathe life into interfaces.',
      'A micro-interaction is a single-task cycle that does one thing: it triggers when a user hovers over a button, toggles a switch, pulls to refresh, or watches a page transition load. Its purpose is not just to look pretty, but to explain what is happening under the hood. It connects human action with system reaction.',
      'Think of the pulsing green indicator in your status bar or the reversing gradient ring on a logo—these are micro-interactions. They communicate state changes without cluttering the screen with text. They reassure the user that their actions have been received.',
      'To build effective micro-interactions, we must adhere to three core rules: keep them brief (under 300ms), make them feel natural (using physics-based easings like cubic-bezier), and ensure they serve a functional purpose. Over-animating will quickly fatigue the user. Subtle nuances, however, make digital spaces feel human.',
    ],
  },
  {
    slug: 'minimalist-architecture',
    title: 'Why Minimalist Architecture Inspires Clean User Interfaces',
    date: 'Jul 28, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&auto=format&fit=crop',
    tags: ['Design', 'Systems'],
    content: [
      'Walk into a modernist concrete building, and you will notice how structural load-bearing lines are exposed, how glass frames the landscape, and how empty space is treated as an active element. Minimalist architecture strips away ornament to reveal the pure essence of form.',
      'This physical philosophy translates directly into digital interface design. In UI/UX, we refer to this as negative space, structure, and hierarchy. Just as an architect uses physical columns to guide visitors through a building, a software engineer uses typography weights and grids to guide eyes through information.',
      'By stripping away unnecessary borders, drop shadows, and high-frequency patterns, we allow the content itself to shine. Our interface becomes transparent. The user doesn\'t focus on the browser window; they focus on the data, the product, or the narrative.',
      'At Vura Tech Hub, we study structural minimalism. We replace noisy components with quiet layouts, letting typography do the heavy lifting. In a world full of digital noise, silence is the ultimate premium feature.',
    ],
  },
  {
    slug: 'design-systems',
    title: 'Structuring Design Systems for Long-term Scalability',
    date: 'Jun 15, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
    tags: ['Engineering', 'Design Systems'],
    content: [
      'A design system is not a static Figma document or a set of CSS utility classes. It is an evolving software repository, a single source of truth that bridges design intent with final code execution.',
      'When scaling products (like Vura Bank, VEEDA, and Realssa), consistency becomes a significant challenge. Without a systematic approach, codebase drift occurs—different devs build different button components, colors shift, and margins diverge. The solution is a design token architecture.',
      'Design tokens are the atomic values of a system: color codes (like our custom HSL custom properties), font weights, spacing multipliers, and easing curves. By storing these in a centralized JSON file, we can compile them out to CSS variables, Tailwind configurations, or Swift/Kotlin definitions automatically.',
      'Once the tokens are established, we assemble components (buttons, inputs, cards) using composition. Scalability is achieved by nesting small, pure modules rather than creating massive monolithic templates. When your design tokens are solid, modifying the branding of 10 platforms takes 5 minutes, not 5 weeks.',
    ],
  },
  {
    slug: 'form-function-brand',
    title: 'Balancing Form, Function, and Brand Narrative',
    date: 'May 04, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop',
    tags: ['Product', 'Brand'],
    content: [
      'In the early days of the web, tech companies focused strictly on function: database queries, load times, and raw utility. Designers later focused strictly on form: gradients, drop-shadows, and illustrative layouts. Today, premium software demands the seamless unification of both.',
      'Form is how a product feels—its color palettes, typography, micro-interactions, and visual harmony. Function is how it works—its database schemas, API latencies, and scalability. Brand narrative is the story it tells.',
      'When we engineered Vura Bank, we didn\'t just build a secure bank aggregation backend. We designed an interface that felt reassuring, using deep dark colors and typography that communicated stability. The technical robustness (function) was wrapped in premium design aesthetics (form) to build trust (narrative).',
      'As software creators, we must never compromise on either side of the spectrum. A fast application that looks outdated loses users; a beautiful application that is slow or insecure fails completely. The magic is in the synthesis.',
    ],
  },
]

export function getEntryBySlug(slug: string): JournalEntry | undefined {
  return JOURNAL_ENTRIES.find((e) => e.slug === slug)
}
