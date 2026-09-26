import { useRef, useEffect } from 'react'

interface MagneticOptions {
  strength?: number
  radius?: number
}

/**
 * Subtle magnetic pull toward cursor on interactive elements.
 * Apply the returned ref to the element you want magnetized.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options: MagneticOptions = {}
) {
  const { strength = 0.35, radius = 80 } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < radius) {
        targetX = dx * strength
        targetY = dy * strength
      } else {
        targetX = 0
        targetY = 0
      }
    }

    const onLeave = () => {
      targetX = 0
      targetY = 0
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.18
      currentY += (targetY - currentY) * 0.18
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      el.style.transform = ''
    }
  }, [strength, radius])

  return ref
}
