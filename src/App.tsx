import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import LoadingScreen from './components/LoadingScreen'
import CommandPalette from './components/CommandPalette'
import SmoothScroll from './components/SmoothScroll'
import Index from './pages/Index'
import CaseStudy from './pages/work/CaseStudy'
import JournalIndex from './pages/journal/JournalIndex'
import Article from './pages/journal/Article'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import { useTheme } from './hooks/useTheme'

/**
 * Hash navigation has to wait for `Index` to mount, which happens only once
 * `LoadingScreen` finishes. Polling for the element is what stops a deep link
 * to `/#journal` from racing the loader and silently doing nothing.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      let attempts = 0
      let timer = 0

      const tryScroll = () => {
        const el = document.getElementById(id)
        if (el) {
          if (window.__lenis) {
            window.__lenis.scrollTo(el, { offset: 0, duration: 1.1 })
          } else {
            el.scrollIntoView({ behavior: 'smooth' })
          }
          return
        }
        if (attempts < 40) {
          attempts += 1
          timer = window.setTimeout(tryScroll, 100)
        }
      }

      tryScroll()
      return () => window.clearTimeout(timer)
    }

    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

function AppShell() {
  const [isLoading, setIsLoading] = useState(true)
  const { pathname } = useLocation()
  useTheme()

  // The home page renders its own Navbar inside `Index`.
  const showRouteNavbar = pathname !== '/'

  return (
    <div className="relative min-h-screen bg-bg text-text-primary overflow-x-hidden">
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <SmoothScroll>
          <ScrollToTop />
          <CommandPalette />
          {showRouteNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/journal" element={<JournalIndex />} />
            <Route path="/journal/:slug" element={<Article />} />
            <Route path="*" element={<NotFound />} />
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
