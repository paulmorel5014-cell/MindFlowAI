'use client'

import { useEffect, useState } from 'react'

/**
 * Returns an incrementing integer that bumps every time rdv-store
 * broadcasts a 'rdv:store-updated' event.
 * Add this to useMemo/useEffect dependency arrays so they re-run
 * whenever the appointment store changes.
 */
export function useStoreVersion(): number {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const handler = () => setVersion((v) => v + 1)
    window.addEventListener('rdv:store-updated', handler)
    return () => window.removeEventListener('rdv:store-updated', handler)
  }, [])

  return version
}
