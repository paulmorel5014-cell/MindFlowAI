'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    initials: 'AM',
    name: 'Antoine M.',
    role: 'Chef-propriétaire',
    company: 'Maison Varel · Paris 16e',
    quote: 'En 4 mois, MindFlow a complètement transformé notre visibilité en ligne. La liste d\'attente est passée de 2 jours à 3 semaines — un signal qu\'on n\'aurait jamais cru possible. L\'équipe comprend vraiment les enjeux de la restauration gastronomique.',
    result: '+280% de réservations',
    accent: '#F59E0B',
    stars: 5,
    delay: 0,
  },
  {
    initials: 'SL',
    name: 'Sophie L.',
    role: 'Directrice Générale',
    company: 'Grand Hôtel Aldric · Côte d\'Azur',
    quote: 'Le pricing dynamique de MindFlow a dépassé toutes nos attentes. Notre RevPAR a bondi de 195% en 6 mois grâce à des algorithmes qui anticipent les périodes creuses mieux que nos revenue managers. Une révolution pour notre établissement.',
    result: '+195% de RevPAR',
    accent: '#0EA5E9',
    stars: 5,
    delay: 0.15,
  },
  {
    initials: 'MF',
    name: 'Maître Fontaine',
    role: 'Avocat associé',
    company: 'Cabinet Fontaine & Associés · Lyon',
    quote: 'Mon agenda est plein 3 semaines à l\'avance, automatiquement. Avant MindFlow, je perdais des heures à gérer les prises de RDV. Aujourd\'hui, je me consacre entièrement à mes clients. Le ROI est évident dès le premier mois.',
    result: 'Agenda plein 3 sem. à l\'avance',
    accent: '#8B5CF6',
    stars: 5,
    delay: 0.3,
  },
]

export default function Testimonials() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section id="temoignages" className="relative py-16 md:py-28 overflow-hidden">
      <div className="absolute inset-0 dark:bg-space-mid bg-white/60" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full dark:bg-amber-500/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full dark:bg-violet-neon/[0.04] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full dark:bg-amber-500/10 bg-amber-500/5 border border-amber-500/20 mb-6">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">
              Ils nous font confiance
            </span>
          </div>
          <h2 className="font-serif text-fluid-lg font-bold dark:text-white text-charcoal mb-4">
            Des résultats qui parlent
          </h2>
          <p className="text-lg dark:text-slate-400 text-charcoal/60 max-w-xl mx-auto">
            Nos clients témoignent de l&rsquo;impact concret de nos algorithmes
            sur leur activité.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: t.delay, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {/* Top accent border */}
              <div
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full z-10"
                style={{ background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)` }}
              />

              <div className="frozen-card rounded-2xl p-7 h-full flex flex-col border dark:border-white/[0.07] border-black/[0.05] hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-shadow duration-400">
                {/* Quote icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                  style={{ background: `${t.accent}12`, border: `0.5px solid ${t.accent}25` }}
                >
                  <Quote className="w-4 h-4" style={{ color: t.accent }} />
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-sm dark:text-slate-300 text-charcoal/75 leading-relaxed flex-1 italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author + result */}
                <div className="flex items-end justify-between gap-3 pt-5 border-t dark:border-white/[0.06] border-black/[0.05]">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${t.accent}CC, ${t.accent}66)` }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold dark:text-white text-charcoal leading-tight">{t.name}</div>
                      <div className="text-xs dark:text-slate-500 text-charcoal/50">{t.role}</div>
                      <div className="text-[10px] dark:text-slate-600 text-charcoal/40 mt-0.5">{t.company}</div>
                    </div>
                  </div>
                  {/* Result badge */}
                  <div
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                    style={{ background: `${t.accent}15`, color: t.accent, border: `0.5px solid ${t.accent}30` }}
                  >
                    {t.result}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
