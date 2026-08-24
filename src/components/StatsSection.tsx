import { motion } from 'framer-motion'

interface Stat {
  number: string
  label: string
  italicWord: string
}

const STATS: Stat[] = [
  {
    number: "8+",
    label: "Shipped",
    italicWord: "products"
  },
  {
    number: "4+",
    label: "Years building",
    italicWord: "systems"
  },
  {
    number: "100%",
    label: "Focus on",
    italicWord: "craft"
  }
]

export default function StatsSection() {
  return (
    <section className="bg-bg py-16 md:py-24 border-t border-b border-stroke">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-stroke">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center pt-8 first:pt-0 md:pt-0 md:px-8 space-y-2"
            >
              <span className="text-5xl md:text-6xl lg:text-7xl font-display font-light text-text-primary tracking-tight select-none">
                {stat.number}
              </span>
              <p className="text-sm text-muted max-w-[180px] leading-relaxed">
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
