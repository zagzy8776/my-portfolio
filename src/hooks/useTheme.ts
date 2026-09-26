import { useEffect, useState, useCallback } from 'react'

export type Theme = 'dark' | 'light' | 'system'

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: 'dark' | 'light') {
  const root = document.documentElement
  root.classList.remove('dark', 'light')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', resolved === 'dark' ? '#0a0a0a' : '#f5f5f5')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem('theme') as Theme) || 'dark'
  })

  const [resolved, setResolved] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = (localStorage.getItem('theme') as Theme) || 'dark'
    return stored === 'system' ? getSystemTheme() : stored
  })

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem('theme', next)
    const value = next === 'system' ? getSystemTheme() : next
    setResolved(value)
    applyTheme(value)
  }, [])

  useEffect(() => {
    applyTheme(resolved)

    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const value = e.matches ? 'dark' : 'light'
      setResolved(value)
      applyTheme(value)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, resolved])

  return { theme, setTheme, resolved }
}
