import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'

/** Shown for unknown `/work/:slug` and `/journal/:slug` URLs. */
export default function NotFound() {
  return (
    <>
      <SEO
        title="Not found"
        description="That page does not exist. Head back to the portfolio or browse the journal."
        path="/404"
      />
      <main className="relative z-10 w-full min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md text-center"
        >
          <p className="text-[10px] text-muted uppercase tracking-[0.25em] mb-4">
            404
          </p>
          <h1 className="font-display italic text-3xl md:text-5xl text-text-primary leading-tight">
            Nothing at this address
          </h1>
          <p className="mt-5 text-sm text-muted leading-relaxed font-light">
            The page you were looking for has moved or never existed. The essays
            and case studies are still where you left them.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-text-primary text-bg text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Portfolio
            </Link>
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-stroke text-text-primary text-xs font-semibold uppercase tracking-widest hover:bg-surface transition-colors"
            >
              Journal
            </Link>
          </div>
        </motion.div>
      </main>
    </>
  )
}
