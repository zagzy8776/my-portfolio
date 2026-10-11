import type { Block } from '../data/journal'
import { toHeadingId } from '../data/journal'
import CodeBlock from './CodeBlock'
import CoverImage from './CoverImage'
import Toc from './Toc'

interface ArticleContentProps {
  blocks: Block[]
}

/** Renders just the blocks, so list/paragraph spacing stays consistent. */
function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={i}
                id={toHeadingId(block.text)}
                className="scroll-mt-28 text-xl md:text-2xl font-display italic text-text-primary pt-4"
              >
                {block.text}
              </h2>
            )

          case 'quote':
            return (
              <blockquote
                key={i}
                className="my-8 border-l-2 border-stroke pl-5 py-1"
              >
                <p className="text-base md:text-lg text-text-primary leading-relaxed font-light italic">
                  {block.text}
                </p>
                {block.attribution && (
                  <cite className="mt-3 block text-[11px] text-muted uppercase tracking-widest not-italic">
                    {block.attribution}
                  </cite>
                )}
              </blockquote>
            )

          case 'code':
            return (
              <CodeBlock
                key={i}
                code={block.code}
                language={block.language}
                filename={block.filename}
              />
            )

          case 'image':
            return (
              <figure key={i} className="my-8">
                <CoverImage
                  src={block.src}
                  alt={block.alt}
                  width={block.width}
                  height={block.height}
                  className="w-full rounded-2xl border border-stroke bg-surface object-cover"
                />
                {block.caption && (
                  <figcaption className="mt-3 text-[11px] text-muted text-center">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          case 'list':
            return block.ordered ? (
              <ol key={i} className="space-y-3 my-6">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-sm md:text-base text-muted leading-relaxed font-light flex gap-3"
                  >
                    <span className="text-text-primary/50 font-mono text-xs mt-1 tabular-nums">
                      {String(j + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="space-y-3 my-6">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-sm md:text-base text-muted leading-relaxed font-light flex gap-3"
                  >
                    <span className="mt-2 w-1 h-1 rounded-full bg-text-primary/40 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )

          default:
            return (
              <p
                key={i}
                className="text-sm md:text-base text-muted leading-relaxed font-light"
              >
                {block.text}
              </p>
            )
        }
      })}
    </>
  )
}

/**
 * Renders the block union. Everything lives inside a single `space-y` flow so
 * headings, quotes, code and images share one vertical rhythm.
 */
export default function ArticleContent({ blocks }: ArticleContentProps) {
  const headings = blocks
    .filter((block): block is Extract<Block, { type: 'h2' }> => block.type === 'h2')
    .map((block) => ({ id: toHeadingId(block.text), text: block.text }))

  return (
    <>
      {headings.length >= 2 && <Toc items={headings} />}
      <div className="space-y-6 text-left">
        <BlockList blocks={blocks} />
      </div>
    </>
  )
}
