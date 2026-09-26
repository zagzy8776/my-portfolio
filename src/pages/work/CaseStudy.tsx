import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { getProjectBySlug, getAdjacentProjects } from '../../data/projects'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined
  const { prev, next } = slug ? getAdjacentProjects(slug) : { prev: null, next: null }

  if (!project) return <Navigate to="/" replace />

  return (
    <div className="relative min-h-screen bg-bg text-text-primary">
      <SEO
        title={project.title}
        description={project.subtitle}
        path={`/work/${project.slug}`}
        image={project.coverImage ? `https://portfolios-ruby-alpha.vercel.app${project.coverImage}` : undefined}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.subtitle,
          dateCreated: project.year,
          author: { '@type': 'Person', name: 'Zagzy Link' },
          url: `https://portfolios-ruby-alpha.vercel.app/work/${project.slug}`,
        }}
      />
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="max-w-[900px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/#work"
              className="inline-flex items-center gap-2 text-xs text-muted hover:text-text-primary transition-colors mb-10 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              All work
            </Link>

            <div className="space-y-4 mb-10">
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted uppercase tracking-[0.2em]">
                <span>{project.year}</span>
                <span className="w-1 h-1 rounded-full bg-stroke" />
                <span>{project.role}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-light tracking-tight text-text-primary leading-tight">
                {project.title}
              </h1>
              <p className="text-base md:text-lg text-muted max-w-xl leading-relaxed">
                {project.subtitle}
              </p>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-text-primary hover:opacity-80 group"
                >
                  View live
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>

            {/* Cover */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-stroke bg-surface mb-14">
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${project.gradient || 'from-surface to-bg'} flex items-center justify-center`}
                >
                  <span className="font-display italic text-3xl md:text-5xl text-text-primary/20">
                    {project.title}
                  </span>
                </div>
              )}
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14 pb-14 border-b border-stroke">
              <div>
                <h3 className="text-[10px] text-muted uppercase tracking-[0.2em] mb-3">
                  Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full border border-stroke bg-surface text-xs text-text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] text-muted uppercase tracking-[0.2em] mb-3">
                  Highlights
                </h3>
                <ul className="space-y-1.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="text-sm text-muted flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-text-primary/40 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Narrative */}
            <div className="space-y-12 text-left">
              <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-display italic text-text-primary">
                  Problem
                </h2>
                <p className="text-sm md:text-base text-muted leading-relaxed font-light">
                  {project.problem}
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-display italic text-text-primary">
                  Approach
                </h2>
                <ul className="space-y-3">
                  {project.approach.map((step, i) => (
                    <li
                      key={i}
                      className="text-sm md:text-base text-muted leading-relaxed font-light flex gap-3"
                    >
                      <span className="text-text-primary/50 font-mono text-xs mt-1 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-display italic text-text-primary">
                  Outcome
                </h2>
                <p className="text-sm md:text-base text-muted leading-relaxed font-light">
                  {project.outcome}
                </p>
              </section>
            </div>

            {/* Adjacent */}
            <div className="mt-20 pt-10 border-t border-stroke grid grid-cols-1 sm:grid-cols-2 gap-6">
              {prev ? (
                <Link
                  to={`/work/${prev.slug}`}
                  className="group flex flex-col items-start gap-1 p-5 rounded-2xl border border-stroke bg-surface/40 hover:bg-surface transition-colors"
                >
                  <span className="text-[10px] text-muted uppercase tracking-widest flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Previous
                  </span>
                  <span className="text-base text-text-primary font-light group-hover:opacity-80">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  to={`/work/${next.slug}`}
                  className="group flex flex-col items-end gap-1 p-5 rounded-2xl border border-stroke bg-surface/40 hover:bg-surface transition-colors text-right"
                >
                  <span className="text-[10px] text-muted uppercase tracking-widest flex items-center gap-1">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-base text-text-primary font-light group-hover:opacity-80">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
