import { motion } from 'framer-motion'

interface Stat {
  number: string
  label: string
  italicWord: string
}

const STATS: Stat[] = [
  {
    number: "20+",
    label: "Years of global",
    italicWord: "experience"
  },
  {
    number: "95+",
    label: "Creative projects",
    italicWord: "completed"
  },
  {
    number: "200%",
    label: "Client satisfaction",
    italicWord: "rate"
  }
]

export default function StatsSection() {
  return (
    <section className="bg-bg py-20 md:py-32 border-t border-b border-stroke">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-stroke">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center p-6 md:px-8 space-y-3"
            >
              {/* Stat Number */}
              <span className="text-6xl md:text-7xl lg:text-8xl font-display font-light text-text-primary tracking-tight select-none">
                {stat.number}
              </span>
              
              {/* Stat Label */}
              <p className="text-sm md:text-base text-muted max-w-[200px] leading-relaxed">
                {stat.label}{' '}
                <span className="font-display italic text-text-primary">
                  {stat.italicWord}
                </span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
