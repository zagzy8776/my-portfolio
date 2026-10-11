import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
      autoRaf: false,
    })

    lenisRef.current = lenis
    window.__lenis = lenis

    // Sync Lenis ↔ ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Single RAF loop driven by GSAP ticker
    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('resize', refresh)
    const t1 = setTimeout(refresh, 300)
    const t2 = setTimeout(refresh, 1000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', refresh)
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
      delete window.__lenis
    }
  }, [])

  return <>{children}</>
}
