import { useRef } from 'react'
import { CountUp } from '../components/CountUp'
import { Radar } from '../components/Radar'
import { HOUSE, SITE } from '../data/content'
import { useClock } from '../hooks/useClock'
import { formatTimeParts } from '../lib/clock'
import { EASE, gsap, MEDIA, useGSAP } from '../lib/gsap'

const DAY_MS = 86_400_000

/** Status markas berdasarkan jam lokal Pontianak (WIB). */
function statusFor(hour: number) {
  if (hour < 4) return 'Jam rawan "satu match lagi"'
  if (hour < 6) return 'Subuh dulu, ranked nanti'
  if (hour < 11) return 'Markas sepi, semua masih tidur'
  if (hour < 15) return 'Panas Pontianak lagi on, main di dalam'
  if (hour < 18) return 'Pemanasan, es teh sudah dipesan'
  if (hour < 22) return 'Prime time mabar'
  return 'Mode senyap: headset wajib'
}

function LocalClock() {
  const now = useClock()
  const { hours, minutes, seconds } = formatTimeParts(now, SITE.timeZone)

  return (
    <div>
      <p className="hud text-smoke">Waktu markas · WIB (UTC+7)</p>
      <p className="display-tight mt-2 text-[clamp(3.2rem,5.4vw,5.2rem)] whitespace-nowrap text-bone tabular-nums">
        <time dateTime={`${hours}:${minutes}:${seconds}`}>
          {hours}
          <span className="animate-blink">:</span>
          {minutes}
          <span className="text-acid">:{seconds}</span>
        </time>
      </p>
      <p className="mt-2 flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-acid uppercase">
        <span className="size-1.5 animate-blink rounded-full bg-acid" />
        {statusFor(Number(hours))}
      </p>
    </div>
  )
}

function DaysTogether() {
  const now = useClock()
  const founded = Date.parse(`${SITE.foundedOn}T00:00:00+07:00`)
  const days = Number.isNaN(founded) ? 0 : Math.max(0, Math.floor((now - founded) / DAY_MS))

  return (
    <div>
      <p className="hud text-smoke">Hari tongkrongan</p>
      <p className="display-tight mt-2 text-[clamp(3.2rem,5.4vw,5.2rem)] text-acid">
        <CountUp value={days} />
      </p>
      <p className="mt-1 text-sm text-bone/60">
        Dan ndak ada satu pun yang ingat siapa yang mulai.
      </p>
    </div>
  )
}

/** The House: markas di Komplek Pemda Jalur 1 dengan radar, jam realtime, dan fakta lucu. */
export function TheHouse() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        gsap.from('[data-house-reveal]', {
          y: 70,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1.1,
          ease: EASE.out,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        })
        gsap.fromTo(
          '[data-house-radar]',
          { rotate: -12, scale: 0.85, autoAlpha: 0 },
          {
            rotate: 0,
            scale: 1,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-house-radar]',
              start: 'top 90%',
              end: 'top 40%',
              scrub: 0.8,
            },
          },
        )
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="markas"
      aria-labelledby="markas-title"
      className="gutter-x relative overflow-hidden py-[16vh] md:py-[20vh]"
    >
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 opacity-60 [--grid-size:4.5rem] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
      />
      <div className="relative grid gap-16 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="space-y-10">
          <div data-house-reveal>
            <p className="hud text-acid">The House // Markas besar</p>
            <h2 id="markas-title" className="display-tight mt-4 text-[clamp(4rem,10vw,9rem)]">
              {HOUSE.title[0]}
              <br />
              <span className="text-outline [--outline-color:var(--color-acid)]">
                {HOUSE.title[1]}
              </span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-bone/75">{HOUSE.description}</p>
          </div>

          <div
            data-house-reveal
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-[auto_1fr]"
          >
            <LocalClock />
            <DaysTogether />
          </div>

          <dl
            data-house-reveal
            className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line"
          >
            {HOUSE.facts.map((fact) => (
              <div key={fact.label} className="bg-ink p-4">
                <dt className="hud text-smoke">{fact.label}</dt>
                <dd className="mt-1 text-sm text-bone">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-house-radar className="pb-10">
          <Radar />
        </div>
      </div>
    </section>
  )
}
