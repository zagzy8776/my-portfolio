import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Calendar, ArrowRight } from 'lucide-react'

interface JournalEntry {
  title: string
  date: string
  readTime: string
  image: string
  content: string[]
}

const ENTRIES: JournalEntry[] = [
  {
    title: "The Subtle Art of Micro-interactions in Modern Web Design",
    date: "Aug 12, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=200&auto=format&fit=crop",
    content: [
      "In the landscape of modern digital design, the difference between a good product and a truly remarkable one often lies in the details. These details are what we call micro-interactions—subtle, functional animations that guide users, provide feedback, and breathe life into interfaces.",
      "A micro-interaction is a single-task cycle that does one thing: it triggers when a user hovers over a button, toggles a switch, pulls to refresh, or watches a page transition load. Its purpose is not just to look pretty, but to explain what is happening under the hood. It connects human action with system reaction.",
      "Think of the pulsing green indicator in your status bar or the reversing gradient ring on a logo—these are micro-interactions. They communicate state changes without cluttering the screen with text. They reassure the user that their actions have been received.",
      "To build effective micro-interactions, we must adhere to three core rules: keep them brief (under 300ms), make them feel natural (using physics-based easings like cubic-bezier), and ensure they serve a functional purpose. Over-animating will quickly fatigue the user. Subtle nuances, however, make digital spaces feel human."
    ]
  },
  {
    title: "Why Minimalist Architecture Inspires Clean User Interfaces",
    date: "Jul 28, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=200&auto=format&fit=crop",
    content: [
      "Walk into a modernist concrete building, and you will notice how structural load-bearing lines are exposed, how glass frames the landscape, and how empty space is treated as an active element. Minimalist architecture strips away ornament to reveal the pure essence of form.",
      "This physical philosophy translates directly into digital interface design. In UI/UX, we refer to this as negative space, structure, and hierarchy. Just as a architect uses physical columns to guide visitors through a building, a software engineer uses typography weights and grids to guide eyes through information.",
      "By stripping away unnecessary borders, drop shadows, and high-frequency patterns, we allow the content itself to shine. Our interface becomes transparent. The user doesn't focus on the browser window; they focus on the data, the product, or the narrative.",
      "At Vura Tech Hub, we study structural minimalism. We replace noisy components with quiet layouts, letting typography do the heavy lifting. In a world full of digital noise, silence is the ultimate premium feature."
    ]
  },
  {
    title: "Structuring Design Systems for Long-term Scalability",
    date: "Jun 15, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=200&auto=format&fit=crop",
    content: [
      "A design system is not a static Figma document or a set of CSS utility classes. It is an evolving software repository, a single source of truth that bridges design intent with final code execution.",
      "When scaling products (like Vura Bank, VEEDA, and Realssa), consistency becomes a significant challenge. Without a systematic approach, codebase drift occurs—different devs build different button components, colors shift, and margins diverge. The solution is a design token architecture.",
      "Design tokens are the atomic values of a system: color codes (like our custom HSL custom properties), font weights, spacing multipliers, and easing curves. By storing these in a centralized JSON file, we can compile them out to CSS variables, Tailwind configurations, or Swift/Kotlin definitions automatically.",
      "Once the tokens are established, we assemble components (buttons, inputs, cards) using composition. Scalability is achieved by nesting small, pure modules rather than creating massive monolithic templates. When your design tokens are solid, modifying the branding of 10 platforms takes 5 minutes, not 5 weeks."
    ]
  },
  {
    title: "Balancing Form, Function, and Brand Narrative",
    date: "May 04, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=200&auto=format&fit=crop",
    content: [
      "In the early days of the web, tech companies focused strictly on function: database queries, load times, and raw utility. Designers later focused strictly on form: gradients, drop-shadows, and illustrative layouts. Today, premium software demands the seamless unification of both.",
      "Form is how a product feels—its color palettes, typography, micro-interactions, and visual harmony. Function is how it works—its database schemas, API latencies, and scalability. Brand narrative is the story it tells.",
      "When we engineered Vura Bank, we didn't just build a secure bank aggregation backend. We designed a interface that felt reassuring, using deep dark colors and typography that communicated stability. The technical robustness (function) was wrapped in premium design aesthetics (form) to build trust (narrative).",
      "As software creators, we must never compromise on either side of the spectrum. A fast application that looks outdated loses users; a beautiful application that is slow or insecure fails completely. The magic is in the synthesis."
    ]
  }
]

export default function JournalSection() {
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null)

  return (
    <section id="journal" className="bg-bg py-16 md:py-24 border-t border-stroke relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        
        {/* Header - same pattern as Selected Work */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
                Journal
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-text-primary leading-tight">
              Recent <span className="font-display italic text-text-primary/95">thoughts</span>
            </h2>
            <p className="text-sm md:text-base text-muted max-w-md leading-relaxed">
              Insights on design process, modern engineering, and creative philosophies.
            </p>
          </div>

          {/* Desktop Only View All Button */}
          <button className="hidden md:inline-flex relative rounded-full p-[1px] group/all">
            <div className="absolute inset-0 rounded-full bg-transparent group-hover/all:accent-gradient transition-all duration-500 animate-gradient-shift" />
            <div className="relative px-6 py-3 bg-surface border border-stroke rounded-full text-xs font-semibold text-text-primary flex items-center gap-2 group-hover/all:border-transparent transition-all duration-300">
              View all articles <span className="inline-block transition-transform duration-300 group-hover/all:translate-x-0.5">→</span>
            </div>
          </button>
        </motion.div>

        {/* Journal Entries List */}
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {ENTRIES.map((entry, idx) => (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => setActiveEntry(entry)}
              className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full transition-colors duration-300 cursor-pointer group"
            >
              {/* Image Circle */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border border-stroke">
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between grow min-w-0 pr-2 sm:pr-4 gap-1 sm:gap-4">
                {/* Title */}
                <h3 className="text-sm sm:text-base font-light text-text-primary/90 group-hover:text-text-primary transition-colors duration-300 truncate">
                  {entry.title}
                </h3>

                {/* Read Time & Date */}
                <div className="flex items-center gap-3 shrink-0 text-[11px] text-muted">
                  <span className="whitespace-nowrap">{entry.date}</span>
                  <span className="w-1 h-1 bg-stroke rounded-full hidden sm:inline-block" />
                  <span className="whitespace-nowrap font-medium text-text-primary/60">{entry.readTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Slide-out Drawer Panel */}
      <AnimatePresence>
        {activeEntry && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEntry(null)}
              className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm cursor-zoom-out"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[10000] w-full max-w-xl bg-surface border-l border-stroke shadow-2xl flex flex-col cursor-default"
            >
              {/* Drawer Header */}
              <div className="p-6 sm:p-8 border-b border-stroke flex items-center justify-between shrink-0">
                <span className="text-[10px] text-muted uppercase tracking-[0.3em] font-medium">
                  Journal Entry
                </span>
                <button
                  onClick={() => setActiveEntry(null)}
                  className="p-1.5 rounded-full bg-stroke/50 hover:bg-stroke text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body (Scrollable) */}
              <div className="p-6 sm:p-8 overflow-y-auto grow space-y-6 select-text text-left">
                {/* Meta details */}
                <div className="flex items-center gap-4 text-xs text-muted font-medium mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {activeEntry.date}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-stroke" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {activeEntry.readTime}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className="text-2xl sm:text-3xl font-display italic text-text-primary leading-tight">
                  {activeEntry.title}
                </h3>

                {/* Article Header Image */}
                <div className="w-full h-48 rounded-2xl overflow-hidden border border-stroke mt-4">
                  <img
                    src={activeEntry.image}
                    alt={activeEntry.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content Paragraphs */}
                <div className="space-y-4 pt-4 text-sm sm:text-base text-muted leading-relaxed font-light">
                  {activeEntry.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 sm:p-8 border-t border-stroke shrink-0 bg-surface/50">
                <button
                  onClick={() => setActiveEntry(null)}
                  className="w-full py-3 bg-stroke hover:bg-stroke/80 text-text-primary text-xs font-semibold rounded-full uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  Close Article <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
