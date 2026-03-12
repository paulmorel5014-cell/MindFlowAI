'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Laboratoire', href: '#laboratoire' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Tarification', href: '#tarification' },
  { label: 'Notre Vision', href: '#vision' },
  { label: 'Contact', href: '#configurateur' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'backdrop-blur-ice bg-white/[0.03] border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-neon to-cyan-glacial opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0.5 rounded-[6px] bg-space flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-cyan-glacial" strokeWidth={2.5} />
                </div>
              </div>
              <span className="font-serif font-700 text-lg tracking-tight dark:text-white text-charcoal">
                Mind<span className="gradient-text">Flow</span>
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium dark:text-slate-400 text-charcoal/60 hover:text-white dark:hover:text-white transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[0.5px] bg-gradient-to-r from-violet-neon to-cyan-glacial group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200',
                    'dark:bg-white/[0.05] bg-black/[0.05]',
                    'dark:hover:bg-white/[0.1] hover:bg-black/[0.1]',
                    'dark:text-slate-400 text-charcoal/60',
                    'dark:hover:text-white hover:text-charcoal',
                    'border border-white/[0.05]'
                  )}
                  aria-label="Changer le thème"
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                </button>
              )}

              {/* CTA */}
              <a
                href="#configurateur"
                className="hidden md:inline-flex shimmer-btn items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
              >
                Démarrer un projet
              </a>

              {/* Mobile toggle */}
              <button
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center dark:text-white text-charcoal dark:bg-white/[0.05] bg-black/[0.05]"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 left-4 right-4 z-40 frozen-card rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium dark:text-slate-300 text-charcoal/80 py-2 border-b dark:border-white/[0.05] border-black/[0.05] last:border-0"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#configurateur"
                onClick={() => setMobileOpen(false)}
                className="mt-2 shimmer-btn text-center px-5 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
              >
                Démarrer un projet
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
