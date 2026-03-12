'use client'

import { motion } from 'framer-motion'
import { Zap, Twitter, Linkedin, Instagram, ArrowUpRight } from 'lucide-react'

const links = {
  Solutions: [
    { label: 'Prospect Radar', href: '#laboratoire' },
    { label: 'MindFlow Analytics', href: '#laboratoire' },
    { label: 'RDV Auto', href: '#laboratoire' },
    { label: 'Algorithmes SEO', href: '#laboratoire' },
  ],
  Secteurs: [
    { label: 'Restauration', href: '#portfolio' },
    { label: 'Hôtellerie', href: '#portfolio' },
    { label: 'BTP & Immobilier', href: '#portfolio' },
    { label: 'Juridique', href: '#portfolio' },
  ],
  Agence: [
    { label: 'Notre vision', href: '#vision' },
    { label: 'Études de cas', href: '#portfolio' },
    { label: 'Tarification', href: '#tarification' },
    { label: 'Contact', href: '#configurateur' },
  ],
}

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-10 overflow-hidden dark:bg-space bg-ivory border-t dark:border-white/[0.05] border-black/[0.06]">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/30 to-transparent" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] dark:bg-violet-neon/[0.03] blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 group mb-5 w-fit">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-neon to-cyan-glacial opacity-80" />
                <div className="absolute inset-0.5 rounded-[10px] dark:bg-space bg-white flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-glacial" strokeWidth={2.5} />
                </div>
              </div>
              <span className="font-serif font-bold text-xl dark:text-white text-charcoal">
                Mind<span className="gradient-text">Flow</span>
              </span>
            </a>

            <p className="text-sm dark:text-slate-400 text-charcoal/60 leading-relaxed max-w-xs mb-6">
              L&rsquo;architecture digitale de prestige. Algorithmes prédictifs,
              flux de données et moteurs de croissance pour les marques d&rsquo;exception.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center dark:bg-white/[0.04] bg-black/[0.04] dark:border-white/[0.06] border border-black/[0.06] dark:text-slate-500 text-charcoal/50 dark:hover:text-white hover:text-charcoal dark:hover:bg-white/[0.08] hover:bg-black/[0.08] transition-all duration-200"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-bold uppercase tracking-widest dark:text-white text-charcoal mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm dark:text-slate-500 text-charcoal/50 dark:hover:text-white hover:text-charcoal transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t dark:border-white/[0.05] border-black/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs dark:text-slate-600 text-charcoal/40">
            © 2025 MindFlow. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            {['Mentions légales', 'Confidentialité', 'CGU'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs dark:text-slate-600 text-charcoal/40 dark:hover:text-slate-400 hover:text-charcoal/60 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
