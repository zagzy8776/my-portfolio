import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { useMagnetic } from '../hooks/useMagnetic'

const ROLES = ['Creative', 'Fullstack', 'Founder', 'Scholar']

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
  const plateRef = useRef<HTMLDivElement>(null)
  const magneticRef = useMagnetic<HTMLButtonElement>({ strength: 0.28, radius: 100 })

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  // Crossfade portraits on a timer — works on mobile without scroll hacks
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % PORTRAITS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        '.name-reveal',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.08 }
      ).fromTo(
        '.blur-in',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 },
        '-=0.65'
      ).fromTo(
        '.portrait-stage',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.7'
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Desktop-only light tilt — disabled on touch
  useEffect(() => {
    const container = containerRef.current
    const plate = plateRef.current
    if (!container || !plate) return
    if (window.matchMedia('(hover: none)').matches) return

    let raf = 0
    let targetRX = 0
    let targetRY = 0
    let currentRX = 0
    let currentRY = 0

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      targetRY = x * 6
      targetRX = -y * 4
    }

    const onLeave = () => {
      targetRX = 0
      targetRY = 0
    }

    const tick = () => {
      currentRX += (targetRX - currentRX) * 0.1
      currentRY += (targetRY - currentRY) * 0.1
      plate.style.transform = `perspective(1200px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`
      raf = requestAnimationFrame(tick)
    }

    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      plate.style.transform = ''
    }
  }, [])

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full min-h-[100svh] flex items-center bg-bg px-5 sm:px-8 md:px-12 lg:px-16 pt-28 pb-16"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Copy — first on mobile so hierarchy is clear */}
        <div className="lg:col-span-6 flex flex-col items-start text-left order-2 lg:order-1">
          <h1 className="name-reveal text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display italic leading-[0.95] tracking-tight text-text-primary mb-4">
            Zagzy Link
          </h1>

          <div className="blur-in text-base md:text-lg text-muted mb-4">
            A{' '}
            <span
              key={roleIndex}
              className="font-display italic text-text-primary animate-role-fade-in inline-block mx-0.5"
            >
              {ROLES[roleIndex]}
            </span>{' '}
            based in Nigeria.
          </div>

          <p className="blur-in text-sm md:text-base text-muted max-w-md mb-8 leading-relaxed">
            Building digital products across fintech, clinical tools, trading
            infrastructure, and brand experiences.
          </p>

          <div className="blur-in flex flex-wrap items-center gap-3">
            <button
              ref={magneticRef}
              onClick={scrollToWork}
              className="rounded-full px-6 py-3 bg-text-primary text-bg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              View Work
            </button>
            <a
              href="mailto:amadiisdore92@gmail.com"
              className="rounded-full px-6 py-3 border border-stroke text-text-primary text-sm font-semibold hover:bg-surface transition-colors"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Portrait — always fully in view, no sticky/scroll scrub */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="portrait-stage relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] aspect-[3/4]">
            <div
              ref={plateRef}
              className="relative w-full h-full rounded-2xl overflow-hidden border border-stroke bg-surface will-change-transform"
            >
              {PORTRAITS.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={i === frameIndex ? 'Zagzy Link' : ''}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ease-out"
                  style={{
                    opacity: i === frameIndex ? 1 : 0,
                  }}
                  draggable={false}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pointer-events-none">
                <p className="text-xs sm:text-sm font-light text-text-primary">
                  Ekenedirichukwu Isdore Amadi
                </p>
                <p className="text-[11px] text-muted mt-0.5">Founder, Vura Tech Hub</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
