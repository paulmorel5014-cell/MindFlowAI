'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  children: React.ReactNode
  /** Where to redirect unauthenticated users. Defaults to /login */
  redirectTo?: string
}

export default function AuthGuard({ children, redirectTo = '/login' }: Props) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      const from = typeof window !== 'undefined' ? window.location.pathname : ''
      router.push(`${redirectTo}?from=${encodeURIComponent(from)}`)
    }
  }, [user, isLoading, router, redirectTo])

  if (isLoading || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #0F1628 55%, #0A0F1E 100%)' }}
      >
        <div className="flex flex-col items-center gap-5">
          <motion.div
            animate={{ scale: [0.92, 1, 0.92], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
              boxShadow: '0 0 40px rgba(139,92,246,0.45)',
            }}
          >
            <Zap className="w-7 h-7 text-white" />
          </motion.div>
          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="text-[11px] font-mono text-white/40 tracking-[0.2em] uppercase"
          >
            Vérification de session…
          </motion.p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
