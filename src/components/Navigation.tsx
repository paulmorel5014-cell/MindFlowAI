'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

function LogoMark() {
  const [imgOk, setImgOk] = useState(true)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const logoFilter = mounted
    ? resolvedTheme === 'dark'
      ? 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(139,92,246,0.5))'
      : 'brightness(0)'
    : 'brightness(0) invert(1)'

  return (
    <div className="relative w-11 h-11 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/IMG_0258.webp"
          alt="OtterFlow logo"
          width={44}
          height={44}
          className="w-full h-full object-contain"
          style={{ filter: logoFilter, transition: 'filter 0.3s' }}
          onError={() => setImgOk(false)}
        />
      ) : (
        <>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-neon to-cyan-glacial opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0.5 rounded-[10px] dark:bg-space bg-white flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-glacial" strokeWidth={2.5} />
          </div>
        </>
      )}
    </div>
  )
}

const navLinks = [
  { label: 'Laboratoire', href: '#laboratoire' },
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

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

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
            ? 'backdrop-blur-xl dark:bg-space/80 bg-ivory/90 border-b dark:border-white/[0.06] border-black/[0.06] shadow-[0_1px_0_rgba(0,0,0,0.04)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">

            {/* Logo */}
            <a href="#" className="flex items-center group flex-shrink-0">
              <LogoMark />
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium dark:text-slate-400 text-charcoal/65 dark:hover:text-white hover:text-charcoal transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[0.5px] bg-gradient-to-r from-violet-neon to-cyan-glacial group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
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
                    'border dark:border-white/[0.05] border-black/[0.06]'
                  )}
                  aria-label="Changer le thème"
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                </button>
              )}

              {/* CTA — desktop only */}
              <a
                href="https://wa.me/33781364451"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex shimmer-btn items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
              >
                Démarrer un projet
              </a>

              {/* Burger — mobile only */}
              <motion.button
                className={cn(
                  'md:hidden relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                  'dark:text-white text-charcoal',
                  mobileOpen
                    ? 'dark:bg-white/[0.10] bg-black/[0.08] dark:border-white/[0.10] border-black/[0.08] border'
                    : 'dark:bg-white/[0.04] bg-black/[0.04] dark:border-white/[0.06] border-black/[0.06] border'
                )}
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                whileTap={{ scale: 0.92 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X size={18} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu — full-width panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[68px] left-3 right-3 z-50 md:hidden rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(12, 12, 18, 0.96)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(139,92,246,0.15)',
              }}
            >
              {/* Accent top bar */}
              <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-violet-neon/60 to-transparent" />

              <div className="p-5">
                {/* Nav links */}
                <div className="space-y-1 mb-5">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.06, ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-base font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-all duration-150 group"
                    >
                      {link.label}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-150" />
                    </motion.a>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.06] mb-5" />

                {/* CTA */}
                <motion.a
                  href="https://wa.me/33781364451"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.35 }}
                  className="shimmer-btn flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-bold text-white"
                  style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
                >
                  Démarrer un projet
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
