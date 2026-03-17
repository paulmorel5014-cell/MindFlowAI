'use client'

import { useEffect, useState } from 'react'
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase'
import { useAuth } from './useAuth'

/**
 * Returns an integer that increments whenever the appointment store changes.
 * When Supabase is configured, also responds to Realtime events from other devices.
 */
export function useStoreVersion(): number {
  const [version, setVersion] = useState(0)
  const { user } = useAuth()

  // localStorage CustomEvent (both modes)
  useEffect(() => {
    const handler = () => setVersion((v) => v + 1)
    window.addEventListener('rdv:store-updated', handler)
    window.addEventListener('otterflow:appointment', handler)
    return () => {
      window.removeEventListener('rdv:store-updated', handler)
      window.removeEventListener('otterflow:appointment', handler)
    }
  }, [])

  // Supabase Realtime (cross-device sync)
  useEffect(() => {
    if (!SUPABASE_ENABLED || !user?.id) return

    const channel = supabase
      .channel(`rdv-sync-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments', filter: `artisan_id=eq.${user.id}` },
        () => setVersion((v) => v + 1),
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rdv_events', filter: `artisan_id=eq.${user.id}` },
        () => setVersion((v) => v + 1),
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user?.id])

  return version
}
