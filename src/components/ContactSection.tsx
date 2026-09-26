import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import gsap from 'gsap'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const src = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => {
        hls.destroy()
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".marquee-inner", {
        xPercent: -50,
        ease: "none",
        duration: 45,
        repeat: -1
      })
    }, marqueeRef)

    return () => ctx.revert()
  }, [])

  const marqueeText = Array(8).fill("BUILDING THE FUTURE · ").join("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const tempErrors: FormErrors = {}
    if (!formData.name.trim()) tempErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address is invalid'
    }
    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required'
    if (!formData.message.trim()) tempErrors.message = 'Message is required'

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    try {
      // Web3Forms free endpoint — replace access_key with your key from https://web3forms.com
      // Or set VITE_FORM_ACCESS_KEY in .env
      const accessKey = import.meta.env.VITE_FORM_ACCESS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY'

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: 'Portfolio Contact',
        }),
      })

      const data = await res.json()

      if (data.success) {
        setIsSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setIsSuccess(false), 4500)
      } else {
        // Fallback: open mailto so the form never feels dead
        const mailto = `mailto:amadiisdore92@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
          `From: ${formData.name} <${formData.email}>\n\n${formData.message}`
        )}`
        window.location.href = mailto
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 4500)
      }
    } catch {
      const mailto = `mailto:amadiisdore92@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `From: ${formData.name} <${formData.email}>\n\n${formData.message}`
      )}`
      window.location.href = mailto
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 4500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section 
      id="resume" 
      className="relative bg-bg pt-20 pb-8 md:pb-12 overflow-hidden border-t border-stroke"
    >
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{ transform: 'translate(-50%, -50%) scaleY(-1)' }}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/80 z-10" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col items-center">
        
        <div 
          ref={marqueeRef}
          className="w-screen overflow-hidden mb-14 md:mb-20 select-none pointer-events-none"
        >
          <div className="marquee-inner flex whitespace-nowrap text-4xl md:text-6xl lg:text-8xl font-display italic text-text-primary/8 uppercase tracking-wide">
            <span className="shrink-0">{marqueeText}</span>
            <span className="shrink-0">{marqueeText}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 w-full items-start mb-20">
          
          <div className="flex flex-col items-start space-y-7 lg:pr-8 text-left">
            <div className="space-y-3">
              <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium block">
                Contact
              </span>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-text-primary leading-tight">
                Let's start a <br/>
                <span className="font-display italic text-text-primary/95">conversation</span>
              </h2>
            </div>
            
            <p className="text-sm md:text-base text-muted max-w-sm leading-relaxed">
              Have a product, platform, or system that needs careful engineering and design? Reach out.
            </p>

            <div className="space-y-1">
              <span className="text-[10px] text-muted uppercase tracking-widest font-semibold block">
                Email
              </span>
              <a 
                href="mailto:amadiisdore92@gmail.com"
                className="text-base sm:text-lg text-text-primary hover:opacity-80 font-medium leading-none transition-opacity"
              >
                amadiisdore92@gmail.com
              </a>
            </div>
          </div>

          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <div className="bg-surface/40 border border-stroke rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
              
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-surface/95 flex flex-col items-center justify-center p-6 text-center z-20 space-y-4 rounded-3xl"
                  >
                    <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                    <h3 className="text-lg font-light text-text-primary">Message sent</h3>
                    <p className="text-xs text-muted max-w-xs leading-relaxed">
                      Thank you. I'll review it and get back to you shortly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs text-muted uppercase tracking-wider font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-stroke/30 border ${
                      errors.name ? 'border-red-500/50' : 'border-stroke hover:border-muted/50 focus:border-text-primary'
                    } focus:outline-none rounded-xl px-4 py-3 text-sm text-text-primary transition-all duration-300`}
                    placeholder="Jane Doe"
                  />
                  {errors.name && <p className="text-[10px] text-red-400 font-medium">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs text-muted uppercase tracking-wider font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-stroke/30 border ${
                      errors.email ? 'border-red-500/50' : 'border-stroke hover:border-muted/50 focus:border-text-primary'
                    } focus:outline-none rounded-xl px-4 py-3 text-sm text-text-primary transition-all duration-300`}
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-[10px] text-red-400 font-medium">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs text-muted uppercase tracking-wider font-semibold">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full bg-stroke/30 border ${
                      errors.subject ? 'border-red-500/50' : 'border-stroke hover:border-muted/50 focus:border-text-primary'
                    } focus:outline-none rounded-xl px-4 py-3 text-sm text-text-primary transition-all duration-300`}
                    placeholder="Project inquiry, collaboration..."
                  />
                  {errors.subject && <p className="text-[10px] text-red-400 font-medium">{errors.subject}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs text-muted uppercase tracking-wider font-semibold">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full bg-stroke/30 border ${
                      errors.message ? 'border-red-500/50' : 'border-stroke hover:border-muted/50 focus:border-text-primary'
                    } focus:outline-none rounded-xl px-4 py-3 text-sm text-text-primary transition-all duration-300 resize-none`}
                    placeholder="Tell me about the project..."
                  />
                  {errors.message && <p className="text-[10px] text-red-400 font-medium">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative rounded-full p-[1.5px] hover:scale-[1.01] active:scale-[0.99] transition-transform duration-300 group/submit mt-1"
                >
                  <div className="absolute inset-0 rounded-full accent-gradient" />
                  <div className="relative w-full py-3.5 bg-text-primary text-bg group-hover/submit:bg-bg group-hover/submit:text-text-primary rounded-full text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300">
                    {isSubmitting ? (
                      <>
                        Sending <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </>
                    ) : (
                      <>
                        Send message <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full border-t border-stroke/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a 
              href="https://x.com/zagzylinks?s=11"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-text-primary transition-colors duration-300 font-medium"
            >
              Twitter
            </a>
            <a 
              href="https://www.linkedin.com/in/isidore-amadi-2494061b2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-text-primary transition-colors duration-300 font-medium"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/zagzy8776"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-text-primary transition-colors duration-300 font-medium"
            >
              GitHub
            </a>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-muted font-medium select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Open to new projects</span>
          </div>
        </div>

        <div className="w-full text-center mt-8 text-[10px] text-muted/40 font-mono tracking-wide">
          © {new Date().getFullYear()} Zagzy Link. All rights reserved.
        </div>
      </div>
    </section>
  )
}
