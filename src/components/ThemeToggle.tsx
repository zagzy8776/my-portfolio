import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme, type Theme } from '../hooks/useTheme'

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
]

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme()

  if (compact) {
    const next: Theme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
    const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor
    return (
      <button
        onClick={() => setTheme(next)}
        className="relative w-9 h-9 rounded-full flex items-center justify-center border border-stroke bg-surface/80 hover:bg-stroke/60 transition-colors"
        aria-label={`Theme: ${theme}. Click to switch.`}
        title={`Theme: ${theme}`}
      >
        <Icon className="w-4 h-4 text-text-primary" strokeWidth={1.5} />
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-0.5 p-1 rounded-full border border-stroke bg-surface/80">
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const active = theme === value
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`relative px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
              active
                ? 'bg-stroke/80 text-text-primary'
                : 'text-muted hover:text-text-primary'
            }`}
            aria-label={label}
            aria-pressed={active}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
