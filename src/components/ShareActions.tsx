import { useState } from 'react'
import { Check, FileCode2, Link2, Share2 } from 'lucide-react'

interface ShareActionsProps {
  url: string
  title: string
  markdown: string
}

type Action = 'link' | 'markdown' | null

async function writeClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

/**
 * Copy-link, native share and "copy as Markdown" actions.
 *
 * Copy-as-Markdown is the one that matters for a writing portfolio: it lets
 * someone quote the essay without retyping it.
 */
export default function ShareActions({ url, title, markdown }: ShareActionsProps) {
  const [copied, setCopied] = useState<Action>(null)
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const flash = (action: Action) => {
    setCopied(action)
    window.setTimeout(() => setCopied(null), 2000)
  }

  const handleCopyLink = async () => {
    if (await writeClipboard(url)) flash('link')
  }

  const handleCopyMarkdown = async () => {
    const payload = `> ${title}\n> ${url}\n\n${markdown}`
    if (await writeClipboard(payload)) flash('markdown')
  }

  const handleShare = async () => {
    try {
      await navigator.share({ title, url })
    } catch {
      // User dismissed the native sheet — nothing to do.
    }
  }

  const buttonClass =
    'inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted hover:text-text-primary transition-colors'

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <button type="button" onClick={handleCopyLink} className={buttonClass}>
        {copied === 'link' ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied === 'link' ? 'Link copied' : 'Copy link'}
      </button>

      <button type="button" onClick={handleCopyMarkdown} className={buttonClass}>
        {copied === 'markdown' ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <FileCode2 className="w-3.5 h-3.5" />
        )}
        {copied === 'markdown' ? 'Markdown copied' : 'Copy as Markdown'}
      </button>

      {canShare && (
        <button type="button" onClick={handleShare} className={buttonClass}>
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      )}
    </div>
  )
}
