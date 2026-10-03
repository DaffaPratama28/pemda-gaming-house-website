import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { motion } from '../lib/motion'

/** Bar progres tipis di atas + penunjuk persen ala HUD di pojok kanan bawah. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let last = -1
    const tick = () => {
      const progress = motion.scroll.progress
      if (Math.abs(progress - last) < 0.0005) return
      last = progress
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
      const label = labelRef.current
      if (label) {
        label.textContent = String(Math.round(progress * 100)).padStart(3, '0')
        // Di hero sudah ada indikator scroll sendiri.
        label.parentElement?.classList.toggle(
          'opacity-0',
          motion.scroll.y < window.innerHeight * 0.6,
        )
      }
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <>
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[95] h-0.5 bg-bone/10">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-acid" />
      </div>
      <div
        aria-hidden="true"
        className="hud pointer-events-none fixed top-1/2 right-3 z-[70] hidden -translate-y-1/2 text-bone opacity-0 mix-blend-difference transition-opacity duration-500 [writing-mode:vertical-rl] md:block"
      >
        Scroll <span ref={labelRef}>000</span>%
      </div>
    </>
  )
}
