/**
 * Journal content.
 *
 * Entries are authored without a `readTime` — it is derived from the body at
 * ~200 wpm by `withDerivedReadTime()`, so the number on screen can never drift
 * away from the number of words actually written.
 *
 * The `Block` union in `./journal-types` mirrors what an MDX frontmatter +
 * body would produce, so a later migration to Contentlayer / MDX is a straight
 * swap: each block maps onto an MDX component, each field onto frontmatter.
 */
import {
  type Block,
  type JournalEntry,
  type JournalStatus,
  getReadTime,
  formatDate,
  toIsoDate,
} from './journal-types'

export * from './journal-types'
export { fallbackImage } from './journal-types'
import { JOURNAL_ENTRIES } from './journal-entries'
export { JOURNAL_ENTRIES }

export const SITE_URL = 'https://portfolios-ruby-alpha.vercel.app'

/**
 * True in a production bundle. Guarded because `import.meta.env` only exists
 * under Vite — plain Node (build scripts, verification runs) sees undefined.
 */
const IS_PRODUCTION = Boolean(import.meta.env?.PROD)

/**
 * Newest first. Drafts are visible while writing but stripped from production
 * builds, so a half-finished thought can never be shipped or indexed.
 */
export function getPublishedEntries(): JournalEntry[] {
  return JOURNAL_ENTRIES.filter(
    (entry) => entry.status === 'published' || !IS_PRODUCTION
  ).sort((a, b) => b.date.localeCompare(a.date))
}

export function getEntryBySlug(slug: string): JournalEntry | undefined {
  return getPublishedEntries().find((entry) => entry.slug === slug)
}

/** `prev` is the older neighbour, `next` the newer one. */
export function getAdjacentEntries(slug: string): {
  prev: JournalEntry | null
  next: JournalEntry | null
} {
  const entries = getPublishedEntries()
  const index = entries.findIndex((entry) => entry.slug === slug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: entries[index + 1] ?? null,
    next: entries[index - 1] ?? null,
  }
}

/** All tags in use, ordered by frequency then alphabetically. */
export function getAllTags(): string[] {
  const counts = new Map<string, number>()
  for (const entry of getPublishedEntries()) {
    for (const tag of entry.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)
}

export function filterByTag(tag: string | null): JournalEntry[] {
  const entries = getPublishedEntries()
  if (!tag) return entries
  return entries.filter((entry) => entry.tags.includes(tag))
}

/** Weighted purely by shared tags — cheap and good enough at this scale. */
export function getRelatedEntries(entry: JournalEntry, limit = 2): JournalEntry[] {
  return getPublishedEntries()
    .filter((candidate) => candidate.slug !== entry.slug)
    .map((candidate) => ({
      candidate,
      overlap: candidate.tags.filter((tag) => entry.tags.includes(tag)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

/** Stable anchor id for an h2, used by the auto table of contents. */
export function toHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export interface TocItem {
  id: string
  text: string
}

/** Table of contents built from the h2 blocks, in document order. */
export function getTableOfContents(entry: JournalEntry): TocItem[] {
  return entry.content
    .filter((block): block is Extract<Block, { type: 'h2' }> => block.type === 'h2')
    .map((block) => ({ id: toHeadingId(block.text), text: block.text }))
}

/** Serialises an entry back to Markdown for the "Copy as Markdown" action. */
export function entryToMarkdown(entry: JournalEntry): string {
  const body = entry.content
    .map((block) => {
      switch (block.type) {
        case 'h2':
          return `## ${block.text}`
        case 'quote':
          return `> ${block.text}${block.attribution ? `\n> — ${block.attribution}` : ''}`
        case 'code':
          return [
            block.filename ? `_${block.filename}_` : '',
            '```' + block.language,
            block.code,
            '```',
          ]
            .filter(Boolean)
            .join('\n')
        case 'image':
          return `![${block.alt}](${block.src})${block.caption ? `\n_${block.caption}_` : ''}`
        case 'list':
          return block.items
            .map((item, i) => (block.ordered ? `${i + 1}. ${item}` : `- ${item}`))
            .join('\n')
        default:
          return block.text
      }
    })
    .join('\n\n')

  return [
    `# ${entry.title}`,
    '',
    `_${formatDate(entry.date)} · ${getReadTime(entry)} · ${entry.tags.join(', ')}_`,
    '',
    body,
  ].join('\n')
}

export { getReadTime, formatDate, toIsoDate }
export type { Block, JournalEntry, JournalStatus }
