import { useEffect, useSyncExternalStore } from 'react'
import { startMotionTracking } from '../lib/motion'
import { getLenis, startSmoothScroll, subscribeLenis } from '../lib/smoothScroll'
import { usePrefersReducedMotion } from './useMediaQuery'

/** Instance Lenis aktif (null bila smooth scroll mati karena reduced motion). */
export function useLenis() {
  return useSyncExternalStore(subscribeLenis, getLenis, () => null)
}

/** Dipanggil sekali di App: smooth scroll + pelacakan pointer/scroll global. */
export function useSmoothScrollSetup() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => startMotionTracking(), [])

  useEffect(() => {
    if (reduced) return
    return startSmoothScroll()
  }, [reduced])
}
