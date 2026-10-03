import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { useFinePointer, usePrefersReducedMotion } from './useMediaQuery'

type Options = {
  /** Seberapa jauh target ikut pointer (0..1). */
  strength?: number
  /** Elemen di dalam target yang bergerak lebih jauh (efek parallax isi tombol). */
  innerRef?: RefObject<HTMLElement | null>
  innerStrength?: number
}

/**
 * Efek magnet: `areaRef` adalah zona tangkap (boleh lebih besar dari tombol),
 * `targetRef` bergerak mengikuti pointer, lalu kembali dengan pegas elastis.
 */
export function useMagnetic(
  areaRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  { strength = 0.35, innerRef, innerStrength = 0.18 }: Options = {},
) {
  const finePointer = useFinePointer()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const area = areaRef.current
    const target = targetRef.current
    if (!area || !target || !finePointer || reduced) return
    const inner = innerRef?.current ?? null

    const xTo = gsap.quickTo(target, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(target, 'y', { duration: 0.6, ease: 'power3.out' })
    const innerXTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3.out' }) : null
    const innerYTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3.out' }) : null

    const onMove = (event: PointerEvent) => {
      const rect = area.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
      innerXTo?.(dx * innerStrength)
      innerYTo?.(dy * innerStrength)
    }

    const onLeave = () => {
      gsap.to(inner ? [target, inner] : target, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.35)',
        overwrite: true,
      })
    }

    area.addEventListener('pointermove', onMove)
    area.addEventListener('pointerleave', onLeave)
    return () => {
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(inner ? [target, inner] : target)
      gsap.set(inner ? [target, inner] : target, { clearProps: 'transform' })
    }
  }, [areaRef, targetRef, innerRef, strength, innerStrength, finePointer, reduced])
}
