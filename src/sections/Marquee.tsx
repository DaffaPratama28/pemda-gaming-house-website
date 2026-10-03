import { useEffect, useRef } from 'react'
import { Sparkle } from '../components/Icons'
import { MARQUEE } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { cn } from '../lib/cn'
import { gsap } from '../lib/gsap'
import { motion } from '../lib/motion'

type RowProps = {
  items: readonly string[]
  /** 1 = bergerak ke kiri, -1 = ke kanan. */
  direction: 1 | -1
  /** Kecepatan dasar (px per frame @60fps). */
  speed: number
  variant: 'acid' | 'ink'
}

/**
 * Satu pita marquee tak berujung. Kecepatan bertambah mengikuti velocity scroll
 * dan arahnya berbalik saat pengguna scroll ke atas.
 */
function MarqueeRow({ items, direction, speed, variant }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const row = rowRef.current
    const track = trackRef.current
    const unit = track?.firstElementChild
    if (!row || !track || !(unit instanceof HTMLElement) || reduced) return

    let width = unit.offsetWidth
    let offset = 0
    let visible = false
    const resize = new ResizeObserver(() => {
      width = unit.offsetWidth
    })
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
    })
    resize.observe(unit)
    observer.observe(row)

    const tick = (_time: number, deltaTime: number) => {
      if (!visible || width === 0) return
      const velocity = motion.scroll.velocity
      const flip = velocity < -0.4 ? -1 : 1
      const boost = Math.min(Math.abs(velocity) * 0.8, 28)
      offset += (speed + boost) * direction * flip * (deltaTime / 16.67)
      offset = ((offset % width) + width) % width
      track.style.transform = `translate3d(${-offset}px, 0, 0)`
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      resize.disconnect()
      observer.disconnect()
    }
  }, [direction, speed, reduced])

  const unitItems = [...items, ...items]

  return (
    <div
      ref={rowRef}
      className={cn(
        'overflow-hidden border-y py-3 md:py-4',
        variant === 'acid' ? 'border-ink bg-acid text-ink' : 'border-line bg-ink text-bone',
      )}
    >
      <p className="sr-only">{items.join(', ')}</p>
      <div ref={trackRef} aria-hidden="true" className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {unitItems.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-center">
                <span
                  className={cn(
                    'display-tight px-[2.2vw] text-[clamp(2.6rem,7.5vw,7rem)] leading-[0.95] whitespace-nowrap',
                    variant === 'ink' && index % 2 === 1 && 'text-outline',
                  )}
                >
                  {item}
                </span>
                <Sparkle
                  className={cn(
                    'size-[clamp(1.1rem,2.4vw,2.2rem)] shrink-0',
                    variant === 'acid' ? 'text-ink' : 'text-acid',
                  )}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

/** Dua pita marquee bersilang: roster & semboyan. */
export function Marquee() {
  return (
    <section
      aria-label="Roster dan semboyan PEMDA GAMING HOUSE"
      className="relative overflow-hidden py-[9vh] md:py-[13vh]"
    >
      <div className="relative z-10 -mx-[2vw] -rotate-[2.5deg]">
        <MarqueeRow items={MARQUEE.roster} direction={1} speed={1.4} variant="acid" />
      </div>
      <div className="-mx-[2vw] -mt-[1.2vw] rotate-[1.8deg]">
        <MarqueeRow items={MARQUEE.slogans} direction={-1} speed={1} variant="ink" />
      </div>
    </section>
  )
}
