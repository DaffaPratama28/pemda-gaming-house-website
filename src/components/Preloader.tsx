import { useEffect, useRef, useState } from 'react'
import { PRELOADER_TIPS, RIDHO_PHOTO, SITE } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { EASE, gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { completeTask, getLoadProgress } from '../lib/loader'
import { setScrollLocked } from '../lib/smoothScroll'

/** Durasi minimum (detik) agar counter sempat "bercerita"; maksimum sebagai jaring pengaman. */
const MIN_DURATION = 1.5
const MAX_DURATION = 6

type Props = {
  /** Dipanggil saat wipe dimulai, supaya intro hero berjalan bersamaan. */
  onComplete: () => void
}

/** Loading screen ala game: counter 000-100 yang mengikuti progres asli, lalu wipe ke hero. */
export function Preloader({ onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)
  const [tip, setTip] = useState(0)
  const [done, setDone] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Tugas loading nyata: font utama + foto Ridho.
  useEffect(() => {
    completeTask('boot')
    Promise.all([
      document.fonts.load('400 1em Anton'),
      document.fonts.load('500 1em "Space Grotesk Variable"'),
      document.fonts.load('500 1em "JetBrains Mono Variable"'),
    ])
      .catch(() => undefined)
      .finally(() => completeTask('fonts'))

    const image = new Image()
    image.src = RIDHO_PHOTO.src
    image
      .decode()
      .catch(() => undefined)
      .finally(() => completeTask('photo'))
  }, [])

  useEffect(() => {
    if (done) return
    const id = window.setInterval(
      () => setTip((value) => (value + 1) % PRELOADER_TIPS.length),
      1500,
    )
    return () => window.clearInterval(id)
  }, [done])

  useGSAP(
    () => {
      const root = rootRef.current
      const content = contentRef.current
      const counter = counterRef.current
      const bar = barRef.current
      if (!root || !content || !counter || !bar) return

      const start = performance.now()
      const minDuration = reduced ? 0.3 : MIN_DURATION
      const state = { value: 0 }
      let exiting = false

      const finish = () => {
        document.documentElement.classList.remove('is-loading')
        setScrollLocked(false)
        ScrollTrigger.refresh()
        onCompleteRef.current()
      }

      const exit = () => {
        gsap.ticker.remove(tick)
        if (reduced) {
          gsap.to(root, {
            autoAlpha: 0,
            duration: 0.35,
            ease: 'none',
            onComplete: () => {
              finish()
              setDone(true)
            },
          })
          return
        }
        gsap
          .timeline({ onComplete: () => setDone(true) })
          .to(content, { yPercent: -10, autoAlpha: 0, duration: 0.55, ease: 'power3.in' })
          .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.15, ease: EASE.inOut }, '-=0.1')
          .add(finish, '-=0.85')
      }

      const tick = () => {
        const elapsed = (performance.now() - start) / 1000
        const timeCap = Math.min(1, elapsed / minDuration)
        const target = elapsed > MAX_DURATION ? 1 : Math.min(getLoadProgress(), timeCap)
        state.value += (target - state.value) * 0.1
        if (target === 1 && state.value > 0.995) state.value = 1

        const percent = Math.round(state.value * 100)
        counter.textContent = String(percent).padStart(3, '0')
        bar.style.transform = `scaleX(${state.value})`
        root.setAttribute('aria-valuenow', String(percent))

        if (state.value === 1 && !exiting) {
          exiting = true
          exit()
        }
      }

      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: rootRef, dependencies: [reduced] },
  )

  if (done) return null

  return (
    <div
      ref={rootRef}
      role="progressbar"
      aria-label="Memuat PEMDA GAMING HOUSE"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="fixed inset-0 z-[100] flex flex-col bg-ink text-bone"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-40 [--grid-size:5rem]" />
      <div
        ref={contentRef}
        className="gutter-x relative flex flex-1 flex-col justify-between py-6 md:py-9"
      >
        <div className="hud flex justify-between gap-4 text-smoke">
          <span>PGH // Boot sequence</span>
          <span className="text-right">
            {SITE.location}, {SITE.city}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="hud mb-2 flex items-center gap-2 text-acid">
              <span className="size-1.5 animate-blink rounded-full bg-acid" />
              Loading Pemda Gaming House…
            </p>
            <span
              ref={counterRef}
              className="display-tight block text-[clamp(7rem,29vw,24rem)] tabular-nums"
            >
              000
            </span>
          </div>
          <span className="display-tight pb-[0.12em] text-[clamp(3rem,9vw,8rem)] text-acid">%</span>
        </div>

        <div>
          <div className="h-[3px] w-full bg-bone/10">
            <div ref={barRef} className="h-full origin-left scale-x-0 bg-acid" />
          </div>
          <p className="mt-4 min-h-[2.5em] max-w-2xl font-mono text-[0.72rem] leading-relaxed tracking-[0.08em] text-bone/80 uppercase">
            <span className="text-acid">Tips:</span> {PRELOADER_TIPS[tip]}
          </p>
        </div>
      </div>
    </div>
  )
}
