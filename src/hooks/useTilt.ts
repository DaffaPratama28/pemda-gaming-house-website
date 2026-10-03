import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { useFinePointer, usePrefersReducedMotion } from './useMediaQuery'

type Options = {
  /** Rotasi maksimum dalam derajat. */
  max?: number
}

/**
 * Tilt 3D + glare mengikuti pointer. Posisi glare diekspos lewat CSS variable
 * `--glare-x`, `--glare-y`, `--glare-o` (dipakai class `.tilt-glare`).
 */
export function useTilt(ref: RefObject<HTMLElement | null>, { max = 9 }: Options = {}) {
  const finePointer = useFinePointer()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || !finePointer || reduced) return

    gsap.set(element, { transformPerspective: 900 })
    const rotateX = gsap.quickTo(element, 'rotationX', { duration: 0.7, ease: 'power3.out' })
    const rotateY = gsap.quickTo(element, 'rotationY', { duration: 0.7, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      rotateY((px - 0.5) * max * 2)
      rotateX((0.5 - py) * max * 2)
      element.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`)
      element.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`)
      element.style.setProperty('--glare-o', '1')
    }

    const onLeave = () => {
      rotateX(0)
      rotateY(0)
      element.style.setProperty('--glare-o', '0')
    }

    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerleave', onLeave)
    return () => {
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(element)
      gsap.set(element, { clearProps: 'transform' })
    }
  }, [ref, max, finePointer, reduced])
}
