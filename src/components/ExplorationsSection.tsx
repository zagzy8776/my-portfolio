import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

interface ExplorationItem {
  id: number
  title: string
  image: string
  rotation: string
}

const ITEMS: ExplorationItem[] = [
  {
    id: 1,
    title: "Abstract Fluid Wave",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    rotation: "rotate-[-3deg]"
  },
  {
    id: 2,
    title: "Vibrant Color Splatter",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop",
    rotation: "rotate-[4deg]"
  },
  {
    id: 3,
    title: "Minimalist Geometry",
    image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop",
    rotation: "rotate-[-2deg]"
  },
  {
    id: 4,
    title: "Dark Flowing Streams",
    image: "https://images.unsplash.com/photo-1618005198143-e528346d9a59?q=80&w=800&auto=format&fit=crop",
    rotation: "rotate-[3deg]"
  },
  {
    id: 5,
    title: "Futuristic Glass Render",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
    rotation: "rotate-[-4deg]"
  },
  {
    id: 6,
    title: "Monochrome Pattern",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
    rotation: "rotate-[2deg]"
  }
]

export default function ExplorationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Pinned Center Text Section (Layer 1)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        pinSpacing: false,
      })

      // 2. Parallax Scrolling Columns (Layer 2)
      // Left Column scrolls faster (upwards)
      gsap.fromTo(".col-left-card", 
        { y: 80 },
        {
          y: -180,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          }
        }
      )

      // Right Column scrolls slower (downwards/slower movement)
      gsap.fromTo(".col-right-card", 
        { y: -100 },
        {
          y: 120,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className="relative w-screen min-h-[300vh] bg-bg overflow-visible"
    >
      {/* Layer 1: Pinned Center (z-10) */}
      <div 
        ref={pinRef} 
        className="absolute inset-0 w-full h-screen flex flex-col justify-center items-center z-10 pointer-events-none"
      >
        <div className="text-center space-y-6 max-w-lg px-6 pointer-events-auto">
          <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium block">
            Explorations
          </span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tight text-text-primary leading-tight">
            Visual <span className="font-display italic text-text-primary/95">playground</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-sm mx-auto leading-relaxed">
            A sandbox of visual concepts, 3D renders, and digital art experiments.
          </p>
          
          {/* Dribbble Button */}
          <div className="pt-4">
            <a 
              href="https://dribbble.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative inline-flex rounded-full p-[1px] group/dribbble"
            >
              <div className="absolute inset-0 rounded-full bg-transparent group-hover/dribbble:accent-gradient transition-all duration-500 animate-gradient-shift" />
              <div className="relative px-6 py-3 bg-surface border border-stroke rounded-full text-xs font-semibold text-text-primary flex items-center gap-2 group-hover/dribbble:border-transparent transition-all duration-300">
                Follow on Dribbble <span className="inline-block transition-transform duration-300 group-hover/dribbble:translate-x-0.5">↗</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Layer 2: Parallax Columns (z-20, absolute/scrolling relative to page) */}
      <div className="relative w-full z-20 flex justify-center px-4 py-32 pointer-events-none">
        <div className="grid grid-cols-2 gap-8 md:gap-32 w-full max-w-[1200px] items-start">
          
          {/* Column 1 (Left) - Items 0, 2, 4 */}
          <div className="flex flex-col gap-32 md:gap-64 pt-24">
            {ITEMS.filter((_, idx) => idx % 2 === 0).map((item) => (
              <div 
                key={item.id}
                onClick={() => setLightboxImage(item.image)}
                className={`col-left-card ${item.rotation} aspect-square w-full max-w-[280px] md:max-w-[320px] mx-auto bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer pointer-events-auto shadow-xl shadow-black/20 hover:scale-105 hover:border-text-primary/20 transition-all duration-500 group`}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-text-primary/95 font-medium">{item.title}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 (Right) - Items 1, 3, 5 */}
          <div className="flex flex-col gap-32 md:gap-64 pt-64 md:pt-96">
            {ITEMS.filter((_, idx) => idx % 2 !== 0).map((item) => (
              <div 
                key={item.id}
                onClick={() => setLightboxImage(item.image)}
                className={`col-right-card ${item.rotation} aspect-square w-full max-w-[280px] md:max-w-[320px] mx-auto bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer pointer-events-auto shadow-xl shadow-black/20 hover:scale-105 hover:border-text-primary/20 transition-all duration-500 group`}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-text-primary/95 font-medium">{item.title}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close Button */}
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-text-primary transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent close on image click
            >
              <img 
                src={lightboxImage} 
                alt="Exploration preview" 
                className="w-full h-full object-contain mx-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
