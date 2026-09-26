import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import {
  Home,
  Briefcase,
  BookOpen,
  Clock,
  Mail,
  ExternalLink,
  FileText,
  Search,
} from 'lucide-react'
import { PROJECTS_DETAIL } from '../data/projects'
import { JOURNAL_ENTRIES } from '../data/journal'

const SECTION_LINKS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'experience', label: 'Experience', icon: Clock },
  { id: 'skills', label: 'Skills', icon: FileText },
  { id: 'resume', label: 'Contact', icon: Mail },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const goSection = useCallback(
    (id: string) => {
      setOpen(false)
      if (window.location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [navigate]
  )

  const goProject = useCallback(
    (slug: string) => {
      setOpen(false)
      navigate(`/work/${slug}`)
    },
    [navigate]
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[10001] flex items-start justify-center pt-[15vh] px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <Command
        className="relative w-full max-w-lg bg-surface border border-stroke rounded-2xl shadow-2xl overflow-hidden"
        label="Command palette"
      >
        <div className="flex items-center gap-3 px-4 border-b border-stroke">
          <Search className="w-4 h-4 text-muted shrink-0" />
          <Command.Input
            placeholder="Jump to section, project, or article…"
            className="w-full bg-transparent py-4 text-sm text-text-primary placeholder:text-muted outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex text-[10px] text-muted border border-stroke rounded px-1.5 py-0.5 font-mono">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[50vh] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-muted">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Sections"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted"
          >
            {SECTION_LINKS.map(({ id, label, icon: Icon }) => (
              <Command.Item
                key={id}
                value={label}
                onSelect={() => goSection(id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-primary cursor-pointer data-[selected=true]:bg-stroke/60 transition-colors"
              >
                <Icon className="w-4 h-4 text-muted" strokeWidth={1.5} />
                {label}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group
            heading="Projects"
            className="mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted"
          >
            {PROJECTS_DETAIL.map((p) => (
              <Command.Item
                key={p.slug}
                value={`${p.title} ${p.subtitle}`}
                onSelect={() => goProject(p.slug)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-primary cursor-pointer data-[selected=true]:bg-stroke/60 transition-colors"
              >
                <Briefcase className="w-4 h-4 text-muted" strokeWidth={1.5} />
                <span className="flex-1 truncate">{p.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted opacity-50" />
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group
            heading="Journal"
            className="mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted"
          >
            {JOURNAL_ENTRIES.map((e) => (
              <Command.Item
                key={e.slug}
                value={e.title}
                onSelect={() => goSection('journal')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-primary cursor-pointer data-[selected=true]:bg-stroke/60 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-muted" strokeWidth={1.5} />
                <span className="truncate">{e.title}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        <div className="px-4 py-2.5 border-t border-stroke flex items-center justify-between text-[10px] text-muted">
          <span>
            <kbd className="font-mono border border-stroke rounded px-1">⌘</kbd>
            <kbd className="font-mono border border-stroke rounded px-1 ml-0.5">K</kbd>
            {' '}to toggle
          </span>
          <span>↑↓ navigate · ↵ select</span>
        </div>
      </Command>
    </div>
  )
}
