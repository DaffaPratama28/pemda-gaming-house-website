import { useCallback, useSyncExternalStore } from 'react'

/** Berlangganan media query tanpa setState di effect (aman untuk React Compiler). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Perangkat dengan mouse/trackpad presisi (bukan layar sentuh). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

export const useIsDesktop = () => useMediaQuery('(min-width: 768px)')
