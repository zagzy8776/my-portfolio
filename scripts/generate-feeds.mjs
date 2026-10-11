import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function read(path) {
  return readFileSync(path, 'utf8')
}

/**
 * Build step: generates `public/rss.xml` and `public/sitemap.xml` from the
 * journal and project data, so a new entry can never be published but missing
 * from the feed or the sitemap.
 *
 * Runs automatically before `vite build` (see `prebuild` in package.json).
 *
 * Usage: `node scripts/generate-feeds.mjs`
 */

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const publicDir = resolve(root, 'public')
const journalDir = resolve(root, 'src', 'data')

const SITE = 'https://portfolios-ruby-alpha.vercel.app'
const FEED_TITLE = 'Zagzy Link — Journal'
const FEED_DESC =
  'Essays on interface craft, design systems, performance, and building products for real bandwidth.'

/** Minimal XML escaping for the handful of characters feeds actually see. */
function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * The data modules are TypeScript, so this script reads them as text and pulls
 * the fields the feed needs. Keeps the build dependency-free — no ts-node, no
 * bundler step for a file that writes two static documents.
 */
function parseEntries(source) {
  const entries = []

  // Normalise line endings so the same patterns work on any checkout.
  const text = source.replace(/\r\n/g, '\n')

  // Split on the start of each entry object, keeping the slug as the marker.
  // `\s*\{\n` tolerates any brace indentation, and splitting on the slug line
  // rather than the brace means the first entry is captured too.
  const blocks = text.split(/\n\s*\{\n(?=\s*slug: ')/)

  for (const block of blocks) {
    const pick = (key) => {
      // Matches both `key: 'value'` and the wrapped form:
      //   key:
      //     'value',
      const match = block.match(
        new RegExp(`^\\s*${key}:\\s*(?:\n\\s*)?'([^']*)'`, 'm')
      )
      return match ? match[1] : ''
    }

    const slug = pick('slug')
    if (!slug) continue

    const tagsMatch = block.match(/^\s*tags: \[([^\]]*)\]/m)
    const tags = tagsMatch
      ? tagsMatch[1]
          .split(',')
          .map((t) => t.trim().replace(/^'|'$/g, ''))
          .filter(Boolean)
      : []

    const words = (block.match(/^\s*text:\s*(?:\n\s*)?'([^']*)'/gm) || [])
      .map((line) => {
        const m = line.match(/'([^']*)'\s*$/)
        return m ? m[1] : ''
      })
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length

    entries.push({
      slug,
      title: pick('title'),
      summary: pick('summary'),
      date: pick('date'),
      reviewed: pick('reviewed'),
      status: pick('status'),
      image: pick('image'),
      tags,
      readTime: `${Math.max(1, Math.round(words / 200))} min read`,
    })
  }

  return entries
}

function parseProjectSlugs(source) {
  const text = source.replace(/\r\n/g, '\n')
  return [...text.matchAll(/^\s*slug: '([^']+)'/gm)].map((m) => m[1])
}

function toRfc822(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toUTCString()
}

function toIso(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toISOString()
}

/**
 * JPEG sibling of a cover, for feed enclosures and social previews.
 *
 * Readers and link unfurlers are inconsistent about WebP, so the feed points at
 * the `.jpg` that ships beside every `.webp`.
 */
function jpegFor(image) {
  return image.endsWith('.webp') ? `${image.slice(0, -5)}.jpg` : image
}

const entries = parseEntries(read(resolve(journalDir, 'journal-entries.ts')))
const projectSlugs = parseProjectSlugs(read(resolve(journalDir, 'projects.ts')))

const published = entries
  .filter((entry) => entry.status === 'published')
  .sort((a, b) => b.date.localeCompare(a.date))

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(FEED_TITLE)}</title>
    <link>${SITE}/journal</link>
    <description>${esc(FEED_DESC)}</description>
    <language>en</language>
    <lastBuildDate>${toRfc822(published[0]?.date ?? new Date().toISOString().slice(0, 10))}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${published
  .map(
    (entry) => `    <item>
      <title>${esc(entry.title)}</title>
      <link>${SITE}/journal/${entry.slug}</link>
      <guid isPermaLink="true">${SITE}/journal/${entry.slug}</guid>
      <pubDate>${toRfc822(entry.date)}</pubDate>
      <description>${esc(entry.summary)}</description>
${
  entry.image
    ? `      <enclosure url="${SITE}${jpegFor(entry.image)}" type="image/jpeg" />\n`
    : ''
}${entry.tags.map((tag) => `      <category>${esc(tag)}</category>`).join('\n')}
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE}/journal</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${toIso(published[0]?.date ?? new Date().toISOString().slice(0, 10))}</lastmod>
  </url>
${published
  .map(
    (entry) => `  <url>
    <loc>${SITE}/journal/${entry.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${toIso(entry.reviewed || entry.date)}</lastmod>${
      entry.image
        ? `\n    <image:image>\n      <image:loc>${SITE}${jpegFor(entry.image)}</image:loc>\n    </image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
${projectSlugs
  .map(
    (slug) => `  <url>
    <loc>${SITE}/work/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

mkdirSync(publicDir, { recursive: true })
writeFileSync(resolve(publicDir, 'rss.xml'), rss, 'utf8')
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf8')

console.log(`rss.xml      ${published.length} entries`)
console.log(`sitemap.xml  ${published.length} articles + ${projectSlugs.length} projects`)
