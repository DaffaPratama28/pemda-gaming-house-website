import { useRef } from 'react'
import { CountUp } from '../components/CountUp'
import { STATS } from '../data/content'
import { gsap, MEDIA, useGSAP } from '../lib/gsap'

/** Statistik "resmi": blok lime penuh yang terbuka seperti jendela saat di-scroll. */
export function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        gsap.fromTo(
          panelRef.current,
          { clipPath: 'inset(10% 5% 10% 5% round 40px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 95%',
              end: 'top 25%',
              scrub: 0.6,
            },
          },
        )
        gsap.from('[data-stat]', {
          y: 50,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-stat-grid]', start: 'top 80%' },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="stats"
      aria-labelledby="stats-title"
      data-cursor-theme="dark"
      className="relative"
    >
      <div ref={panelRef} className="bg-acid text-ink">
        <div className="gutter-x py-[14vh] md:py-[18vh]">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="hud">Stats // Musim ini</p>
              <h2 id="stats-title" className="display-tight mt-4 text-[clamp(3.6rem,10vw,9.5rem)]">
                Statistik resmi*
              </h2>
            </div>
            <p className="hud max-w-xs text-ink/70">
              *Resmi menurut kami sendiri. Diaudit oleh: tidak ada.
            </p>
          </div>

          <ul
            data-stat-grid
            className="mt-14 grid gap-px overflow-hidden rounded-xl bg-ink/15 sm:grid-cols-2 lg:grid-cols-3"
          >
            {STATS.map((stat) => (
              <li key={stat.label} data-stat className="bg-acid p-6 md:p-8">
                <p className="display-tight text-[clamp(3.6rem,7.5vw,7rem)] leading-none tabular-nums">
                  <CountUp value={stat.value} from={stat.from} suffix={stat.suffix} />
                </p>
                <p className="hud mt-4 font-bold">{stat.label}</p>
                <p className="mt-1 text-sm text-ink/70">{stat.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
