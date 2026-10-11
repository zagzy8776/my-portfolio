import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import PlaygroundCard from './PlaygroundCard'
import { EXPLORATION_ITEMS, rotationFor, fallbackImage, type ExplorationItem } from '../data/explorations'

gsap.registerPlugin(ScrollTrigger)

export default function ExplorationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState<ExplorationItem | null>(null)

  const close = useCallback(() => setActive(null), [])

  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    setIsTouch(
      window.matchMedia('(hover: none), (pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
    )
  }, [])

  useEffect(() => {
    // Pinned + scrubbed parallax is heavy on mobile GPUs and fights native
    // fling scrolling — keep it desktop-only. On touch devices the columns
    // render statically (see `isTouch` below) so no ScrollTriggers needed.
    const isTouchDevice =
      window.matchMedia('(hover: none), (pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinRef.current,
        pinSpacing: false,
      })

      gsap.fromTo(
        '.col-left-card',
        { y: 80 },
        {
          y: -180,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      )

      gsap.fromTo(
        '.col-right-card',
        { y: -100 },
        {
          y: 120,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /**
   * While the lightbox is open the page must stop moving behind it — Lenis
   * would otherwise keep scrolling the parallax columns underneath the overlay.
   * Escape closes, and focus moves to the close button so keyboard users are
   * not left behind the modal.
   */
  useEffect(() => {
    if (!active) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    const lenis = window.__lenis
    lenis?.stop()
    document.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      lenis?.start()
    }
  }, [active, close])

  return (
    <section
      ref={sectionRef}
      className={`relative w-screen bg-bg overflow-visible ${
        isTouch ? 'min-h-0 py-20' : 'min-h-[300vh]'
      }`}
    >
      {isTouch ? (
        /* ── Touch: simple static stack, zero scroll-linked work ── */
        <div className="relative z-10 w-full flex flex-col items-center gap-8 px-6">
          <div className="text-center space-y-4 max-w-lg">
            <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium block">
              Explorations
            </span>
            <h2 className="text-4xl font-light tracking-tight text-text-primary leading-tight">
              Visual <span className="font-display italic text-text-primary/95">playground</span>
            </h2>
            <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
              A collection of visual experiments, renders, and design studies.
            </p>
          </div>
          <div className="w-full max-w-md flex flex-col gap-5">
            {EXPLORATION_ITEMS.map((item) => (
              <button
                key={item.title}
                onClick={() => setActive(item)}
                className="relative w-full aspect-[4/3] bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer shadow-xl shadow-black/20 active:scale-[0.98] transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/60"
              >
                <PlaygroundCard
                  src={item.image}
                  alt={item.title}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 pointer-events-none">
                  <span className="text-xs text-text-primary/95 font-medium">{item.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
      <>
      <div
        ref={pinRef}
        className="absolute inset-0 w-full h-screen flex flex-col justify-center items-center z-10 pointer-events-none"
      >
        <div className="text-center space-y-5 max-w-lg px-6 pointer-events-auto">
          <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium block">
            Explorations
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-text-primary leading-tight">
            Visual <span className="font-display italic text-text-primary/95">playground</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-sm mx-auto leading-relaxed">
            A collection of visual experiments, renders, and design studies.
          </p>
        </div>
      </div>

      <div className="relative w-full z-20 flex justify-center px-4 py-32 pointer-events-none">
        <div className="grid grid-cols-2 gap-8 md:gap-32 w-full max-w-[1200px] items-start">
          <div className="flex flex-col gap-32 md:gap-64 pt-24">
            {EXPLORATION_ITEMS.filter((_, idx) => idx % 2 === 0).map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item)}
                aria-label={`View ${item.title}`}
                className={`col-left-card relative ${rotationFor(idx * 2)} aspect-square w-full max-w-[280px] md:max-w-[320px] mx-auto bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer pointer-events-auto shadow-xl shadow-black/20 hover:scale-105 hover:border-text-primary/20 transition-all duration-500 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/60`}
              >
                <PlaygroundCard
                  src={item.image}
                  alt={item.title}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-text-primary/95 font-medium">{item.title}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-32 md:gap-64 pt-64 md:pt-96">
            {EXPLORATION_ITEMS.filter((_, idx) => idx % 2 !== 0).map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item)}
                aria-label={`View ${item.title}`}
                className={`col-right-card relative ${rotationFor(idx * 2 + 1)} aspect-square w-full max-w-[280px] md:max-w-[320px] mx-auto bg-surface border border-stroke rounded-3xl overflow-hidden cursor-pointer pointer-events-auto shadow-xl shadow-black/20 hover:scale-105 hover:border-text-primary/20 transition-all duration-500 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/60`}
              >
                <PlaygroundCard
                  src={item.image}
                  alt={item.title}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-text-primary/95 font-medium">{item.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              ref={closeRef}
              onClick={close}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-text-primary transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.figure
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={fallbackImage(active.image) ?? active.image}
                alt={active.title}
                width={active.imageWidth}
                height={active.imageHeight}
                className="w-full h-full object-contain mx-auto"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <span className="block text-sm text-text-primary font-medium">
                  {active.title}
                </span>
                <span className="block text-xs text-muted leading-relaxed">
                  {active.caption}{' '}
                  <a
                    href={active.imageCredit.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-stroke underline-offset-2 hover:text-text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {active.imageCredit.author} · {active.imageCredit.licence}
                  </a>
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}
    </section>
  )
}
