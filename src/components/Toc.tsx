import { useActiveHeading } from '../hooks/useReadingProgress'

export interface TocItemData {
  id: string
  text: string
}

interface TocProps {
  items: TocItemData[]
}

/**
 * "On this article" navigation, auto-generated from the h2 blocks.
 * Only rendered when an essay is long enough to justify it.
 */
export default function Toc({ items }: TocProps) {
  const active = useActiveHeading(items.map((item) => item.id))

  return (
    <nav
      aria-label="On this article"
      className="mb-10 rounded-2xl border border-stroke bg-surface/40 p-5"
    >
      <h2 className="text-[10px] text-muted uppercase tracking-[0.2em] mb-3">
        On this article
      </h2>
      <ul className="space-y-2">
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`text-sm font-light transition-colors ${
                  isActive
                    ? 'text-text-primary'
                    : 'text-muted hover:text-text-primary'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`w-4 h-px transition-all duration-300 ${
                      isActive ? 'bg-text-primary w-6' : 'bg-stroke'
                    }`}
                  />
                  {item.text}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
