import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)
gsap.defaults({ ease: 'power4.out', duration: 1 })
ScrollTrigger.config({ ignoreMobileResize: true })

/** Easing konsisten di seluruh situs (padanan CSS: --ease-out-expo / --ease-in-out-expo). */
export const EASE = {
  out: 'power4.out',
  inOut: 'expo.inOut',
} as const

/** Breakpoint & preferensi yang dipakai `gsap.matchMedia()`. */
export const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 768px)',
  mobile: '(max-width: 767px)',
} as const

export { gsap, ScrollTrigger, useGSAP }
