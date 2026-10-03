import { useEffect, useId, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { cn } from '../lib/cn'
import { gsap } from '../lib/gsap'
import { motion } from '../lib/motion'

type Props = {
  text: string
  className?: string
}

/** Stempel teks melingkar yang berputar pelan dan makin cepat saat di-scroll. */
export function RotatingBadge({ text, className }: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const pathId = useId()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const svg = ref.current
    if (!svg || reduced) return
    let rotation = 0
    const tick = (_time: number, deltaTime: number) => {
      rotation += (deltaTime / 1000) * (14 + Math.abs(motion.scroll.velocity) * 4)
      svg.style.transform = `rotate(${rotation % 360}deg)`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [reduced])

  return (
    <svg ref={ref} viewBox="0 0 200 200" aria-hidden="true" className={cn('size-36', className)}>
      <defs>
        <path id={pathId} d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" />
      </defs>
      <circle cx="100" cy="100" r="98" fill="none" stroke="var(--color-line)" />
      <text className="fill-bone font-mono text-[13px] font-medium tracking-[0.32em] uppercase">
        <textPath href={`#${pathId}`}>{text}</textPath>
      </text>
      <circle cx="100" cy="100" r="22" fill="var(--color-acid)" />
      <path
        d="M100 84v32M84 100h32"
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
