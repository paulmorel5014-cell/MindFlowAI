'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'

const STORAGE_KEY = 'otterflow_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280, mass: 0.9 }}
          className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-4 sm:pb-6 pt-0"
        >
          <div className="max-w-4xl mx-auto">
            {/* Glow border */}
            <div
              className="absolute inset-[1px] rounded-[20px] pointer-events-none z-0"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), transparent 50%, rgba(6,182,212,0.1))' }}
            />
            <div className="relative z-10 dark:bg-[#0F1628]/96 bg-white/96 backdrop-blur-2xl rounded-[18px] border dark:border-white/[0.08] border-black/[0.07] shadow-[0_-8px_40px_rgba(0,0,0,0.3)] px-5 py-5">
              {/* Top accent */}
              <div className="absolute top-0 left-8 right-8 h-[1.5px] rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(6,182,212,0.4), transparent)' }}
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Icon + text */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 dark:bg-violet-neon/10 bg-violet-neon/5 border dark:border-violet-neon/20 border-violet-neon/15 mt-0.5">
                    <Cookie className="w-4 h-4 text-violet-bright" />
                  </div>
                  <div>
                    <p className="text-sm font-medium dark:text-white text-charcoal mb-0.5">
                      Nous utilisons des cookies
                    </p>
                    <p className="text-xs dark:text-slate-400 text-charcoal/60 leading-relaxed">
                      Des cookies analytiques anonymisés améliorent votre expérience.
                      Consultez notre{' '}
                      <span className="underline decoration-dotted cursor-pointer dark:text-slate-300 text-charcoal/80 hover:text-violet-bright transition-colors">
                        politique de confidentialité
                      </span>
                      .
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                  <button
                    onClick={decline}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium dark:text-slate-400 text-charcoal/60 dark:hover:text-white hover:text-charcoal dark:hover:bg-white/[0.07] hover:bg-black/[0.05] transition-all duration-200 border dark:border-white/[0.07] border-black/[0.06]"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={accept}
                    className="flex-1 sm:flex-none shimmer-btn px-5 py-2 rounded-xl text-xs font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
                  >
                    Accepter
                  </button>
                  <button
                    onClick={decline}
                    className="hidden sm:flex w-7 h-7 rounded-full dark:bg-white/[0.06] bg-black/[0.04] items-center justify-center dark:hover:bg-white/[0.12] hover:bg-black/[0.08] transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-3 h-3 dark:text-slate-400 text-charcoal/50" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
