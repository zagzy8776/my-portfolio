import { useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

/**
 * "Get new essays" capture, wired to the same Web3Forms access key used by
 * `ContactSection` so there is one email provider for the whole site rather
 * than a second vendor for one input.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error')
      return
    }

    setStatus('submitting')

    try {
      const accessKey = import.meta.env.VITE_FORM_ACCESS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY'

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          email,
          subject: 'Journal subscription — new essays',
          message: `New journal subscriber: ${email}`,
          from_name: 'Portfolio Journal',
        }),
      })

      const data = await res.json()
      setStatus(data.success ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sm text-text-primary">
        <CheckCircle2 className="w-4 h-4" />
        You&rsquo;re on the list. New essays land in your inbox.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="you@example.com"
          aria-label="Email address"
          className={`flex-1 bg-stroke/30 border ${
            status === 'error'
              ? 'border-red-500/50'
              : 'border-stroke hover:border-muted/50 focus:border-text-primary'
          } focus:outline-none rounded-full px-4 py-3 text-sm text-text-primary transition-all duration-300`}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="relative rounded-full px-5 py-3 bg-text-primary text-bg text-xs font-semibold uppercase tracking-widest inline-flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {status === 'submitting' ? (
            <>
              Saving <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </>
          ) : (
            <>
              Subscribe <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-2 text-[10px] text-red-400 font-medium">
          Please enter a valid email address.
        </p>
      )}
    </form>
  )
}
