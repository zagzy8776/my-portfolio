import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

const WORDS = ["Design", "Build", "Ship"]

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
      
      const currentCount = Math.min(100, Math.floor((progress / 2400) * 100));
      setCount(currentCount);

      const currentWordIndex = Math.min(WORDS.length - 1, Math.floor(progress / 800));
      setWordIndex(currentWordIndex);

      if (currentCount < 100) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (!completeTriggered.current) {
          completeTriggered.current = true;
          setTimeout(() => {
            onComplete();
          }, 350);
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
      <div>
        <motion.span
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs text-muted uppercase tracking-[0.25em] inline-block"
        >
          Zagzy Link
        </motion.span>
      </div>

      <div className="flex justify-center items-center h-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary text-center"
          >
            {WORDS[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-5">
        <div className="flex justify-end">
          <span className="text-5xl md:text-7xl lg:text-8xl font-display text-text-primary tabular-nums leading-none">
            {String(count).padStart(3, "0")}
          </span>
        </div>

        <div className="relative w-full h-[2px] bg-stroke/50 overflow-hidden">
          <div
            className="accent-gradient h-full transition-transform duration-75 ease-out origin-left"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 6px rgba(137, 170, 204, 0.3)'
            }}
          />
        </div>
      </div>
    </div>
  )
}
