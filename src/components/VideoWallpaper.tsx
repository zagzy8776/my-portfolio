import { useEffect, useRef } from 'react'

/**
 * VideoWallpaper — fixed cinematic wall behind the hero.
 *
 * Professional behaviour contract:
 *  - LOOP   — muted inline loop + an 8s Ken Burns drift (matches the 8s
 *             clip) so the loop point is invisible.
 *  - AMBIENT — settles to a slow 0.85x drift at rest; pauses when the tab
 *             is hidden or the hero has scrolled away (battery-first).
 *  - SENSOR — scroll velocity surges playbackRate up to 2x with eased
 *             return, so flicks feel connected to the footage.
 *  - STOP   — once the hero leaves the viewport the rate eases to 0 and
 *             the video pauses; the wall itself fades out so later
 *             sections sit on solid theme background.
 *  - THEME  — grade + scrim are built from hsl(var(--bg)) tokens, so the
 *             same footage blends in dark AND light mode.
 */
export default function VideoWallpaper() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wallRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const wall = wallRef.current
    if (!video || !wall) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let targetRate = 0.85
    let currentRate = 0.85
    let lastY = window.scrollY
    let lastT = performance.now()
    let settleTimer = 0

    const tick = () => {
      currentRate += (targetRate - currentRate) * 0.08
      if (Math.abs(targetRate - currentRate) < 0.01) currentRate = targetRate
      try {
        if (video.playbackRate !== currentRate) video.playbackRate = currentRate
      } catch {
        /* noop — some mobile browsers lock playbackRate */
      }
      raf = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const now = performance.now()
      const y = window.scrollY
      const dt = Math.max(now - lastT, 16)
      const velocity = Math.abs(y - lastY) / dt // px per ms
      lastY = y
      lastT = now

      const hero = document.getElementById('home')
      const vh = window.innerHeight || 1
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : vh

      // Wall belongs to the hero: dissolve as it scrolls away.
      const wallOpacity = Math.max(0, Math.min(1, heroBottom / vh))
      wall.style.opacity = wallOpacity.toFixed(3)
      wall.style.visibility = wallOpacity <= 0.01 ? 'hidden' : 'visible'

      if (heroBottom < vh * 0.15) {
        // Professional stop — ease to still, then pause.
        targetRate = 0
        if (!video.paused && currentRate < 0.08) video.pause()
        return
      }

      if (video.paused) video.play().catch(() => {})

      // Sensor — flick fast, footage surges; rest, it breathes.
      targetRate = Math.min(2, 0.85 + velocity * 1.1)
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        targetRate = 0.85
      }, 140)
    }

    const onVisibility = () => {
      if (document.hidden) {
        video.pause()
      } else {
        const hero = document.getElementById('home')
        const visible = !hero || hero.getBoundingClientRect().bottom > 0
        if (visible) video.play().catch(() => {})
      }
    }

    video.play().catch(() => {})
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(tick)
    onScroll()

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settleTimer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div ref={wallRef} aria-hidden="true" className="video-wall">
      <video
        ref={videoRef}
        className="video-wall-media"
        src="/wallpaper.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
      />
      {/* Theme-reactive cinematic grade */}
      <div className="video-wall-grade" />
      {/* Readability scrim — guarantees text contrast in both themes */}
      <div className="video-wall-scrim" />
    </div>
  )
}
