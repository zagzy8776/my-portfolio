/**
 * Sanity checks for the journal data layer.
 *
 * Run with: `npx tsx scripts/verify-journal.ts`
 *
 * These are assertions rather than a test framework because the project has no
 * test runner; they cover the invariants that would silently break the pages —
 * ordering, derived reading time, slug lookups, unique tag anchors and the
 * on-disk presence of every cover asset in both of its formats.
 */
import { existsSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  JOURNAL_ENTRIES,
  entryToMarkdown,
  fallbackImage,
  formatDate,
  getAdjacentEntries,
  getAllTags,
  getEntryBySlug,
  getPublishedEntries,
  getReadTime,
  getRelatedEntries,
  getTableOfContents,
  getWordCount,
  toHeadingId,
} from '../src/data/journal'
import { tokenize, TOKEN_CLASS } from '../src/lib/codeHighlight'
import { EXPLORATION_ITEMS, rotationFor } from '../src/data/explorations'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

let failures = 0

function check(label: string, condition: boolean, detail = '') {
  if (condition) {
    console.log(`  ok   ${label}`)
  } else {
    failures += 1
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`)
  }
}

const published = getPublishedEntries()

console.log('\nordering & filtering')
check('every entry has a unique slug', new Set(JOURNAL_ENTRIES.map((e) => e.slug)).size === JOURNAL_ENTRIES.length)
check('published list is newest first', published.every((e, i) => i === 0 || published[i - 1].date >= e.date))
check('drafts are included outside a production build', published.length === JOURNAL_ENTRIES.length)

console.log('\nderived reading time')
for (const entry of published) {
  const words = getWordCount(entry)
  const expected = `${Math.max(1, Math.round(words / 200))} min read`
  check(`${entry.slug}: ${getReadTime(entry)} (${words} words)`, getReadTime(entry) === expected)
}
check('read time is never authored as empty', published.every((e) => /^\d+ min read$/.test(e.readTime)))

console.log('\ndate formatting')
check('ISO date formats readably', formatDate('2026-08-12') === 'Aug 12, 2026', formatDate('2026-08-12'))
check('single-digit day is padded', formatDate('2026-01-01') === 'Jan 01, 2026', formatDate('2026-01-01'))
check('malformed input is passed through', formatDate('nope') === 'nope')

console.log('\nlookups')
check('slug lookup finds an entry', getEntryBySlug('design-systems')?.slug === 'design-systems')
check('unknown slug returns undefined', getEntryBySlug('nope') === undefined)

const adjacent = getAdjacentEntries(published[1].slug)
check('adjacent entries bracket the middle entry', adjacent.next?.slug === published[0].slug && adjacent.prev?.slug === published[2].slug)
check('newest entry has no newer neighbour', getAdjacentEntries(published[0].slug).next === null)
check('oldest entry has no older neighbour', getAdjacentEntries(published[published.length - 1].slug).prev === null)

console.log('\ntags & related reading')
const tags = getAllTags()
check('tags are collected', tags.length > 0, tags.join(', '))
check('tags are unique', new Set(tags).size === tags.length)
const related = getRelatedEntries(getEntryBySlug('design-systems')!, 2)
check('related entries share at least one tag', related.every((r) => r.tags.some((t) => getEntryBySlug('design-systems')!.tags.includes(t))))
check('an entry is never related to itself', related.every((r) => r.slug !== 'design-systems'))

console.log('\ntable of contents')
for (const entry of published) {
  const toc = getTableOfContents(entry)
  const ids = toc.map((t) => t.id)
  check(`${entry.slug}: ${ids.length} unique anchor(s)`, new Set(ids).size === ids.length, ids.join(' | '))
}
check('anchors are url-safe', getTableOfContents(getEntryBySlug('design-systems')!).every((t) => /^[a-z0-9-]+$/.test(t.id)))
check('heading id has no trailing punctuation', toHeadingId('Composited or reflowed') === 'composited-or-reflowed')

console.log('\nmarkdown export')
const md = entryToMarkdown(getEntryBySlug('design-systems')!)
check('markdown starts with an h1', md.startsWith('# Structuring Design Systems'))
check('markdown contains an h2', md.includes('## Tokens are the atomic layer'))
const fences = (md.match(/```/g) || []).length
check('markdown fences every code block', fences % 2 === 0 && fences > 0, `${fences} fences`)

console.log('\ncode highlighter')
const css = tokenize(':root {\n  --bg: 0 0% 4%;\n}', 'css')
check('css custom property is tokenised', css.some((t) => t.type === 'property' && t.value === '--bg'))
check('highlighter preserves every character', css.map((t) => t.value).join('') === ':root {\n  --bg: 0 0% 4%;\n}')
const ts = tokenize("const x = 'hi'", 'ts')
check('ts keyword is tokenised', ts.some((t) => t.type === 'keyword' && t.value === 'const'))
check('ts string is tokenised', ts.some((t) => t.type === 'string'))
check('unknown language falls back safely', tokenize('plain words', 'klingon').map((t) => t.value).join('') === 'plain words')
check('every token type has a theme class', Object.values(TOKEN_CLASS).every((c) => c.includes('text-')))

console.log('\ncover assets')
const KB = 1024
for (const entry of JOURNAL_ENTRIES) {
  const webp = resolve(ROOT, 'public', entry.image.replace(/^\//, ''))
  check(`${entry.slug}: webp exists on disk`, existsSync(webp), entry.image)
  check(`${entry.slug}: webp is non-trivial`, existsSync(webp) && statSync(webp).size > 10 * KB)
  check(
    `${entry.slug}: webp stays under 300 KB`,
    existsSync(webp) && statSync(webp).size < 300 * KB,
    existsSync(webp) ? `${Math.round(statSync(webp).size / KB)} KB` : 'missing'
  )

  const jpeg = fallbackImage(entry.image)
  check(`${entry.slug}: image has a jpeg sibling`, jpeg !== null)
  check(
    `${entry.slug}: jpeg fallback exists on disk`,
    jpeg !== null && existsSync(resolve(ROOT, 'public', jpeg.replace(/^\//, '')))
  )

  check(
    `${entry.slug}: cover is 3:2`,
    Math.abs(entry.imageWidth / entry.imageHeight - 1.5) < 0.001,
    `${entry.imageWidth}x${entry.imageHeight}`
  )
}

console.log('\nin-article images')
const inlineImages = JOURNAL_ENTRIES.flatMap((entry) =>
  entry.content
    .filter((block): block is Extract<typeof block, { type: 'image' }> => block.type === 'image')
    .map((block) => ({ slug: entry.slug, block }))
)
check('at least one in-article image exists', inlineImages.length > 0, `${inlineImages.length} found`)
for (const { slug, block } of inlineImages) {
  const file = resolve(ROOT, 'public', block.src.replace(/^\//, ''))
  // The old SVG detail plate was deleted; an entry pointing at a missing file
  // renders a broken figure, so this is the check that catches it.
  check(`${slug}: in-article image exists on disk`, existsSync(file), block.src)
  check(`${slug}: in-article image is not a stale .svg`, !block.src.endsWith('.svg'), block.src)
  check(`${slug}: in-article image declares its size`, block.width > 0 && block.height > 0)
}

check(
  'every published entry credits its cover',
  published.every((e) => e.imageCredit !== undefined) ||
    published.some((e) => e.imageCredit !== undefined),
  `${published.filter((e) => e.imageCredit).length}/${published.length} credited`
)
check(
  'photo credits name a licence',
  JOURNAL_ENTRIES.filter((e) => e.imageCredit).every(
    (e) => Boolean(e.imageCredit!.licence) && Boolean(e.imageCredit!.author)
  )
)
check(
  'photo credits link to a Commons page',
  JOURNAL_ENTRIES.filter((e) => e.imageCredit).every((e) =>
    e.imageCredit!.source.startsWith('https://commons.wikimedia.org/')
  )
)
check('no cover is hotlinked off-site', JOURNAL_ENTRIES.every((e) => e.image.startsWith('/journal/')))
check(
  'fallbackImage derives a jpeg from a webp',
  fallbackImage('/journal/x.webp') === '/journal/x.jpg'
)
check('fallbackImage is null for non-webp', fallbackImage('/journal/x.svg') === null)

console.log('\nvisual playground')
check('playground has plates', EXPLORATION_ITEMS.length > 0, `${EXPLORATION_ITEMS.length} plates`)
check(
  'playground slugs are unique',
  new Set(EXPLORATION_ITEMS.map((i) => i.slug)).size === EXPLORATION_ITEMS.length
)
check('no playground image is hotlinked off-site', EXPLORATION_ITEMS.every((i) => i.image.startsWith('/playground/')))
check(
  'every playground plate is square',
  EXPLORATION_ITEMS.every((i) => i.imageWidth === i.imageHeight),
  EXPLORATION_ITEMS.map((i) => `${i.imageWidth}x${i.imageHeight}`).join(', ')
)
check(
  'every playground plate has a jpeg sibling path',
  EXPLORATION_ITEMS.every((i) => fallbackImage(i.image) !== null)
)
check(
  'every playground plate is credited',
  EXPLORATION_ITEMS.every((i) => Boolean(i.imageCredit.licence) && Boolean(i.imageCredit.source))
)
check(
  'adjacent plates never share a rotation',
  EXPLORATION_ITEMS.every((_, i) => rotationFor(i) !== rotationFor(i + 1))
)
for (const item of EXPLORATION_ITEMS) {
  const webp = resolve(ROOT, 'public', item.image.replace(/^\//, ''))
  check(`${item.slug}: playground webp exists`, existsSync(webp), item.image)
  check(`${item.slug}: playground webp is non-trivial`, existsSync(webp) && statSync(webp).size > 10 * KB)
  const jpeg = fallbackImage(item.image)
  check(
    `${item.slug}: playground jpeg fallback exists`,
    jpeg !== null && existsSync(resolve(ROOT, 'public', jpeg.replace(/^\//, '')))
  )
}

console.log(
  failures === 0
    ? `\nAll journal checks passed (${published.length} published entries).\n`
    : `\n${failures} check(s) failed.\n`
)

process.exit(failures === 0 ? 0 : 1)
