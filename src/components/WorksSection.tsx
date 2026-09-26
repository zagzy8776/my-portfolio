import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface Project {
  title: string
  subtitle: string
  image?: string
  colSpan: string
  aspectRatio: string
  link?: string
  slug?: string
  isNote?: boolean
  status?: string
}

const PROJECTS: Project[] = [
  {
    title: "RealSSA",
    subtitle: "Global news and intelligence delivery platform",
    image: "/realssa.jpg",
    colSpan: "md:col-span-7",
    aspectRatio: "aspect-[16/10] md:aspect-auto md:h-[480px]",
    slug: "realssa",
    link: "https://realssanews.com.ng"
  },
  {
    title: "Splendid Empire",
    subtitle: "Premium cosmetics and beauty experience store",
    image: "/splendid.jpg",
    colSpan: "md:col-span-5",
    aspectRatio: "aspect-[4/5] md:aspect-auto md:h-[480px]",
    slug: "splendid-empire",
    link: "https://splendidcosmetics.com.ng"
  },
  {
    title: "Tusha Aesthetics",
    subtitle: "Premium lashes & beauty treatments by Lashify Abuja",
    image: "/lashify.jpg",
    colSpan: "md:col-span-5",
    aspectRatio: "aspect-[4/5] md:aspect-auto md:h-[480px]",
    slug: "tusha-aesthetics",
    link: "https://tushaesthestics.com"
  },
  {
    title: "MT5 Control Room",
    subtitle: "Algorithmic trading dashboard for MetaTrader 5 — signals, risk, execution",
    image: "/mt5.png",
    colSpan: "md:col-span-4",
    aspectRatio: "aspect-[4/5] md:aspect-auto md:h-[380px]",
    slug: "mt5-control-room",
    link: "https://frontend-three-eta-53.vercel.app/"
  },
  {
    title: "BV Stitches",
    subtitle: "Immersive 3D fashion & atelier experience",
    image: "/bv-stitches.png",
    colSpan: "md:col-span-4",
    aspectRatio: "aspect-[4/5] md:aspect-auto md:h-[380px]",
    slug: "bv-stitches",
    link: "https://bvstitches.vercel.app/"
  },
  {
    title: "VEEDA",
    subtitle: "Clinical wellness intelligence with vital-sign monitoring",
    image: "/veeda.png",
    colSpan: "md:col-span-4",
    aspectRatio: "aspect-[4/5] md:aspect-auto md:h-[380px]",
    slug: "veeda",
    link: "https://veeda-mu.vercel.app/"
  },
  {
    title: "Vura Tech Hub",
    subtitle: "Enterprise & digital solutions by Ekenedirichukwu Isdore Amadi",
    image: "/isdore.png",
    colSpan: "md:col-span-12",
    aspectRatio: "aspect-[21/9] md:aspect-auto md:h-[320px]",
    isNote: true
  }
]

export default function WorksSection() {
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const navigate = useNavigate()

  const scrollToExperience = () => {
    const el = document.getElementById('experience')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="work" className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium">
                Selected Work
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-text-primary leading-tight">
              Featured <span className="font-display italic text-text-primary/95">projects</span>
            </h2>
            <p className="text-sm md:text-base text-muted max-w-md leading-relaxed">
              A focused selection of products built from concept to launch.
            </p>
          </div>

          <button 
            onClick={scrollToExperience}
            className="hidden md:inline-flex relative rounded-full p-[1px] group/all"
          >
            <div className="absolute inset-0 rounded-full bg-transparent group-hover/all:accent-gradient transition-all duration-500" />
            <div className="relative px-6 py-3 bg-surface border border-stroke rounded-full text-xs font-semibold text-text-primary flex items-center gap-2 group-hover/all:border-transparent transition-all duration-300">
              Full journey <span className="inline-block transition-transform duration-300 group-hover/all:translate-x-0.5">→</span>
            </div>
          </button>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.75, delay: idx * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => {
                if (project.isNote) {
                  setIsNoteOpen(true)
                } else if (project.slug) {
                  navigate(`/work/${project.slug}`)
                } else if (project.link) {
                  window.open(project.link, '_blank', 'noopener,noreferrer')
                }
              }}
              className={`${project.colSpan} ${project.aspectRatio} group relative bg-surface border border-stroke rounded-3xl overflow-hidden ${project.image || project.link ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <span className="font-display italic text-2xl text-text-primary/20">{project.title}</span>
                </div>
              )}

              {project.status && (
                <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-bg/70 backdrop-blur-sm border border-stroke text-[10px] uppercase tracking-[0.15em] text-muted">
                  {project.status}
                </div>
              )}

              <div className="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none" />

              <div className="absolute bottom-6 left-6 z-10 select-none group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-medium block mb-1">
                  Project {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl md:text-2xl font-light text-text-primary leading-tight">
                  {project.title}
                </h3>
              </div>

              <div className="absolute inset-0 bg-bg/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6">
                <div className="text-center space-y-4 max-w-xs">
                  <p className="text-xs text-text-primary/60 tracking-wider">
                    {project.subtitle}
                  </p>
                  {(project.slug || project.link || project.isNote) && (
                    <div className="relative inline-flex rounded-full p-[1.5px] shadow-lg shadow-black/20 transform scale-90 group-hover:scale-100 transition-transform duration-500">
                      <div className="absolute inset-0 rounded-full accent-gradient" />
                      <div className="relative px-5 py-2.5 bg-white text-bg rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <span>{project.isNote ? 'Read' : project.slug ? 'Case study' : 'View'} — </span>
                        <span className="font-display italic font-bold">
                          {project.title}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Biography Modal */}
      <AnimatePresence>
        {isNoteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNoteOpen(false)}
            className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[85vh] bg-surface border border-stroke rounded-3xl p-6 sm:p-8 overflow-y-auto cursor-default shadow-2xl select-text text-left"
            >
              <button
                onClick={() => setIsNoteOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-text-primary transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8 border-b border-stroke pb-6">
                <span className="text-[10px] text-muted uppercase tracking-[0.25em] font-medium block mb-2">
                  About the founder
                </span>
                <h3 className="text-2xl md:text-3xl font-display italic text-text-primary leading-tight">
                  Ekenedirichukwu Isdore Amadi
                </h3>
                <p className="text-xs text-muted mt-1.5 font-medium tracking-wide">
                  Founder, Vura Tech Hub
                </p>
              </div>

              <div className="space-y-6 text-sm sm:text-base text-muted leading-relaxed font-light">
                <p>
                  Every strong venture begins with a clear need. For Ekenedirichukwu Isdore Amadi, that need became a focused ecosystem of platforms designed to solve real problems — anchored by the registered enterprise <strong className="text-text-primary font-medium">Vura Tech Hub</strong>.
                </p>

                <div className="space-y-3 pt-1">
                  <h4 className="text-lg text-text-primary font-display italic">
                    Vura Tech Hub
                  </h4>
                  <p>
                    A registered business entity built to house and ship ambitious digital products. The hub focuses on high-performance software engineering, modern web design, and scalable infrastructure across Python, C++, Java, Go, and Rust.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <h4 className="text-lg text-text-primary font-display italic">
                    Selected ventures
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                    <li><strong className="text-text-primary font-medium">Vura</strong> — Multi-bank aggregator for unified financial management.</li>
                    <li><strong className="text-text-primary font-medium">MT5 Control Room</strong> — Algorithmic trading dashboard for MetaTrader 5.</li>
                    <li><strong className="text-text-primary font-medium">Realssa News</strong> — Automated news aggregation and delivery platform.</li>
                    <li><strong className="text-text-primary font-medium">VEEDA</strong> — Clinical wellness intelligence with vital-sign monitoring.</li>
                    <li><strong className="text-text-primary font-medium">BV Stitches</strong> — Immersive 3D fashion & atelier experience.</li>
                    <li><strong className="text-text-primary font-medium">Loyal Edge</strong> — Sports telemetry and analytics.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
