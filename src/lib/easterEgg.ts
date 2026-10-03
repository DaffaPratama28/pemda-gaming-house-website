import { motion } from './motion'

export const TOAST_EVENT = 'pgh:toast'

export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }))
}

let rgbTimer = 0

/** Easter egg: aksen neon berputar warna (CSS + material 3D) selama beberapa detik. */
export function activateRgbMode(durationMs = 9000) {
  const root = document.documentElement
  root.classList.add('rgb-mode')
  motion.rgb = true
  showToast('RGB MODE ON: +30 FPS (secara spiritual)')
  window.clearTimeout(rgbTimer)
  rgbTimer = window.setTimeout(() => {
    root.classList.remove('rgb-mode')
    motion.rgb = false
  }, durationMs)
}

/** Memanggil `onTrigger` setelah `count` klik dalam rentang `windowMs`. */
export function createClickCounter(count: number, windowMs: number, onTrigger: () => void) {
  let clicks: number[] = []
  return () => {
    const now = performance.now()
    clicks = clicks.filter((time) => now - time < windowMs)
    clicks.push(now)
    if (clicks.length >= count) {
      clicks = []
      onTrigger()
    }
  }
}
