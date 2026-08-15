import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface Project {
  title: string
  subtitle: string
  image: string
  colSpan: string
  aspectRatio: string
  link?: string
  isNote?: boolean
}

const PROJECTS: Project[] = [
  {
    title: "RealSSA",
    subtitle: "Global news and intelligence delivery platform",
    image: "/realssa.jpg",
    colSpan: "md:col-span-7",
    aspectRatio: "aspect-[16/10] md:aspect-auto md:h-[480px]",
    link: "https://realssanews.com.ng"
  },
  {
    title: "Splendid Empire",
    subtitle: "Premium cosmetics and beauty experience store",
    image: "/splendid.jpg",
    colSpan: "md:col-span-5",
    aspectRatio: "aspect-[4/5] md:aspect-auto md:h-[480px]",
    link: "https://splendidcosmetics.com.ng"
  },
  {
    title: "Tusha Aesthetics",
    subtitle: "Premium lashes & beauty treatments by Lashify Abuja",
    image: "/lashify.jpg",
    colSpan: "md:col-span-5",
    aspectRatio: "aspect-[4/5] md:aspect-auto md:h-[480px]",
    link: "https://tushaesthestics.com"
  },
  {
    title: "Vura Tech Hub",
    subtitle: "Enterprise & digital solutions by Ekenedirichukwu Isdore Amadi",
    image: "/isdore.png",
    colSpan: "md:col-span-7",
    aspectRatio: "aspect-[16/10] md:aspect-auto md:h-[480px]",
    isNote: true
  }
]

export default function WorksSection() {
  const [isNoteOpen, setIsNoteOpen] = useState(false)

  return (
    <section id="work" className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header with Framer Motion scroll animation */}
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
                Selected Work
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-text-primary leading-tight">
              Featured <span className="font-display italic text-text-primary/95">projects</span>
            </h2>
            <p className="text-sm md:text-base text-muted max-w-md leading-relaxed">
              A selection of projects I've worked on, from concept to launch.
            </p>
          </div>

          {/* Desktop Only View All Button */}
          <button className="hidden md:inline-flex relative rounded-full p-[1px] group/all">
            <div className="absolute inset-0 rounded-full bg-transparent group-hover/all:accent-gradient transition-all duration-500 animate-gradient-shift" />
            <div className="relative px-6 py-3 bg-surface border border-stroke rounded-full text-xs font-semibold text-text-primary flex items-center gap-2 group-hover/all:border-transparent transition-all duration-300">
              View all work <span className="inline-block transition-transform duration-300 group-hover/all:translate-x-0.5">→</span>
            </div>
          </button>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => {
                if (project.isNote) {
                  setIsNoteOpen(true)
                } else if (project.link) {
                  window.open(project.link, '_blank', 'noopener,noreferrer')
                }
              }}
              className={`${project.colSpan} ${project.aspectRatio} group relative bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer`}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Halftone Overlay */}
              <div className="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none" />

              {/* Card Label / Project Info (Desktop Static, Mobile Default) */}
              <div className="absolute bottom-6 left-6 z-10 select-none group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-medium block mb-1">
                  Project {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl md:text-2xl font-light text-text-primary leading-tight">
                  {project.title}
                </h3>
              </div>

              {/* Hover State: Backdrop blur + White contrast label pill */}
              <div className="absolute inset-0 bg-bg/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6">
                <div className="text-center space-y-4 max-w-xs">
                  <p className="text-xs text-text-primary/60 tracking-wider">
                    {project.subtitle}
                  </p>
                  
                  {/* Contrast Hover Label Pill */}
                  <div className="relative inline-flex rounded-full p-[1.5px] shadow-lg shadow-black/20 transform scale-90 group-hover:scale-100 transition-transform duration-500">
                    <div className="absolute inset-0 rounded-full accent-gradient animate-gradient-shift" />
                    <div className="relative px-5 py-2.5 bg-white text-bg rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <span>{project.isNote ? 'Read' : 'View'} — </span>
                      <span className="font-display italic font-bold">
                        {project.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Biography / Portfolio Notes Modal */}
      <AnimatePresence>
        {isNoteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNoteOpen(false)}
            className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
          >
            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()} // Stop closing when clicking modal content
              className="relative max-w-3xl w-full max-h-[85vh] bg-surface border border-stroke rounded-3xl p-6 sm:p-8 overflow-y-auto cursor-default shadow-2xl select-text text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsNoteOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-text-primary transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-8 border-b border-stroke pb-6">
                <span className="text-[10px] text-muted uppercase tracking-[0.3em] font-medium block mb-2">
                  VENTURE MEMO
                </span>
                <h3 className="text-3xl md:text-4xl font-display italic text-text-primary leading-tight">
                  Ekenedirichukwu Isdore Amadi
                </h3>
                <p className="text-xs text-muted mt-1 font-mono uppercase">
                  FOUNDER, VURA TECH HUB
                </p>
              </div>

              {/* Modal Core Content */}
              <div className="space-y-6 text-sm sm:text-base text-muted leading-relaxed font-light">
                <p>
                  Every great venture begins with a spark of necessity, a vision to build something that bridges gaps and reshapes how people interact with technology. For Ekenedirichukwu Isdore Amadi, that vision materialized into a powerful ecosystem of platforms designed to solve real-world problems anchored by the officially registered enterprise, <strong className="text-text-primary font-medium">Vura Tech Hub</strong>.
                </p>

                {/* Chapter I */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xl text-text-primary font-display italic">
                    Chapter I: The Foundation – Vura Tech Hub
                  </h4>
                  <p>
                    Every empire needs a citadel. For Isdore, that foundation is Vura Tech Hub, a fully registered business entity built to house and incubate ambitious technological solutions. Far more than just a company name, Vura Tech Hub represents a commitment to high-performance software engineering, modern web design, and scalable digital infrastructure. Operating across languages like Python, C++, Java, Go, and Rust, the hub serves as the engine room where concept meets execution.
                  </p>
                </div>

                {/* Chapter II */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xl text-text-primary font-display italic">
                    Chapter II: Financial Horizons – The Vura Multi-Bank Aggregator
                  </h4>
                  <p>
                    In a world where financial interactions are increasingly fragmented, Isdore engineered Vura—a sophisticated multi-bank aggregator application. Designed to streamline financial tracking and management, this platform reflects a deep understanding of backend architecture and security. By unifying multiple banking interfaces into a cohesive experience, Vura showcases an ability to tackle complex, high-stakes fintech challenges with elegance and precision.
                  </p>
                </div>

                {/* Chapter III */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xl text-text-primary font-display italic">
                    Chapter III: Informing the Public – Realssa News
                  </h4>
                  <p>
                    Information is the currency of the modern age, and keeping people connected to what matters requires a robust digital backbone. Enter Realssa News (realssanews.com.ng), a dynamic digital news aggregation platform built and actively scaled by Isdore.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                    <li>
                      <strong className="text-text-primary font-medium">Under the Hood:</strong> Powered by automated backend crawler integrations, seamless database migrations, and a responsive frontend.
                    </li>
                    <li>
                      <strong className="text-text-primary font-medium">Impact:</strong> It delivers real-time, curated updates to its audience, proving that Isdore’s engineering prowess extends effortlessly into high-traffic content delivery systems.
                    </li>
                  </ul>
                </div>

                {/* Additional ventures */}
                <p>
                  Isdore’s portfolio goes beyond fintech and hospitality, stretching deep into commerce and real estate:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                  <li>
                    <strong className="text-text-primary font-medium">Dream Team Legacy:</strong> A sleek, high-conversion real estate marketing web platform designed to showcase properties and connect buyers with opportunities seamlessly.
                  </li>
                  <li>
                    <strong className="text-text-primary font-medium">VortexList:</strong> A versatile digital utility marketplace platform crafted to organize, list, and deliver digital assets and services efficiently.
                  </li>
                </ul>

                {/* Chapter IV: The Portfolio Table */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-xl text-text-primary font-display italic">
                    The Portfolio at a Glance
                  </h4>
                  
                  <div className="overflow-x-auto border border-stroke rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-surface/50 border-b border-stroke">
                          <th className="p-3 font-semibold text-text-primary uppercase tracking-wider text-[10px]">Project / Venture</th>
                          <th className="p-3 font-semibold text-text-primary uppercase tracking-wider text-[10px]">Category</th>
                          <th className="p-3 font-semibold text-text-primary uppercase tracking-wider text-[10px]">Core Technology & Highlights</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stroke">
                        <tr>
                          <td className="p-3 font-semibold text-text-primary whitespace-nowrap">Vura Tech Hub</td>
                          <td className="p-3 text-muted/80 whitespace-nowrap">Enterprise / Agency</td>
                          <td className="p-3 text-muted/80">Registered business entity anchoring all software and web design operations.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-text-primary whitespace-nowrap">
                            <a href="https://vura-app.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline decoration-stroke hover:decoration-accent">
                              Vura
                            </a>
                          </td>
                          <td className="p-3 text-muted/80 whitespace-nowrap">Fintech / Application</td>
                          <td className="p-3 text-muted/80">Multi-bank aggregator designed to unify and simplify financial management.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-text-primary whitespace-nowrap">
                            <a href="https://realssanews.com.ng" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline decoration-stroke hover:decoration-accent">
                              Realssa News
                            </a>
                          </td>
                          <td className="p-3 text-muted/80 whitespace-nowrap">Media / Aggregator</td>
                          <td className="p-3 text-muted/80">Automated backend crawlers, database architecture, live news delivery.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-text-primary whitespace-nowrap">
                            <a href="https://veeda-mu.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline decoration-stroke hover:decoration-accent">
                              VEEDA
                            </a>
                          </td>
                          <td className="p-3 text-muted/80 whitespace-nowrap">Clinical / Intelligence</td>
                          <td className="p-3 text-muted/80">Mobile-first clinical wellness intelligence platform for vital signs monitoring & NEWS2.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-text-primary whitespace-nowrap">
                            <a href="https://reeds-phi.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline decoration-stroke hover:decoration-accent">
                              LOYAL EDGE
                            </a>
                          </td>
                          <td className="p-3 text-muted/80 whitespace-nowrap">Sports / Analytics</td>
                          <td className="p-3 text-muted/80">Production-style sports telemetry and analytics website for soccer and basketball.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-text-primary whitespace-nowrap">DineFlow</td>
                          <td className="p-3 text-muted/80 whitespace-nowrap">Hospitality / SaaS</td>
                          <td className="p-3 text-muted/80">QR-code ordering and restaurant management platform.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-text-primary whitespace-nowrap">Dream Team Legacy</td>
                          <td className="p-3 text-muted/80 whitespace-nowrap">Real Estate / Web</td>
                          <td className="p-3 text-muted/80">Modern marketing platform for property listings and client acquisition.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-text-primary whitespace-nowrap">VortexList</td>
                          <td className="p-3 text-muted/80 whitespace-nowrap">Marketplace</td>
                          <td className="p-3 text-muted/80">Digital utility platform built for streamlined user transactions.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
