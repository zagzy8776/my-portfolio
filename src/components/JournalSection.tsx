import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import CoverImage from './CoverImage'
import { getPublishedEntries, getReadTime, formatDate } from '../data/journal'

/**
 * Home-section preview of the journal.
 *
 * This deliberately owns no article state and opens no panel: each row is a
 * real link to `/journal/<slug>`, so entries are shareable, crawlable and
 * back-button-friendly. The full reading experience lives on the routed pages.
 */
export default function JournalSection() {
  const entries = getPublishedEntries().slice(0, 3)

  return (
    <section id="journal" className="bg-bg py-16 md:py-24 border-t border-stroke relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
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

          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-primary self-start md:self-auto group/all"
          >
            All essays
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5" />
          </Link>
        </motion.div>

        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {entries.map((entry, idx) => (
            <motion.div
              key={entry.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                to={`/journal/${entry.slug}`}
                className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full transition-colors duration-300 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border border-stroke">
                  <CoverImage
                    src={entry.image}
                    alt=""
                    width={entry.imageWidth}
                    height={entry.imageHeight}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between grow min-w-0 pr-2 sm:pr-4 gap-1 sm:gap-4">
                  <h3 className="text-sm sm:text-base font-light text-text-primary/90 group-hover:text-text-primary transition-colors duration-300 truncate">
                    {entry.displayTitle}
                  </h3>

                  <div className="flex items-center gap-3 shrink-0 text-[11px] text-muted">
                    <span className="whitespace-nowrap">{formatDate(entry.date)}</span>
                    <span className="w-1 h-1 bg-stroke rounded-full hidden sm:inline-block" />
                    <span className="whitespace-nowrap font-medium text-text-primary/60">
                      {getReadTime(entry)}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 hidden sm:block" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
