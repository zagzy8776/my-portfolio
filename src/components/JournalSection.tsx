import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Calendar, ArrowRight } from 'lucide-react'
import { JOURNAL_ENTRIES, type JournalEntry } from '../data/journal'

export default function JournalSection() {
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null)

  return (
    <section id="journal" className="bg-bg py-16 md:py-24 border-t border-stroke relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 md:mb-16"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium">
                Journal
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-text-primary leading-tight">
              Recent <span className="font-display italic text-text-primary/95">thoughts</span>
            </h2>
            <p className="text-sm md:text-base text-muted max-w-md leading-relaxed">
              Notes on design process, engineering, and building products that last.
            </p>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {JOURNAL_ENTRIES.map((entry, idx) => (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => setActiveEntry(entry)}
              className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full transition-colors duration-300 cursor-pointer group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border border-stroke">
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between grow min-w-0 pr-2 sm:pr-4 gap-1 sm:gap-4">
                <h3 className="text-sm sm:text-base font-light text-text-primary/90 group-hover:text-text-primary transition-colors duration-300 truncate">
                  {entry.title}
                </h3>

                <div className="flex items-center gap-3 shrink-0 text-[11px] text-muted">
                  <span className="whitespace-nowrap">{entry.date}</span>
                  <span className="w-1 h-1 bg-stroke rounded-full hidden sm:inline-block" />
                  <span className="whitespace-nowrap font-medium text-text-primary/60">{entry.readTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeEntry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEntry(null)}
              className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm cursor-zoom-out"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-[10000] w-full max-w-xl bg-surface border-l border-stroke shadow-2xl flex flex-col cursor-default"
            >
              <div className="p-6 sm:p-8 border-b border-stroke flex items-center justify-between shrink-0">
                <span className="text-[10px] text-muted uppercase tracking-[0.25em] font-medium">
                  Journal Entry
                </span>
                <button
                  onClick={() => setActiveEntry(null)}
                  className="p-1.5 rounded-full bg-stroke/50 hover:bg-stroke text-text-primary transition-colors"
                  aria-label="Close article"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto grow space-y-6 select-text text-left">
                <div className="flex items-center gap-4 text-xs text-muted font-medium mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {activeEntry.date}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-stroke" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {activeEntry.readTime}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display italic text-text-primary leading-tight">
                  {activeEntry.title}
                </h3>

                <div className="w-full h-48 rounded-2xl overflow-hidden border border-stroke mt-4">
                  <img
                    src={activeEntry.image}
                    alt={activeEntry.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4 pt-4 text-sm sm:text-base text-muted leading-relaxed font-light">
                  {activeEntry.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8 border-t border-stroke shrink-0 bg-surface/50">
                <button
                  onClick={() => setActiveEntry(null)}
                  className="w-full py-3 bg-stroke hover:bg-stroke/80 text-text-primary text-xs font-semibold rounded-full uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  Close <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
