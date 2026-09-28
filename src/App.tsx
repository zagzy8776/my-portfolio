import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import LoadingScreen from './components/LoadingScreen'
import CommandPalette from './components/CommandPalette'
import SmoothScroll from './components/SmoothScroll'
import Index from './pages/Index'
import CaseStudy from './pages/work/CaseStudy'
import { useTheme } from './hooks/useTheme'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (!el) return
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { offset: 0, duration: 1.1 })
        } else {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 80)
    } else {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }
  }, [pathname, hash])
  return null
}

function AppShell() {
  const [isLoading, setIsLoading] = useState(true)
  useTheme()

  return (
    <div className="relative min-h-screen bg-bg text-text-primary overflow-x-hidden">
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <SmoothScroll>
          <ScrollToTop />
          <CommandPalette />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="*" element={<Index />} />
          </Routes>
        </SmoothScroll>
      )}
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </HelmetProvider>
  )
}
