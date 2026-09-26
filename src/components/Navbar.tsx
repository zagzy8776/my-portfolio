import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'Work', id: 'work' },
  { label: 'Journal', id: 'journal' },
  { label: 'Experience', id: 'experience' },
  { label: 'Skills', id: 'skills' },
  { label: 'Contact', id: 'resume' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)

      const sections = NAV_LINKS.map((l) => l.id)
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  const scrollToSection = (id: string) => {
    if (!isHome) {
      navigate(`/#${id}`)
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div
        className={`inline-flex items-center rounded-full border border-white/10 bg-surface/90 px-2 py-2 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? 'shadow-lg shadow-black/40' : ''
        }`}
      >
        <div
          onClick={() => (isHome ? scrollToSection('home') : navigate('/'))}
          className="relative w-9 h-9 rounded-full flex items-center justify-center p-[1.5px] cursor-pointer group/logo transition-transform duration-300 hover:scale-105"
          aria-label="Go to home"
        >
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#89AACC_0%,#4E85BF_100%)] group-hover/logo:bg-[linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)] transition-all duration-500" />
          <div className="relative w-full h-full bg-bg rounded-full flex items-center justify-center select-none">
            <span className="font-display italic text-[13px] text-text-primary leading-none">
              ZL
            </span>
          </div>
        </div>

        <div className="hidden sm:block w-px h-5 bg-stroke mx-2" />

        <div className="flex items-center gap-0.5 sm:gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = isHome && activeSection === link.id
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-xs sm:text-sm rounded-full px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-300 font-medium ${
                  isActive
                    ? 'text-text-primary bg-stroke/60'
                    : 'text-muted hover:text-text-primary hover:bg-stroke/40'
                }`}
              >
                {link.label}
              </button>
            )
          })}
        </div>

        <div className="w-px h-5 bg-stroke mx-2" />

        <div className="flex items-center gap-1.5">
          <ThemeToggle compact />
          <a
            href="mailto:amadiisdore92@gmail.com"
            className="relative text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 font-medium group/sayhi overflow-visible block"
          >
            <span className="absolute inset-[-1.5px] rounded-full accent-gradient opacity-0 group-hover/sayhi:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-1 bg-surface group-hover/sayhi:bg-surface/90 text-text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors duration-300">
              Say hi{' '}
              <span className="inline-block transition-transform duration-300 group-hover/sayhi:translate-x-0.5 group-hover/sayhi:-translate-y-0.5">
                ↗
              </span>
            </span>
          </a>
        </div>
      </div>
    </nav>
  )
}
