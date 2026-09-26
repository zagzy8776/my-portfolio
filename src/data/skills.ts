export interface SkillGroup {
  category: string
  items: { name: string; level: number; years?: string }[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Frontend',
    items: [
      { name: 'React / TypeScript', level: 95, years: '4+' },
      { name: 'Next.js / Vite', level: 90, years: '3+' },
      { name: 'Tailwind / CSS Systems', level: 92, years: '4+' },
      { name: 'Framer Motion / GSAP', level: 88, years: '3+' },
      { name: 'Three.js / R3F', level: 75, years: '2+' },
    ],
  },
  {
    category: 'Backend & Systems',
    items: [
      { name: 'Node.js / APIs', level: 88, years: '4+' },
      { name: 'Python', level: 82, years: '3+' },
      { name: 'PostgreSQL / Redis', level: 80, years: '3+' },
      { name: 'Go / Rust (systems)', level: 65, years: '1+' },
      { name: 'MetaTrader 5 / Trading infra', level: 78, years: '2+' },
    ],
  },
  {
    category: 'Product & Craft',
    items: [
      { name: 'Product design / UX', level: 90, years: '4+' },
      { name: 'Design systems', level: 88, years: '3+' },
      { name: 'Performance / Core Web Vitals', level: 85, years: '3+' },
      { name: 'SEO / Structured data', level: 80, years: '3+' },
    ],
  },
]
