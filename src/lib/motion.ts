import { gsap, ScrollTrigger } from './gsap'

/**
 * State gerak bersama yang sengaja mutable.
 * Ditulis oleh event listener, ticker, dan ScrollTrigger; dibaca setiap frame
 * oleh scene 3D & animasi ticker. Tidak memicu re-render React sama sekali.
 */
export const motion = {
  /** Posisi pointer: px layar + ternormalisasi -1..1 (y ke atas positif). */
  pointer: { x: 0, y: 0, nx: 0, ny: 0 },
  /** `velocity` = px per frame (60fps) yang sudah dihaluskan; tanda = arah scroll. */
  scroll: { y: 0, velocity: 0, direction: 1, progress: 0 },
  hero: { intro: 0, progress: 0 },
  spotlight: { progress: 0 },
  arsenal: { active: -1 },
  rgb: false,
}

/** Normalisasi kecepatan scroll ke 0..1 (untuk distorsi shader, marquee, dll). */
export function scrollEnergy(maxPxPerFrame = 60): number {
  return Math.min(Math.abs(motion.scroll.velocity) / maxPxPerFrame, 1)
}

/** Mulai melacak pointer & scroll. Mengembalikan fungsi cleanup. */
export function startMotionTracking(): () => void {
  const onPointerMove = (event: PointerEvent) => {
    const { pointer } = motion
    pointer.x = event.clientX
    pointer.y = event.clientY
    pointer.nx = (event.clientX / window.innerWidth) * 2 - 1
    pointer.ny = -((event.clientY / window.innerHeight) * 2 - 1)
  }

  let lastY = window.scrollY
  let limit = 1
  const measure = () => {
    limit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  }
  measure()

  const onTick = () => {
    const { scroll } = motion
    const y = window.scrollY
    const raw = (y - lastY) / Math.max(gsap.ticker.deltaRatio(60), 0.001)
    lastY = y
    scroll.velocity += (raw - scroll.velocity) * 0.18
    if (Math.abs(scroll.velocity) < 0.01) scroll.velocity = 0
    if (raw !== 0) scroll.direction = raw > 0 ? 1 : -1
    scroll.y = y
    scroll.progress = Math.min(1, Math.max(0, y / limit))
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('resize', measure)
  ScrollTrigger.addEventListener('refresh', measure)
  gsap.ticker.add(onTick)

  return () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', measure)
    ScrollTrigger.removeEventListener('refresh', measure)
    gsap.ticker.remove(onTick)
  }
}
