import { useEffect, useState, type RefObject } from 'react'
import { useScroll, useSpring, type MotionValue } from 'framer-motion'

/**
 * Document-scoped reading progress, smoothed with a spring.
 *
 * `useScroll` with `target` tracks progress through that element; running it on
 * `document.body` gives progress through the whole article regardless of how
 * the masthead is laid out.
 */
export function useReadingProgress(target?: RefObject<HTMLElement>): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: target as RefObject<HTMLElement>,
    offset: ['start start', 'end end'],
  })

  return useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
}

/** Tracks which h2 anchor is currently in view, for the table of contents. */
export function useActiveHeading(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    if (ids.length === 0) return

    const handler = () => {
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= 160) current = id
      }
      setActive(current ?? ids[0] ?? null)
    }

    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
    // `key` captures the id list identity without re-subscribing per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return active
}
