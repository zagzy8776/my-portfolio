import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '../hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

const ROLES = ['Creative', 'Fullstack', 'Founder', 'Scholar']

/** Story order: face-on confidence → dynamic smile → side glance → polished side */
const PORTRAITS = [
  '/portrait-4.png',
  '/portrait-1.png',
  '/portrait-2.png',
  '/portrait-3.png',
]

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [frameIndex, setFrameIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const plateRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<(HTMLImageElement | null)[]>([])
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
        { opacity: 1, y: 0, duration: 1.1, delay: 0.12 }
      )
        .fromTo(
          '.blur-in',
          { opacity: 0, y: 16, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.08 },
          '-=0.85'
        )
        .fromTo(
          '.portrait-stage',
          { opacity: 0, scale: 0.96, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 1.1 },
          '-=1.0'
        )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Scroll-scrubbed frames + 3D plate + mouse tilt
  useEffect(() => {
    const container = containerRef.current
    const plate = plateRef.current
    if (!container || !plate) return

    const frames = framesRef.current.filter(Boolean) as HTMLImageElement[]
    if (frames.length === 0) return

    // Ensure first frame visible, others hidden
    gsap.set(frames, { opacity: 0 })
    gsap.set(frames[0], { opacity: 1 })

    // Continuous scrub timeline for portrait sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.55,
        onUpdate: (self) => {
          const idx = Math.min(
            PORTRAITS.length - 1,
            Math.floor(self.progress * PORTRAITS.length)
          )
          setFrameIndex(idx)
        },
      },
    })

    // Crossfade between frames with slight scale/rotate for depth
    frames.forEach((frame, i) => {
      if (i === 0) return
      const start = (i - 0.85) / (PORTRAITS.length - 0.15)
      tl.fromTo(
        frame,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1, ease: 'none' },
        start
      )
      // Fade previous slightly so crossfade is clean
      if (frames[i - 1]) {
        tl.to(
          frames[i - 1],
          { opacity: 0, duration: 0.85, ease: 'none' },
          start
        )
      }
    })

    // Subtle scroll-driven 3D on the plate (works with mouse tilt)
    const scroll3d = { rx: 0, ry: 0, scale: 1 }
    gsap.to(scroll3d, {
      rx: -5,
      ry: 7,
      scale: 0.97,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Mouse tilt (composited with scroll 3D)
    let raf = 0
    let targetRX = 0
    let targetRY = 0
    let currentRX = 0
    let currentRY = 0
    let targetTX = 0
    let targetTY = 0
    let currentTX = 0
    let currentTY = 0

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      targetRY = x * 9
      targetRX = -y * 6
      targetTX = x * 14
      targetTY = y * 10
    }

    const onLeave = () => {
      targetRX = 0
      targetRY = 0
      targetTX = 0
      targetTY = 0
    }

    const tick = () => {
      currentRX += (targetRX - currentRX) * 0.08
      currentRY += (targetRY - currentRY) * 0.08
      currentTX += (targetTX - currentTX) * 0.08
      currentTY += (targetTY - currentTY) * 0.08

      // Combine mouse tilt + scroll-driven 3D
      plate.style.transform = `
        perspective(1200px)
        rotateX(${currentRX + scroll3d.rx}deg)
        rotateY(${currentRY + scroll3d.ry}deg)
        scale(${scroll3d.scale})
        translate3d(${currentTX}px, ${currentTY}px, 0)
      `
      raf = requestAnimationFrame(tick)
    }

    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      tl.scrollTrigger?.kill()
      tl.kill()
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === container)
        .forEach((st) => st.kill())
    }
  }, [])

  const scrollToWork = () => {
    const el = document.getElementById('work')
    if (!el) return
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: 0, duration: 1.2 })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-screen min-h-[160vh] flex items-start overflow-hidden bg-bg px-6 md:px-10 lg:px-16 pt-24"
    >
      {/* Sticky viewport so portrait sequence plays while user scrolls */}
      <div className="sticky top-0 h-screen w-full flex items-center">
        {/* Ambient */}
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
          {/* Copy */}
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
              <span className="hidden sm:inline opacity-30">|</span>
              <span className="hidden sm:inline">Vura Tech Hub</span>
            </div>
          </div>

          {/* Portrait sequence */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div
              ref={stageRef}
              className="portrait-stage relative w-full max-w-[420px] md:max-w-[460px] aspect-[3/4] select-none"
            >
              <div className="absolute -inset-8 rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(78,133,191,0.2)_0%,transparent_65%)] blur-2xl pointer-events-none" />

              <div
                ref={plateRef}
                className="relative w-full h-full rounded-[28px] overflow-hidden border border-white/10 bg-surface shadow-2xl shadow-black/40 will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Stacked frames — GSAP drives opacity continuously */}
                {PORTRAITS.map((src, i) => (
                  <img
                    key={src}
                    ref={(el) => {
                      framesRef.current[i] = el
                    }}
                    src={src}
                    alt=""
                    aria-hidden={i !== frameIndex}
                    className="portrait-frame absolute inset-0 w-full h-full object-cover object-top"
                    style={{
                      opacity: i === 0 ? 1 : 0,
                      zIndex: i + 1,
                    }}
                    draggable={false}
                  />
                ))}

                <div className="absolute inset-0 z-[10] bg-gradient-to-t from-bg/90 via-bg/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 z-[10] bg-gradient-to-r from-bg/25 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-0 left-0 right-0 z-[11] p-5 md:p-6 pointer-events-none">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted mb-1">
                    Founder
                  </p>
                  <p className="text-sm md:text-base font-light text-text-primary">
                    Ekenedirichukwu Isdore Amadi
                  </p>
                </div>
              </div>

              {/* Frame progress dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {PORTRAITS.map((_, i) => (
                  <span
                    key={i}
                    className={`block h-1 rounded-full transition-all duration-300 ${
                      i === frameIndex
                        ? 'w-6 bg-text-primary'
                        : 'w-1.5 bg-stroke'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
