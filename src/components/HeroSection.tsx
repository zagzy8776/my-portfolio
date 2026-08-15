import { useEffect, useState, useRef } from 'react'
import Hls from 'hls.js'
import gsap from 'gsap'

const ROLES = ["Creative", "Fullstack", "Founder", "Scholar"]

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Cycle through roles every 2000ms
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Load HLS Video Background
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const src = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => {
        hls.destroy()
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    }
  }, [])

  // GSAP Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      
      tl.fromTo(".name-reveal", 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      )
      .fromTo(".blur-in",
        { opacity: 0, y: 20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.1 },
        "-=0.9" // start overlap
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

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
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/25 z-10" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent z-20" />
      </div>

      {/* Hero Content (z-10) */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl pt-16">
        {/* Eyebrow */}
        <span className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8 select-none">
          COLLECTION '26
        </span>

        {/* Name */}
        <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6 select-none">
          Zagzy Link
        </h1>

        {/* Role line */}
        <div className="blur-in text-lg md:text-xl lg:text-2xl text-muted mb-6 select-none">
          A{' '}
          <span 
            key={roleIndex} 
            className="font-display italic text-text-primary animate-role-fade-in inline-block mx-1"
          >
            {ROLES[roleIndex]}
          </span>{' '}
          lives in Nigeria.
        </div>

        {/* Description */}
        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12 leading-relaxed">
          Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.
        </p>

        {/* CTA Buttons */}
        <div className="blur-in inline-flex items-center gap-4">
          {/* See Works */}
          <button 
            onClick={scrollToWork}
            className="relative rounded-full p-[1.5px] hover:scale-105 transition-transform duration-300 group/btn"
          >
            <div className="absolute inset-0 rounded-full bg-transparent group-hover/btn:accent-gradient transition-all duration-300" />
            <div className="relative px-7 py-3.5 bg-text-primary text-bg group-hover/btn:bg-bg group-hover/btn:text-text-primary rounded-full text-sm font-semibold transition-all duration-300">
              See Works
            </div>
          </button>

          {/* Reach out... */}
          <a
            href="mailto:amadiisdore92@gmail.com"
            className="relative rounded-full p-[1.5px] hover:scale-105 transition-transform duration-300 group/btn"
          >
            <div className="absolute inset-0 rounded-full bg-transparent group-hover/btn:accent-gradient transition-all duration-300" />
            <div className="relative px-7 py-3.5 border-2 border-stroke group-hover/btn:border-transparent bg-bg text-text-primary rounded-full text-sm font-semibold transition-all duration-300">
              Reach out...
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
          SCROLL
        </span>
        <div className="w-[1px] h-10 bg-stroke overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-4 bg-text-primary/70 animate-scroll-down rounded-full" />
        </div>
      </div>
    </section>
  )
}
