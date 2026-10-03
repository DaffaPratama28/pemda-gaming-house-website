import { useRef } from 'react'
import { gsap, MEDIA, useGSAP } from '../lib/gsap'

type Props = {
  value: number
  /** Nilai awal animasi (lebih besar dari `value` = hitung mundur). */
  from?: number
  suffix?: string
  className?: string
}

const formatter = new Intl.NumberFormat('id-ID')
const format = (value: number, suffix = '') => `${formatter.format(Math.round(value))}${suffix}`

/** Angka yang menghitung naik/turun sekali saat masuk viewport. Nilai final selalu di DOM. */
export function CountUp({ value, from = 0, suffix = '', className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const element = ref.current
      if (!element) return
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        const counter = { current: from }
        element.textContent = format(from, suffix)
        gsap.to(counter, {
          current: value,
          duration: 2.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
          onUpdate: () => {
            element.textContent = format(counter.current, suffix)
          },
        })
        return () => {
          element.textContent = format(value, suffix)
        }
      })
    },
    { dependencies: [value, from, suffix] },
  )

  return (
    <>
      <span ref={ref} aria-hidden="true" className={className}>
        {format(value, suffix)}
      </span>
      <span className="sr-only">{format(value, suffix)}</span>
    </>
  )
}
