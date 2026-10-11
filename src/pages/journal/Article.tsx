import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronLeft, RefreshCw } from 'lucide-react'
import SEO from '../../components/SEO'
import ArticleContent from '../../components/ArticleContent'
import CoverImage from '../../components/CoverImage'
import NewsletterForm from '../../components/NewsletterForm'
import ReadingProgress from '../../components/ReadingProgress'
import ShareActions from '../../components/ShareActions'
import { useReadingProgress } from '../../hooks/useReadingProgress'
import {
  SITE_URL,
  entryToMarkdown,
  fallbackImage,
  formatDate,
  getAdjacentEntries,
  getEntryBySlug,
  getReadTime,
  getRelatedEntries,
  getWordCount,
  toIsoDate,
  type JournalEntry,
} from '../../data/journal'
import NotFound from '../NotFound'

interface MastheadProps {
  entry: JournalEntry
}

/** Title, summary, meta line and tag pills at the top of an essay. */
function ArticleMasthead({ entry }: MastheadProps) {
  return (
    <header className="mb-10">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted mb-4">
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
        <span className="w-1 h-1 rounded-full bg-muted/40" />
        <span>{getReadTime(entry)}</span>
        <span className="w-1 h-1 rounded-full bg-muted/40" />
        <span>{getWordCount(entry).toLocaleString()} words</span>
        {entry.status === 'draft' && (
          <span className="px-1.5 py-0.5 rounded border border-stroke uppercase tracking-widest">
            Draft — unlisted in production
          </span>
        )}
      </div>

      <h1 className="font-display italic text-3xl md:text-5xl text-text-primary leading-[1.1]">
        {entry.title}
      </h1>

      <p className="mt-5 text-sm md:text-base text-muted leading-relaxed font-light">
        {entry.summary}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {entry.tags.map((tag) => (
          <Link
            key={tag}
            to={`/journal?tag=${encodeURIComponent(tag)}`}
            className="px-3 py-1 rounded-full border border-stroke text-[10px] text-muted uppercase tracking-wider hover:text-text-primary hover:border-muted/60 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted font-light">
        {entry.author} · <span className="text-muted/70">{entry.authorRole}</span>
      </p>
    </header>
  )
}

export default function Article() {
  const { slug = '' } = useParams<{ slug: string }>()
  const entry = getEntryBySlug(slug)
  const progress = useReadingProgress()

  if (!entry) return <NotFound />

  const { prev, next } = getAdjacentEntries(slug)
  const related = getRelatedEntries(entry, 2)
  const url = `${SITE_URL}/journal/${entry.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.summary,
    datePublished: toIsoDate(entry.date),
    dateModified: toIsoDate(entry.reviewed),
    image: `${SITE_URL}${entry.image}`,
    wordCount: getWordCount(entry),
    keywords: entry.tags.join(', '),
    author: {
      '@type': 'Person',
      name: entry.author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vura Tech Hub',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <>
      <SEO
        title={entry.title}
        description={entry.summary}
        path={`/journal/${entry.slug}`}
        image={`${SITE_URL}${fallbackImage(entry.image) ?? entry.image}`}
        type="article"
        jsonLd={jsonLd}
      />
      <ReadingProgress progress={progress} />

      <main className="relative z-10 w-full overflow-x-hidden px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto pt-32 md:pt-40 pb-24"
        >
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-[11px] text-muted uppercase tracking-widest hover:text-text-primary transition-colors mb-10"
          >
            <ChevronLeft className="w-3 h-3" />
            All essays
          </Link>

          <ArticleMasthead entry={entry} />

          <div className="mb-4 rounded-3xl overflow-hidden border border-stroke bg-surface">
            <CoverImage
              src={entry.image}
              alt={entry.title}
              width={entry.imageWidth}
              height={entry.imageHeight}
              loading="eager"
              className="w-full aspect-[16/9] object-cover"
            />
          </div>

          {entry.imageCredit && (
            <p className="mb-10 text-[10px] text-muted/70 leading-relaxed">
              Cover photograph by {entry.imageCredit.author} —{' '}
              <a
                href={entry.imageCredit.source}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="underline decoration-stroke underline-offset-2 hover:text-text-primary transition-colors"
              >
                {entry.imageCredit.file}
              </a>{' '}
              ({entry.imageCredit.licence}, via Wikimedia Commons). Graded to the
              site palette.
            </p>
          )}

          {!entry.imageCredit && <div className="mb-6" />}

          <ArticleContent blocks={entry.content} />

          {/* Editorial footer: reviewed date, author block, share actions */}
          <div className="mt-16 pt-8 border-t border-stroke space-y-8">
            <ShareActions url={url} title={entry.title} markdown={entryToMarkdown(entry)} />

            <div className="rounded-2xl border border-stroke bg-surface/40 p-6">
              <div className="flex items-start gap-4">
                <div className="relative w-11 h-11 rounded-full flex items-center justify-center p-[1.5px] shrink-0">
                  <div className="absolute inset-0 rounded-full accent-gradient" />
                  <div className="relative w-full h-full bg-bg rounded-full flex items-center justify-center">
                    <span className="font-display italic text-sm text-text-primary leading-none">
                      ZL
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-text-primary font-medium">{entry.author}</p>
                  <p className="text-xs text-muted mt-0.5">{entry.authorRole}</p>
                  <p className="text-[11px] text-muted mt-3 flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3" />
                    Last reviewed {formatDate(entry.reviewed)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-stroke p-6">
              <h2 className="text-sm text-text-primary font-medium">Get new essays</h2>
              <p className="mt-1 mb-4 text-xs text-muted font-light">
                Occasional notes on craft, systems and shipping. No schedule, no filler.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Related by tag overlap */}
          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="text-[10px] text-muted uppercase tracking-[0.2em] mb-4">
                Related reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/journal/${item.slug}`}
                    className="group p-5 rounded-2xl border border-stroke bg-surface/40 hover:bg-surface transition-colors"
                  >
                    <p className="text-base text-text-primary font-light group-hover:opacity-80">
                      {item.displayTitle}
                    </p>
                    <p className="mt-2 text-xs text-muted font-light line-clamp-2">
                      {item.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Previous / next */}
          <div className="mt-14 pt-10 border-t border-stroke grid grid-cols-1 sm:grid-cols-2 gap-6">
            {prev ? (
              <Link
                to={`/journal/${prev.slug}`}
                className="group flex flex-col items-start gap-1 p-5 rounded-2xl border border-stroke bg-surface/40 hover:bg-surface transition-colors"
              >
                <span className="text-[10px] text-muted uppercase tracking-widest flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Older
                </span>
                <span className="text-base text-text-primary font-light group-hover:opacity-80">
                  {prev.displayTitle}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {next && (
              <Link
                to={`/journal/${next.slug}`}
                className="group flex flex-col items-end gap-1 p-5 rounded-2xl border border-stroke bg-surface/40 hover:bg-surface transition-colors text-right"
              >
                <span className="text-[10px] text-muted uppercase tracking-widest flex items-center gap-1">
                  Newer <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-base text-text-primary font-light group-hover:opacity-80">
                  {next.displayTitle}
                </span>
              </Link>
            )}
          </div>
        </motion.div>
      </main>
    </>
  )
}
