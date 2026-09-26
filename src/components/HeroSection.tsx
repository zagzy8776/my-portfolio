import { useEffect, useState, useRef, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { useMagnetic } from '../hooks/useMagnetic'

const Scene3D = lazy(() => import('./Scene3D'))

const ROLES = ["Creative", "Fullstack", "Founder", "Scholar"]

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cycle through roles every 2200ms
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  // GSAP Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      
      tl.fromTo(".name-reveal", 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, delay: 0.1 }
      )
      .fromTo(".blur-in",
        { opacity: 0, y: 16, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.08 },
        "-=0.85"
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const magneticRef = useMagnetic<HTMLButtonElement>({ strength: 0.28, radius: 100 })

  const scrollToWork = () => {
    const workSection = document.getElementById('work')
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="home" 
      ref={containerRef} 
      className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-bg text-center px-4"
    >
      {/* 3D Background Scene */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <Suspense fallback={<div className="absolute inset-0 bg-bg" />}>
          <Scene3D />
        </Suspense>
        {/* Subtle overlay for text legibility */}
        <div className="absolute inset-0 bg-black/10 z-10" />
        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent z-20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl pt-16">
        {/* Eyebrow — cleaner */}
        <span className="blur-in text-xs text-muted uppercase tracking-[0.25em] mb-6 select-none">
          Portfolio · 2026
        </span>

        {/* Name */}
        <h1 className="name-reveal text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.92] tracking-tight text-text-primary mb-5 select-none">
          Zagzy Link
        </h1>

        {/* Role line */}
        <div className="blur-in text-base md:text-xl lg:text-2xl text-muted mb-5 select-none">
          A{' '}
          <span 
            key={roleIndex} 
            className="font-display italic text-text-primary animate-role-fade-in inline-block mx-1"
          >
            {ROLES[roleIndex]}
          </span>{' '}
          based in Nigeria.
        </div>

        {/* Description */}
        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-10 leading-relaxed">
          Designing seamless digital products with a focus on systems that feel intentional and human.
        </p>

        {/* CTA Buttons */}
        <div className="blur-in inline-flex items-center gap-3 sm:gap-4">
          <button 
            ref={magneticRef}
            onClick={scrollToWork}
            className="relative rounded-full p-[1.5px] hover:scale-[1.03] transition-transform duration-300 group/btn will-change-transform"
          >
            <div className="absolute inset-0 rounded-full bg-transparent group-hover/btn:accent-gradient transition-all duration-300" />
            <div className="relative px-6 sm:px-7 py-3 sm:py-3.5 bg-text-primary text-bg group-hover/btn:bg-bg group-hover/btn:text-text-primary rounded-full text-sm font-semibold transition-all duration-300">
              View Work
            </div>
          </button>

          <a
            href="mailto:amadiisdore92@gmail.com"
            className="relative rounded-full p-[1.5px] hover:scale-[1.03] transition-transform duration-300 group/btn"
          >
            <div className="absolute inset-0 rounded-full bg-transparent group-hover/btn:accent-gradient transition-all duration-300" />
            <div className="relative px-6 sm:px-7 py-3 sm:py-3.5 border border-stroke group-hover/btn:border-transparent bg-bg text-text-primary rounded-full text-sm font-semibold transition-all duration-300">
              Get in touch
            </div>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        onClick={scrollToWork}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer group/scroll"
      >
        <span className="text-[10px] text-muted uppercase tracking-[0.25em] transition-colors duration-300 group-hover/scroll:text-text-primary select-none">
          Scroll
        </span>
        <div className="w-[1px] h-10 bg-stroke overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-4 bg-text-primary/70 animate-scroll-down rounded-full" />
        </div>
      </div>
    </section>
  )
}
