import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { useMagnetic } from '../hooks/useMagnetic'

const ROLES = ['Creative', 'Fullstack', 'Founder', 'Scholar']

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const magneticRef = useMagnetic<HTMLButtonElement>({ strength: 0.28, radius: 100 })

  // Role cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  // Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        '.name-reveal',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, delay: 0.15 }
      )
        .fromTo(
          '.blur-in',
          { opacity: 0, y: 16, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.08 },
          '-=0.85'
        )
        .fromTo(
          '.portrait-stage',
          { opacity: 0, scale: 0.94, y: 28 },
          { opacity: 1, scale: 1, y: 0, duration: 1.15 },
          '-=1.0'
        )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Mouse 3D tilt + scroll parallax
  useEffect(() => {
    const container = containerRef.current
    const portrait = portraitRef.current
    const frame = frameRef.current
    const glow = glowRef.current
    if (!container || !portrait) return

    let raf = 0
    let targetRX = 0
    let targetRY = 0
    let currentRX = 0
    let currentRY = 0
    let targetTX = 0
    let targetTY = 0
    let currentTX = 0
    let currentTY = 0
    let scrollY = 0

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      // Max tilt ~8deg — confident, not toy-like
      targetRY = x * 10
      targetRX = -y * 7
      targetTX = x * 18
      targetTY = y * 12
    }

    const onLeave = () => {
      targetRX = 0
      targetRY = 0
      targetTX = 0
      targetTY = 0
    }

    const onScroll = () => {
      scrollY = window.scrollY
    }

    const tick = () => {
      currentRX += (targetRX - currentRX) * 0.08
      currentRY += (targetRY - currentRY) * 0.08
      currentTX += (targetTX - currentTX) * 0.08
      currentTY += (targetTY - currentTY) * 0.08

      const parallax = Math.min(scrollY * 0.12, 80)

      portrait.style.transform = `
        perspective(1200px)
        rotateX(${currentRX}deg)
        rotateY(${currentRY}deg)
        translate3d(${currentTX}px, ${currentTY + parallax * 0.35}px, 0)
      `

      if (frame) {
        frame.style.transform = `
          perspective(1200px)
          rotateX(${currentRX * 0.6}deg)
          rotateY(${currentRY * 0.6}deg)
          translate3d(${currentTX * 0.4}px, ${currentTY * 0.4 + parallax * 0.2}px, -40px)
        `
      }

      if (glow) {
        glow.style.transform = `
          translate3d(${currentTX * 1.4}px, ${currentTY * 1.2}px, 0)
          scale(${1 + Math.abs(currentRY) * 0.004})
        `
      }

      raf = requestAnimationFrame(tick)
    }

    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-screen min-h-screen flex items-center overflow-hidden bg-bg px-6 md:px-10 lg:px-16 pt-24 pb-16"
    >
      {/* Ambient grid / depth */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--stroke)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--stroke)) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute top-1/4 right-0 w-[55%] h-[70%] bg-[radial-gradient(ellipse_at_center,rgba(78,133,191,0.12)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* ——— Copy ——— */}
        <div className="lg:col-span-6 flex flex-col items-start text-left order-2 lg:order-1">
          <span className="blur-in text-xs text-muted uppercase tracking-[0.25em] mb-5 select-none">
            Portfolio · 2026
          </span>

          <h1 className="name-reveal text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display italic leading-[0.92] tracking-tight text-text-primary mb-5 select-none">
            Zagzy Link
          </h1>

          <div className="blur-in text-base md:text-xl text-muted mb-5 select-none">
            A{' '}
            <span
              key={roleIndex}
              className="font-display italic text-text-primary animate-role-fade-in inline-block mx-1"
            >
              {ROLES[roleIndex]}
            </span>{' '}
            based in Nigeria.
          </div>

          <p className="blur-in text-sm md:text-base text-muted max-w-md mb-9 leading-relaxed">
            Designing and shipping digital products with systems thinking —
            fintech, clinical tools, trading infrastructure, and brand experiences.
          </p>

          <div className="blur-in inline-flex flex-wrap items-center gap-3 sm:gap-4">
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

          <div className="blur-in mt-10 flex items-center gap-6 text-[11px] text-muted uppercase tracking-[0.18em]">
            <span className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Open to projects
            </span>
            <span className="hidden sm:inline text-stroke">|</span>
            <span className="hidden sm:inline">Vura Tech Hub</span>
          </div>
        </div>

        {/* ——— Portrait stage (3D tilt) ——— */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="portrait-stage relative w-full max-w-[420px] md:max-w-[460px] aspect-[3/4] select-none">
            {/* Soft accent glow — follows mouse slower */}
            <div
              ref={glowRef}
              className="absolute -inset-8 rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(78,133,191,0.22)_0%,transparent_65%)] blur-2xl pointer-events-none will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            />

            {/* Depth frame behind photo */}
            <div
              ref={frameRef}
              className="absolute inset-3 rounded-[28px] border border-stroke/80 bg-surface/40 will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            />

            {/* Main portrait plate */}
            <div
              ref={portraitRef}
              className="relative w-full h-full rounded-[28px] overflow-hidden border border-white/10 bg-surface shadow-2xl shadow-black/40 will-change-transform"
              style={{ transformStyle: 'preserve-3d', transform: 'perspective(1200px)' }}
            >
              <img
                src="/portrait-4.png"
                alt="Zagzy Link — Founder, Vura Tech Hub"
                className="absolute inset-0 w-full h-full object-cover object-top"
                draggable={false}
              />
              {/* Cinematic grade */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg/30 via-transparent to-transparent" />

              {/* Bottom identity strip */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted mb-1">
                  Founder
                </p>
                <p className="text-sm md:text-base font-light text-text-primary">
                  Ekenedirichukwu Isdore Amadi
                </p>
              </div>
            </div>

            {/* Floating accent chip */}
            <div className="absolute -bottom-3 -left-2 md:left-0 px-3 py-1.5 rounded-full border border-stroke bg-surface/90 backdrop-blur-md text-[10px] uppercase tracking-[0.15em] text-muted shadow-lg">
              Building systems that ship
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        type="button"
        onClick={scrollToWork}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer group/scroll"
        aria-label="Scroll to work"
      >
        <span className="text-[10px] text-muted uppercase tracking-[0.25em] transition-colors duration-300 group-hover/scroll:text-text-primary select-none">
          Scroll
        </span>
        <div className="w-[1px] h-10 bg-stroke overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-4 bg-text-primary/70 animate-scroll-down rounded-full" />
        </div>
      </button>
    </section>
  )
}
