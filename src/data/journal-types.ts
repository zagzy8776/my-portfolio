/**
 * Content-driven journal.
 *
 * The block union below mirrors what an MDX frontmatter + body would produce,
 * so migrating to Contentlayer / MDX later is a straight swap: each `Block`
 * maps 1:1 onto an MDX component and each entry field onto frontmatter.
 *
 * Dates are stored as ISO `YYYY-MM-DD` (sortable, timezone-safe). Display
 * strings are derived through `formatDate()` — never stored.
 */

export type BlockType = 'p' | 'h2' | 'quote' | 'code' | 'image' | 'list'

export interface ParagraphBlock {
  type: 'p'
  text: string
}

export interface HeadingBlock {
  type: 'h2'
  text: string
}

export interface QuoteBlock {
  type: 'quote'
  text: string
  attribution?: string
}

export interface CodeBlockData {
  type: 'code'
  language: string
  filename?: string
  code: string
}

export interface ImageBlock {
  type: 'image'
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

export interface ListBlock {
  type: 'list'
  ordered?: boolean
  items: string[]
}

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | QuoteBlock
  | CodeBlockData
  | ImageBlock
  | ListBlock

export type JournalStatus = 'draft' | 'published'

/**
 * Attribution for a cover photograph.
 *
 * Commons files that are CC-BY or CC-BY-SA legally require a credit wherever
 * they are republished, so this travels with the entry and is rendered under
 * the article masthead rather than hidden in a comment.
 */
export interface ImageCredit {
  /** Commons file title, e.g. `File:Water Surface (33236365632).jpg`. */
  file: string
  author: string
  licence: string
  /** Canonical Commons description page. */
  source: string
}

/** Shape authored in this file. `readTime` is filled in by the helpers below. */
type JournalEntrySource = Omit<JournalEntry, 'readTime'>

export interface JournalEntry {
  slug: string
  title: string
  /** Short title used in dense list rows so nothing truncates mid-word. */
  displayTitle: string
  /** ISO `YYYY-MM-DD`. Sortable and timezone-safe. */
  date: string
  /** ISO `YYYY-MM-DD` — last editorial review, shown in the masthead. */
  reviewed: string
  /** Derived from the body at ~200 wpm. Never hand-typed. */
  readTime: string
  image: string
  imageWidth: number
  imageHeight: number
  /** Present once a cover is real photography rather than a generated plate. */
  imageCredit?: ImageCredit
  tags: string[]
  author: string
  authorRole: string
  summary: string
  status: JournalStatus
  content: Block[]
}

const AUTHOR = 'Ekenedirichukwu Isdore Amadi'
const AUTHOR_ROLE = 'Founder · Full-stack Engineer, Vura Tech Hub'
const WORDS_PER_MINUTE = 200

/** Continuous reading material — paragraphs, quotes and list items. */
function countWords(block: Block): number {
  switch (block.type) {
    case 'p':
    case 'h2':
    case 'quote':
      return block.text.split(/\s+/).filter(Boolean).length
    case 'list':
      return block.items.reduce(
        (total, item) => total + item.split(/\s+/).filter(Boolean).length,
        0
      )
    default:
      return 0
  }
}

/** Anything with a body can have its reading time derived. */
export interface ReadableContent {
  content: Block[]
}

export function getWordCount(entry: ReadableContent): number {
  return entry.content.reduce((total, block) => total + countWords(block), 0)
}

export function getReadTime(entry: ReadableContent): string {
  const minutes = Math.max(1, Math.round(getWordCount(entry) / WORDS_PER_MINUTE))
  return `${minutes} min read`
}


const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** `2026-08-12` → `Aug 12, 2026`. Parsed as UTC so no off-by-one day slips. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  return `${MONTHS[month - 1]} ${String(day).padStart(2, '0')}, ${year}`
}

/** `2026-08-12` → full ISO timestamp for JSON-LD, RSS and sitemaps. */
export function toIsoDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1)).toISOString()
}

/**
 * The JPEG sibling of a cover, used as a `<picture>` fallback.
 *
 * Covers ship as WebP with a same-name `.jpg` beside them. Deriving the fallback
 * from `image` (rather than storing both paths on every entry) means a cover can
 * never be added with only half its formats wired up.
 */
export function fallbackImage(image: string): string | null {
  return image.endsWith('.webp') ? `${image.slice(0, -5)}.jpg` : null
}
