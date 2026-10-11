import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { tokenize, TOKEN_CLASS } from '../lib/codeHighlight'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

/**
 * Theme-aware code sample with a copy button.
 *
 * The highlighter emits plain spans, so the block inherits the site palette
 * (`--surface`, `--stroke`, `--token-*`) and follows dark/light mode for free.
 */
export default function CodeBlock({ code, language = 'text', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const tokens = tokenize(code, language)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <figure className="my-8 rounded-2xl border border-stroke bg-surface overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-stroke bg-bg/40">
        <span className="text-[10px] font-mono text-muted truncate">
          {filename ?? language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Code copied' : 'Copy code'}
          className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-muted hover:text-text-primary transition-colors shrink-0"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed font-mono">
        <code>
          {tokens.map((token, i) => (
            <span key={i} className={TOKEN_CLASS[token.type]}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}
