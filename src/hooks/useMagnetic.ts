import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { useFinePointer, usePrefersReducedMotion } from './useMediaQuery'

/** Seberapa jauh tombol (dan isinya) ikut pointer, relatif terhadap jarak ke pusat. */
const STRENGTH = 0.35
const INNER_STRENGTH = 0.18

/**
 * Efek magnet: `areaRef` adalah zona tangkap (boleh lebih besar dari tombol),
 * `targetRef` bergerak mengikuti pointer, `innerRef` (isi tombol) bergerak sedikit
 * lebih jauh, lalu semuanya kembali dengan pegas elastis.
 */
export function useMagnetic(
  areaRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  innerRef: RefObject<HTMLElement | null>,
) {
  const finePointer = useFinePointer()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const area = areaRef.current
    const target = targetRef.current
    const inner = innerRef.current
    if (!area || !target || !inner || !finePointer || reduced) return

    const quick = (element: HTMLElement, axis: 'x' | 'y') =>
      gsap.quickTo(element, axis, { duration: 0.6, ease: 'power3.out' })
    const xTo = quick(target, 'x')
    const yTo = quick(target, 'y')
    const innerXTo = quick(inner, 'x')
    const innerYTo = quick(inner, 'y')

    const onMove = (event: PointerEvent) => {
      const rect = area.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      xTo(dx * STRENGTH)
      yTo(dy * STRENGTH)
      innerXTo(dx * INNER_STRENGTH)
      innerYTo(dy * INNER_STRENGTH)
    }

    const onLeave = () => {
      gsap.to([target, inner], {
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
      gsap.killTweensOf([target, inner])
      gsap.set([target, inner], { clearProps: 'transform' })
    }
  }, [areaRef, targetRef, innerRef, finePointer, reduced])
}
