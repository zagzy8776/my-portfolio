import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Landmark, Newspaper, ShieldAlert, Award, Layers, TrendingUp, Shirt } from 'lucide-react'

interface TimelineItem {
  year: string
  title: string
  subtitle: string
  description: string
  link?: string
  linkText?: string
  icon: any
}

const ITEMS: TimelineItem[] = [
  {
    year: "Foundation",
    title: "Vura Tech Hub",
    subtitle: "Registered enterprise",
    description: "Established Vura Tech Hub as a registered business to incubate digital products. Focus on high-performance engineering and modern frontend systems across Python, C++, Java, Go, and Rust.",
    icon: Layers
  },
  {
    year: "Fintech",
    title: "Vura Multi-Bank Aggregator",
    subtitle: "Financial platform",
    description: "Built a multi-bank aggregator that unifies multiple banking interfaces into a single dashboard, with attention to security and transaction reliability.",
    link: "https://vura-app.vercel.app",
    linkText: "View Vura",
    icon: Landmark
  },
  {
    year: "Trading",
    title: "MT5 Control Room",
    subtitle: "Algorithmic trading systems",
    description: "Designed and shipped a full control-room dashboard for MetaTrader 5 — live signal pipeline, risk engine, position management, and bot execution for Exness accounts.",
    link: "https://frontend-three-eta-53.vercel.app/",
    linkText: "View MT5 Control Room",
    icon: TrendingUp
  },
  {
    year: "Media",
    title: "Realssa News",
    subtitle: "News aggregation",
    description: "Designed and scaled a news delivery platform powered by automated crawlers, live database sync, and responsive delivery.",
    link: "https://realssanews.com.ng",
    linkText: "Visit Realssa",
    icon: Newspaper
  },
  {
    year: "Health",
    title: "VEEDA Clinical Intelligence",
    subtitle: "Mobile wellness platform",
    description: "Engineered a mobile-first clinical platform for vital-sign tracking, NEWS2 scoring, and faster emergency response.",
    link: "https://veeda-mu.vercel.app/",
    linkText: "View VEEDA",
    icon: ShieldAlert
  },
  {
    year: "Fashion",
    title: "BV Stitches",
    subtitle: "3D fashion experience",
    description: "Built an immersive 3D fashion and atelier experience focused on product storytelling and modern e-commerce presentation.",
    link: "https://bvstitches.vercel.app/",
    linkText: "View BV Stitches",
    icon: Shirt
  },
  {
    year: "Sports",
    title: "Loyal Edge Analytics",
    subtitle: "Sports telemetry",
    description: "Developed a sports analytics site for soccer and basketball, processing schedules and high-volume performance data.",
    link: "https://reeds-phi.vercel.app",
    linkText: "View Loyal Edge",
    icon: Award
  }
]

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const scaleY = useTransform(scrollYProgress, [0.05, 0.85], [0, 1])

  return (
    <section 
      id="experience" 
      ref={sectionRef} 
      className="bg-bg py-20 md:py-28 relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative">
        
        <div className="text-center max-w-lg mx-auto mb-16 md:mb-24 space-y-3">
          <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium block">
            Journey
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-text-primary leading-tight">
            Career <span className="font-display italic text-text-primary/95">timeline</span>
          </h2>
          <p className="text-sm md:text-base text-muted leading-relaxed">
            Selected milestones across software, fintech, media, and clinical systems.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-stroke -translate-x-1/2">
            <motion.div 
              className="accent-gradient w-full h-full origin-top"
              style={{ scaleY }}
            />
          </div>

          <div className="space-y-14 md:space-y-20">
            {ITEMS.map((item, idx) => {
              const IconComponent = item.icon
              const isEven = idx % 2 === 0
              
              return (
                <div 
                  key={item.title}
                  className={`flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } relative min-h-[140px]`}
                >
                  <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-12 flex flex-col items-start">
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.55, delay: 0.05 }}
                      className="bg-surface border border-stroke rounded-2xl p-5 sm:p-7 space-y-3 shadow-lg shadow-black/10 w-full"
                    >
                      <span className="text-[10px] text-muted tracking-widest font-medium uppercase bg-stroke/50 border border-stroke px-2.5 py-1 rounded-full inline-block">
                        {item.year}
                      </span>
                      
                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-light text-text-primary">
                          {item.title}
                        </h3>
                        <p className="text-[10px] text-muted uppercase tracking-widest font-semibold">
                          {item.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">
                        {item.description}
                      </p>

                      {item.link && (
                        <div className="pt-1">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-text-primary font-semibold hover:opacity-80 group transition-opacity"
                          >
                            {item.linkText} <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                          </a>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <div className="absolute left-6 md:left-1/2 top-4 -translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", damping: 16 }}
                      className="w-10 h-10 rounded-full bg-surface border border-stroke flex items-center justify-center p-[1px] shadow-lg shadow-black/30"
                    >
                      <div className="absolute inset-0 rounded-full accent-gradient opacity-40" />
                      <div className="relative w-full h-full bg-surface rounded-full flex items-center justify-center text-text-primary">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="hidden md:block w-1/2" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
