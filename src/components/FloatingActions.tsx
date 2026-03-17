'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, ArrowRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'

const WHATSAPP_NUMBER = '33600000000' // À personnaliser
const WHATSAPP_MESSAGE = encodeURIComponent('Bonjour, je souhaite en savoir plus sur vos solutions MindFlow.')

export default function FloatingActions() {
  const [showMobileCTA, setShowMobileCTA] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowMobileCTA(window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ── RDV Auto button — desktop ── */}
      <div className="hidden sm:block fixed bottom-6 right-[76px] z-40">
        <div className="relative group">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.95 }}
              animate={{ opacity: 0, x: 8, scale: 0.95 }}
              whileHover={{ opacity: 1, x: 0, scale: 1 }}
              className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-lg pointer-events-none"
              style={{ background: 'rgba(0,0,0,0.8)', color: 'white', backdropFilter: 'blur(8px)' }}
            >
              Prendre rendez-vous
              <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-0 h-0"
                style={{ borderLeft: '5px solid rgba(0,0,0,0.8)', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
            </motion.div>
          </AnimatePresence>
          <Link href="/rdv-auto" aria-label="Prendre un rendez-vous">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-[52px] h-[52px] flex items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                boxShadow: '0 4px 24px rgba(139,92,246,0.35)',
              }}
            >
              <CalendarDays className="w-5 h-5 text-white" />
            </motion.div>
          </Link>
        </div>
      </div>

      {/* ── WhatsApp button — desktop ── */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-40">
        <div className="relative">
          {/* Tooltip */}
          <AnimatePresence>
            {tooltipVisible && (
              <motion.div
                initial={{ opacity: 0, x: 8, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-lg pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.8)', color: 'white', backdropFilter: 'blur(8px)' }}
              >
                Contactez-nous sur WhatsApp
                <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-0 h-0"
                  style={{ borderLeft: '5px solid rgba(0,0,0,0.8)', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactez-nous sur WhatsApp"
            onHoverStart={() => setTooltipVisible(true)}
            onHoverEnd={() => setTooltipVisible(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-13 h-13 flex items-center justify-center rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.5)] transition-shadow duration-300"
            style={{
              width: 52,
              height: 52,
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
            }}
          >
            <MessageCircle className="w-5 h-5 text-white fill-white" />
          </motion.a>
        </div>
      </div>

      {/* ── Mobile CTA bar ── */}
      <AnimatePresence>
        {showMobileCTA && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.8 }}
            className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3"
            style={{
              background: 'var(--mobile-cta-bg, rgba(10,15,30,0.97))',
              backdropFilter: 'blur(20px)',
              borderTop: '0.5px solid rgba(255,255,255,0.08)',
            }}
          >
            <a
              href="#configurateur"
              className="shimmer-btn flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl text-sm font-semibold text-white"
              style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
            >
              Démarrer votre projet
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
