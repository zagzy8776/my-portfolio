import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, X } from 'lucide-react'
import CoverImage from '../../components/CoverImage'
import SEO from '../../components/SEO'
import {
  formatDate,
  getEntryBySlug,
  getPublishedEntries,
  getReadTime,
} from '../../data/journal'

interface TagFilterProps {
  tags: string[]
  activeTag: string | null
  total: number
  onSelect: (tag: string | null) => void
}

function TagFilter({ tags, activeTag, total, onSelect }: TagFilterProps) {
  const base =
    'px-3 py-1.5 rounded-full border text-xs transition-colors'
  const on = 'border-text-primary text-text-primary'
  const off = 'border-stroke text-muted hover:text-text-primary hover:border-muted/60'

  return (
    <div className="flex flex-wrap items-center gap-2 mb-10 pb-8 border-b border-stroke">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`${base} ${activeTag === null ? on : off}`}
      >
        All ({total})
      </button>

      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(activeTag === tag ? null : tag)}
          className={`${base} ${activeTag === tag ? on : off}`}
        >
          {tag}
        </button>
      ))}

      {activeTag && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="ml-1 inline-flex items-center gap-1 text-[10px] text-muted uppercase tracking-widest hover:text-text-primary transition-colors"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  )
}

export default function JournalIndex() {
  const { slug } = useParams<{ slug?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const tagParam = searchParams.get('tag')
  const [activeTag, setActiveTag] = useState<string | null>(tagParam)

  // Keeps `?tag=Design` deep links (from article tag pills) in sync.
  useEffect(() => {
    setActiveTag(tagParam)
  }, [tagParam])

  const selectTag = (tag: string | null) => {
    setActiveTag(tag)
    setSearchParams(tag ? { tag } : {}, { replace: true })
  }

  const featured = slug ? getEntryBySlug(slug) : undefined
  const entries = useMemo(() => getPublishedEntries(), [])

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const entry of entries) {
      for (const tag of entry.tags) counts.set(tag, (counts.get(tag) || 0) + 1)
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag)
  }, [entries])

  const visible = useMemo(
    () => (activeTag ? entries.filter((e) => e.tags.includes(activeTag)) : entries),
    [entries, activeTag]
  )

  return (
    <>
      <SEO
        title="Journal — essays on design systems, performance and craft"
        description="Essays on interface craft, design systems, performance, and building products for real bandwidth — by Zagzy Link."
        path="/journal"
      />

      <main className="relative z-10 w-full overflow-x-hidden px-6 md:px-10">
        <div className="max-w-4xl mx-auto pt-32 md:pt-40 pb-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] text-muted uppercase tracking-widest hover:text-text-primary transition-colors mb-10"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to portfolio
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="font-display italic text-4xl md:text-6xl text-text-primary leading-[1.05]">
              Journal
            </h1>
            <p className="mt-5 text-sm md:text-base text-muted leading-relaxed font-light max-w-2xl">
              Working notes on design systems, interface performance, and the craft
              decisions that never make it into a case study. Written from the
              middle of shipping, not after.
            </p>
          </motion.header>

          <TagFilter
            tags={tags}
            activeTag={activeTag}
            total={entries.length}
            onSelect={selectTag}
          />
          <ul className="divide-y divide-stroke/60 border-b border-stroke/60">
            {visible.map((entry, index) => {
              const isFeatured = featured?.slug === entry.slug
              return (
                <li key={entry.slug}>
                  <motion.article
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                    className={`group relative py-8 ${
                      isFeatured
                        ? 'bg-surface/40 -mx-4 px-4 rounded-2xl border border-stroke'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <Link
                        to={`/journal/${entry.slug}`}
                        className="shrink-0 w-full sm:w-40 rounded-xl overflow-hidden border border-stroke bg-surface"
                      >
                        <CoverImage
                          src={entry.image}
                          alt=""
                          width={entry.imageWidth}
                          height={entry.imageHeight}
                          loading={index < 2 ? 'eager' : 'lazy'}
                          className="w-full aspect-[3/2] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted mb-2">
                          <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                          <span className="w-1 h-1 rounded-full bg-muted/40" />
                          <span>{getReadTime(entry)}</span>
                          {entry.status === 'draft' && (
                            <span className="px-1.5 py-0.5 rounded border border-stroke uppercase tracking-widest">
                              Draft
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg md:text-xl text-text-primary font-light leading-snug">
                          <Link
                            to={`/journal/${entry.slug}`}
                            className="hover:opacity-80 transition-opacity"
                          >
                            {entry.displayTitle}
                          </Link>
                        </h2>

                        <p className="mt-2 text-sm text-muted leading-relaxed font-light">
                          {entry.summary}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            {entry.tags.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => selectTag(tag)}
                                className="px-2.5 py-1 rounded-full border border-stroke text-[10px] text-muted uppercase tracking-wider hover:text-text-primary hover:border-muted/60 transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>

                          <Link
                            to={`/journal/${entry.slug}`}
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-text-primary"
                          >
                            Read
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </li>
              )
            })}
          </ul>

          {visible.length === 0 && (
            <p className="py-16 text-center text-sm text-muted">
              Nothing published under that tag yet.
            </p>
          )}
        </div>
      </main>
    </>
  )
}
