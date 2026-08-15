import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

const WORDS = ["Design", "Create", "Inspire"]

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const startRef = useRef<number | null>(null)
  const completeTriggered = useRef(false)

  useEffect(() => {
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = timestamp - startRef.current;
      
      // Calculate current count (0 to 100 over 2700ms)
      const currentCount = Math.min(100, Math.floor((progress / 2700) * 100));
      setCount(currentCount);

      // Cycle words every 900ms
      const currentWordIndex = Math.min(WORDS.length - 1, Math.floor(progress / 900));
      setWordIndex(currentWordIndex);

      if (currentCount < 100) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Trigger completion with 400ms delay once we reach 100
        if (!completeTriggered.current) {
          completeTriggered.current = true;
          setTimeout(() => {
            onComplete();
          }, 400);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-8 md:p-12 lg:p-16 select-none">
      {/* Top Left: Portfolio label */}
      <div>
        <motion.span
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xs text-muted uppercase tracking-[0.3em] inline-block"
        >
          Portfolio
        </motion.span>
      </div>

      {/* Center: Rotating words */}
      <div className="flex justify-center items-center h-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary text-center"
          >
            {WORDS[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom area */}
      <div className="space-y-6">
        {/* Bottom Right: Counter */}
        <div className="flex justify-end">
          <span className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none">
            {String(count).padStart(3, "0")}
          </span>
        </div>

        {/* Bottom Progress Bar */}
        <div className="relative w-full h-[3px] bg-stroke/50 overflow-hidden">
          <div
            className="accent-gradient h-full transition-transform duration-75 ease-out origin-left"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)'
            }}
          />
        </div>
      </div>
    </div>
  )
}
