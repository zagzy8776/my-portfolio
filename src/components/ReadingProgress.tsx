import { motion, type MotionValue } from 'framer-motion'

interface ReadingProgressProps {
  progress: MotionValue<number>
  /** Renders the bar absolutely inside a panel instead of fixed to the viewport. */
  contained?: boolean
}

/**
 * 2px gradient reading indicator. Highest craft-per-line addition available:
 * one motion value, one transform, no layout thrash.
 */
export default function ReadingProgress({ progress, contained = false }: ReadingProgressProps) {
  return (
    <div
      aria-hidden
      className={
        contained
          ? 'absolute top-0 left-0 right-0 h-[2px] z-20 overflow-hidden'
          : 'fixed top-0 left-0 right-0 h-[2px] z-[60] overflow-hidden'
      }
    >
      <motion.div
        style={{ scaleX: progress, transformOrigin: '0% 50%' }}
        className="h-full w-full accent-gradient"
      />
    </div>
  )
}
