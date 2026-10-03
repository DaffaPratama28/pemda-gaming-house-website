import { useEffect, useRef } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { gsap } from '../lib/gsap'

const INTERACTIVE = 'a, button, [role="button"], summary, label, [data-cursor]'

/**
 * Cursor kustom (dot + ring). Elemen dengan `data-cursor="LABEL"` membuat ring
 * membesar dengan label; `data-cursor-theme="dark"` membalik warna di area terang.
 * Hanya aktif di perangkat dengan pointer presisi.
 */
export function Cursor() {
  const finePointer = useFinePointer()
  return finePointer ? <CursorLayer /> : null
}

function CursorLayer() {
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!root || !dot || !ring || !label) return

    const html = document.documentElement
    html.classList.add('has-custom-cursor')

    const lag = reduced ? 0.08 : 0.5
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' })
    const ringX = gsap.quickTo(ring, 'x', { duration: lag, ease: 'power3' })
    const ringY = gsap.quickTo(ring, 'y', { duration: lag, ease: 'power3' })

    let current: Element | null = null

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      root.classList.add('cursor-visible')
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }

    const onOver = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null
      root.classList.toggle('cursor-dark', Boolean(element?.closest('[data-cursor-theme="dark"]')))
      const target = element?.closest(INTERACTIVE) ?? null
      if (target === current) return
      current = target
      const text = target?.getAttribute('data-cursor')
      if (text) {
        label.textContent = text
        ring.dataset.state = 'label'
      } else {
        ring.dataset.state = target ? 'hover' : 'default'
      }
    }

    const onDown = () => {
      ring.dataset.pressed = 'true'
    }
    const onUp = () => {
      ring.dataset.pressed = 'false'
    }
    const onLeave = () => root.classList.remove('cursor-visible')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    html.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      html.removeEventListener('pointerleave', onLeave)
      html.classList.remove('has-custom-cursor')
      gsap.killTweensOf([dot, ring])
    }
  }, [reduced])

  return (
    <div ref={rootRef} aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" data-state="default">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
