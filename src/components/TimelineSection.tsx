import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Landmark, Newspaper, ShieldAlert, Award, Layers } from 'lucide-react'

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
    year: "Founding Hub",
    title: "Vura Tech Hub Enterprise",
    subtitle: "CITADEL OF DIGITAL SOLUTIONS",
    description: "Established Vura Tech Hub as a registered enterprise built to incubate digital innovations. Built infrastructure supporting Python, C++, Java, Go, and Rust backend engineering and premium frontends.",
    icon: Layers
  },
  {
    year: "Fintech Platform",
    title: "Vura Multi-Bank Aggregator",
    subtitle: "FINANCIAL HORIZONS",
    description: "Designed Vura, a multi-bank aggregator application simplifying financial management by integrating multiple banking APIs into a single dashboard. Secured and optimized backend transactions.",
    link: "https://vura-app.vercel.app",
    linkText: "Launch Vura App",
    icon: Landmark
  },
  {
    year: "Media Aggregator",
    title: "Realssa News Delivery",
    subtitle: "REAL-TIME CURATED MEDIA",
    description: "Created and scaled Realssa News, a high-traffic news aggregation service running automated backend web crawlers, live database synchronization, and seamless feeds.",
    link: "https://realssanews.com.ng",
    linkText: "Visit Realssa News",
    icon: Newspaper
  },
  {
    year: "Clinical Wellness",
    title: "VEEDA Clinical Intelligence",
    subtitle: "MOBILE HEALTH TELEMETRY",
    description: "Engineered VEEDA, a mobile-first clinical wellness platform tracking vital signs, calculating NEWS2 emergency scores, and accelerating emergency response.",
    link: "https://veeda-mu.vercel.app",
    linkText: "Launch VEEDA platform",
    icon: ShieldAlert
  },
  {
    year: "Sports Metrics",
    title: "LOYAL EDGE Analytics",
    subtitle: "HIGH-FIDELITY SPORTS FORECASTS",
    description: "Developed Loyal Edge, a telemetry and sports analytics website for soccer and basketball forecasting. Processes high-volume stats and schedules.",
    link: "https://reeds-phi.vercel.app",
    linkText: "Visit Loyal Edge",
    icon: Award
  }
]

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Track scroll progress inside this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Normalize scaleY transformation
  const scaleY = useTransform(scrollYProgress, [0.05, 0.85], [0, 1])

  return (
    <section 
      id="experience" 
      ref={sectionRef} 
      className="bg-bg py-20 md:py-32 relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-lg mx-auto mb-20 md:mb-28 space-y-4">
          <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium block">
            Venture Journey
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-text-primary leading-tight">
            Career <span className="font-display italic text-text-primary/95">timeline</span>
          </h2>
          <p className="text-sm md:text-base text-muted leading-relaxed">
            A chronological look at Ekenedirichukwu Isdore Amadi’s software engineering, fintech, media, and medical ventures.
          </p>
        </div>

        {/* Timeline Core */}
        <div className="relative">
          
          {/* Vertical Progress Line (Desktop: Centered, Mobile: Left Aligned) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-stroke -translate-x-1/2">
            <motion.div 
              className="accent-gradient w-full h-full origin-top"
              style={{ scaleY }}
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-16 md:space-y-24">
            {ITEMS.map((item, idx) => {
              const IconComponent = item.icon
              const isEven = idx % 2 === 0
              
              return (
                <div 
                  key={item.title}
                  className={`flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } relative min-h-[150px]`}
                >
                  
                  {/* Left / Right Content Box */}
                  <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-12 flex flex-col items-start">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="bg-surface border border-stroke rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg shadow-black/10 w-full"
                    >
                      {/* Badge / Year */}
                      <span className="text-[10px] text-muted tracking-widest font-mono uppercase bg-stroke/50 border border-stroke px-2.5 py-1 rounded-full inline-block">
                        {item.year}
                      </span>
                      
                      {/* Titles */}
                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-light text-text-primary">
                          {item.title}
                        </h3>
                        <p className="text-[10px] text-muted uppercase tracking-widest font-semibold">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">
                        {item.description}
                      </p>

                      {/* Link (Optional) */}
                      {item.link && (
                        <div className="pt-2">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-text-primary font-semibold hover:text-accent group"
                          >
                            {item.linkText} <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                          </a>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Centered Node Icon */}
                  <div className="absolute left-6 md:left-1/2 top-4 -translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", damping: 15 }}
                      className="w-10 h-10 rounded-full bg-surface border border-stroke flex items-center justify-center p-[1px] shadow-lg shadow-black/30 group hover:scale-115 transition-transform"
                    >
                      <div className="absolute inset-0 rounded-full accent-gradient animate-gradient-shift opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="relative w-full h-full bg-surface rounded-full flex items-center justify-center text-text-primary">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Spacer for desktop alignment */}
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
