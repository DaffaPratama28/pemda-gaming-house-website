import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { CanvasBoundary } from '../components/CanvasBoundary'
import { GAMES } from '../data/content'
import { useGraphics } from '../hooks/useGraphics'
import { useInView } from '../hooks/useInView'
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { EASE, gsap, MEDIA, useGSAP } from '../lib/gsap'
import { motion } from '../lib/motion'

const ArsenalPreview = lazy(() => import('../three/ArsenalPreview'))

/** Arsenal: daftar game besar; hover memunculkan aset 3D yang mengikuti kursor. */
export function Arsenal() {
  const sectionRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const graphics = useGraphics()
  const finePointer = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const near = useInView(sectionRef, { rootMargin: '80% 0px', once: true })
  const inView = useInView(sectionRef)
  const [failed, setFailed] = useState(false)
  const preview = graphics.webgl && finePointer && !reduced && !failed

  const handleFail = useCallback(() => setFailed(true), [])

  // Jendela preview mengikuti pointer dengan lerp, muncul hanya saat ada baris aktif.
  useEffect(() => {
    const section = sectionRef.current
    const box = previewRef.current
    if (!section || !box || !preview) return
    const xTo = gsap.quickTo(box, 'x', { duration: 0.55, ease: 'power3' })
    const yTo = gsap.quickTo(box, 'y', { duration: 0.55, ease: 'power3' })
    const onMove = (event: PointerEvent) => {
      xTo(event.clientX)
      yTo(event.clientY)
    }
    section.addEventListener('pointermove', onMove)
    return () => {
      section.removeEventListener('pointermove', onMove)
      motion.arsenal.active = -1
    }
  }, [preview])

  const activate = useCallback(
    (index: number) => {
      motion.arsenal.active = index
      const box = previewRef.current
      if (!box || !preview) return
      gsap.to(box, {
        scale: index >= 0 ? 1 : 0.4,
        autoAlpha: index >= 0 ? 1 : 0,
        duration: 0.5,
        ease: EASE.out,
        overwrite: 'auto',
      })
    },
    [preview],
  )

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        gsap.from('[data-game-row]', {
          yPercent: 60,
          autoAlpha: 0,
          stagger: 0.07,
          duration: 1.1,
          ease: EASE.out,
          scrollTrigger: { trigger: '[data-game-list]', start: 'top 82%' },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="arsenal"
      aria-labelledby="arsenal-title"
      className="gutter-x relative py-[16vh] md:py-[20vh]"
    >
      <header className="mb-10 grid gap-6 md:mb-16 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="hud text-acid">Arsenal // Loadout harian</p>
          <h2 id="arsenal-title" className="display-tight mt-4 text-[clamp(4rem,11vw,10rem)]">
            Arsenal
          </h2>
        </div>
        <p className="max-w-sm text-bone/70">
          Game yang paling sering bikin kami lupa waktu, lupa makan, dan lupa kalau besok sekolah.
          Hover untuk inspeksi.
        </p>
      </header>

      <ul data-game-list className="border-t border-line" onPointerLeave={() => activate(-1)}>
        {GAMES.map((game, index) => (
          <li
            key={game.title}
            data-game-row
            data-cursor="PLAY"
            onPointerEnter={() => activate(index)}
            className="group relative overflow-hidden border-b border-line"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-acid transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
            />
            <div className="relative grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 py-5 transition-colors duration-300 group-hover:text-ink md:grid-cols-[4rem_1fr_11rem_minmax(0,19rem)] md:items-center md:py-6">
              <span className="hud text-smoke group-hover:text-ink/60">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="display-tight text-[clamp(2.3rem,6vw,6rem)] transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
                {game.title}
              </h3>
              <span className="hud col-start-2 text-acid group-hover:text-ink md:col-start-auto">
                {game.genre}
              </span>
              <p className="col-start-2 text-sm text-bone/65 group-hover:text-ink/80 md:col-start-auto">
                {game.quip}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {preview && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[60] -mt-32 -ml-32 size-64"
          style={{ opacity: 0, visibility: 'hidden', transform: 'scale(0.4)' }}
        >
          {near && (
            <CanvasBoundary onError={handleFail}>
              <Suspense fallback={null}>
                <ArsenalPreview active={inView} />
              </Suspense>
            </CanvasBoundary>
          )}
        </div>
      )}
    </section>
  )
}
