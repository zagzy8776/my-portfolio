import { motion } from 'framer-motion'
import { SKILL_GROUPS } from '../data/skills'

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-bg py-16 md:py-24 border-t border-stroke">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 md:mb-16"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium">
                Capabilities
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-text-primary leading-tight">
              Stack & <span className="font-display italic text-text-primary/95">craft</span>
            </h2>
            <p className="text-sm md:text-base text-muted max-w-md leading-relaxed">
              Tools and systems I use to design, build, and ship products end-to-end.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {SKILL_GROUPS.map((group, gIdx) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: gIdx * 0.1 }}
              className="space-y-5"
            >
              <h3 className="text-xs text-muted uppercase tracking-[0.2em] font-semibold">
                {group.category}
              </h3>
              <ul className="space-y-4">
                {group.items.map((skill) => (
                  <li key={skill.name} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-text-primary font-medium">
                        {skill.name}
                      </span>
                      {skill.years && (
                        <span className="text-[10px] text-muted tabular-nums shrink-0">
                          {skill.years}
                        </span>
                      )}
                    </div>
                    <div className="h-1 w-full rounded-full bg-stroke overflow-hidden">
                      <motion.div
                        className="h-full accent-gradient rounded-full origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: skill.level / 100 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ transformOrigin: 'left' }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
