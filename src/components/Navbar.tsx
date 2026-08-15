import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)

      // Simple active link calculation
      const sections = ['home', 'work', 'resume']
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div
        className={`inline-flex items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md transition-shadow duration-300 ${
          isScrolled ? 'shadow-md shadow-black/40' : ''
        }`}
      >
        {/* 1. Logo */}
        <div
          onClick={() => scrollToSection('home')}
          className="relative w-9 h-9 rounded-full flex items-center justify-center p-[1.5px] cursor-pointer group/logo transition-transform duration-300 hover:scale-110"
        >
          {/* Logo ring with accent gradient border reversing on hover */}
          <div className="absolute inset-0 rounded-full transition-all duration-500 bg-[linear-gradient(90deg,#89AACC_0%,#4E85BF_100%)] group-hover/logo:bg-[linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)]" />
          
          {/* Inner bg-bg circle */}
          <div className="relative w-full h-full bg-bg rounded-full flex items-center justify-center select-none">
            <span className="font-display italic text-[13px] text-text-primary leading-none">
              JA
            </span>
          </div>
        </div>

        {/* 2. Divider (hidden on mobile) */}
        <div className="hidden sm:block w-px h-5 bg-stroke mx-2" />

        {/* 3. Nav links */}
        <div className="flex items-center gap-1">
          {['Home', 'Work', 'Resume'].map((link) => {
            const id = link.toLowerCase()
            const isActive = activeSection === id
            return (
              <button
                key={link}
                onClick={() => scrollToSection(id)}
                className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 font-medium ${
                  isActive
                    ? 'text-text-primary bg-stroke/50'
                    : 'text-muted hover:text-text-primary hover:bg-stroke/50'
                }`}
              >
                {link}
              </button>
            )
          })}
        </div>

        {/* 4. Divider */}
        <div className="w-px h-5 bg-stroke mx-2" />

        {/* 5. "Say hi" button */}
        <a
          href="mailto:amadiisdore92@gmail.com"
          className="relative text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 font-medium group/sayhi overflow-visible block"
        >
          {/* Accent gradient border on hover */}
          <span className="absolute inset-[-1.5px] rounded-full accent-gradient opacity-0 group-hover/sayhi:opacity-100 transition-opacity duration-300 animate-gradient-shift" />
          
          {/* Inner Content */}
          <span className="relative flex items-center gap-1 bg-surface group-hover/sayhi:bg-surface/90 text-text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors duration-300">
            Say hi <span className="inline-block transition-transform duration-300 group-hover/sayhi:translate-x-0.5 group-hover/sayhi:-translate-y-0.5">↗</span>
          </span>
        </a>
      </div>
    </nav>
  )
}
