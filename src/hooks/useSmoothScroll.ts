import { useEffect } from 'react'
import { startMotionTracking } from '../lib/motion'
import { startSmoothScroll } from '../lib/smoothScroll'
import { usePrefersReducedMotion } from './useMediaQuery'

/** Dipanggil sekali di App: smooth scroll (kecuali reduced motion) + pelacakan pointer/scroll. */
export function useSmoothScrollSetup() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => startMotionTracking(), [])

  useEffect(() => {
    if (reduced) return
    return startSmoothScroll()
  }, [reduced])
}
