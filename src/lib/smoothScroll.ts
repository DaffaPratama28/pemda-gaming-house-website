import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

/** Instance Lenis aktif (null saat reduced motion → scroll native). */
let lenis: Lenis | null = null

const easeInOutExpo = (t: number) =>
  t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2

/** Menyalakan smooth scroll + sinkronisasi dengan ScrollTrigger. Mengembalikan cleanup. */
export function startSmoothScroll(): () => void {
  const instance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  })

  // Preloader masih tampil: kunci scroll sampai intro selesai.
  if (document.documentElement.classList.contains('is-loading')) instance.stop()

  instance.on('scroll', ScrollTrigger.update)
  const raf = (time: number) => instance.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  lenis = instance

  return () => {
    gsap.ticker.remove(raf)
    gsap.ticker.lagSmoothing(500, 33)
    instance.destroy()
    if (lenis === instance) lenis = null
  }
}

type ScrollTarget = string | number | HTMLElement

/** Scroll halus ke target; jatuh ke scroll native bila Lenis nonaktif (reduced motion). */
export function scrollToTarget(target: ScrollTarget, options: { offset?: number } = {}) {
  if (lenis) {
    lenis.scrollTo(target, {
      offset: options.offset ?? 0,
      duration: 1.6,
      easing: easeInOutExpo,
      force: true,
    })
    return
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth'
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior })
    return
  }
  const element = typeof target === 'string' ? document.querySelector(target) : target
  element?.scrollIntoView({ behavior, block: 'start' })
}

export function setScrollLocked(locked: boolean) {
  if (locked) lenis?.stop()
  else lenis?.start()
}
