import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Expose Lenis instance so buttons / nav can call scrollTo */
declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
      infinite: false,
    })

    lenisRef.current = lenis
    window.__lenis = lenis

    // Keep ScrollTrigger in sync with Lenis virtual scroll
    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger after layout settles
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('resize', refresh)
    // Small delay so images / fonts don't throw measurements off
    const t = setTimeout(refresh, 400)

    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', refresh)
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
      delete window.__lenis
    }
  }, [])

  return <>{children}</>
}
