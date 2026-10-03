import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { CanvasBoundary } from '../components/CanvasBoundary'
import { PlayerCard } from '../components/PlayerCard'
import { SplitChars } from '../components/SplitChars'
import { MEMBERS, RIDHO_PHOTO, RIDHO_PROFILE, SITE } from '../data/content'
import { useGraphics } from '../hooks/useGraphics'
import { useInView } from '../hooks/useInView'
import { useTilt } from '../hooks/useTilt'
import { cn } from '../lib/cn'
import { EASE, gsap, MEDIA, useGSAP } from '../lib/gsap'
import { completeTask } from '../lib/loader'
import { motion } from '../lib/motion'
import { scrollToTarget } from '../lib/smoothScroll'

const HeroScene = lazy(() => import('../three/HeroScene'))

const ridho = MEMBERS.find((member) => member.id === 'ridho')

const TITLE_LINES = [
  { text: 'PEMDA', className: '' },
  {
    text: 'GAMING',
    className: 'text-outline [--outline-color:var(--color-acid)] [--outline-width:2px]',
  },
  { text: 'HOUSE', className: '' },
]

type Props = {
  /** True setelah preloader mulai menghilang: intro dijalankan. */
  introDone: boolean
}

export function Hero({ introDone }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const graphics = useGraphics()
  const inView = useInView(sectionRef)
  const [glReady, setGlReady] = useState(false)
  const [glFailed, setGlFailed] = useState(false)
  const webgl = graphics.webgl && !glFailed

  useTilt(tiltRef, { max: 8 })

  useEffect(() => {
    if (!graphics.webgl) completeTask('scene')
  }, [graphics.webgl])

  const handleReady = useCallback(() => {
    completeTask('scene')
    setGlReady(true)
  }, [])

  const handleFail = useCallback(() => {
    completeTask('scene')
    setGlFailed(true)
  }, [])

  // Intro setelah preloader: karakter judul naik, kartu berputar masuk, objek 3D terbang masuk.
  useGSAP(
    () => {
      if (!introDone) return
      const mm = gsap.matchMedia()
      mm.add(MEDIA.reduce, () => {
        motion.hero.intro = 1
      })
      mm.add(MEDIA.motion, () => {
        gsap
          .timeline({ defaults: { ease: EASE.out } })
          // `y: 0` wajib: GSAP membaca translate CSS awal sebagai px, bukan persen.
          .fromTo(
            '.split-char',
            { yPercent: 108, y: 0 },
            { yPercent: 0, y: 0, duration: 1.25, stagger: 0.035 },
            0,
          )
          .fromTo(
            '[data-hero-card]',
            { autoAlpha: 0, rotateY: -28, scale: 0.86 },
            { autoAlpha: 1, rotateY: 0, scale: 1, duration: 1.4 },
            0.15,
          )
          .to(motion.hero, { intro: 1, duration: 2, ease: 'power3.out' }, 0.1)
          .fromTo(
            '[data-hero-reveal]',
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 },
            0.45,
          )
      })
    },
    { scope: sectionRef, dependencies: [introDone] },
  )

  // Scroll-out: hero di-pin tanpa spacing, konten berikutnya naik menutupinya.
  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]', section)
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=100%',
              pin: true,
              pinSpacing: false,
              scrub: true,
              onUpdate: (self) => {
                motion.hero.progress = self.progress
              },
            },
          })
          .to(lines, { xPercent: (index: number) => [-14, 9, -6][index] ?? 0 }, 0)
          .to('[data-hero-title]', { yPercent: -12, opacity: 0.3 }, 0)
          .to('[data-hero-fade]', { autoAlpha: 0, y: -28 }, 0)
          .to('[data-hero-card-outer]', { yPercent: -10, scale: 0.94 }, 0)
          .to('[data-hero-shade]', { opacity: 0.85 }, 0.1)
        return () => {
          motion.hero.progress = 0
        }
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="hero-title"
      className="relative h-svh min-h-[34rem] overflow-hidden bg-ink"
    >
      {/* Latar: grid, glow, garis khatulistiwa */}
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 opacity-70 [--grid-size:6.5rem] [mask-image:radial-gradient(ellipse_at_60%_45%,black_30%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[63%] left-1/2 size-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(198_255_61/0.14),transparent_58%)] md:top-[52%] md:left-[71%] md:size-[70vw]"
      />
      <div
        aria-hidden="true"
        data-hero-fade
        className="absolute inset-x-0 top-[40%] flex items-center gap-3 md:top-[60%]"
      >
        <span className="h-px flex-1 border-t border-dashed border-acid/35" />
        <span className="hud pr-4 text-[0.6rem] text-acid/70 md:pr-[4.5vw]">
          0°00&apos; Khatulistiwa
        </span>
      </div>

      {/* Judul raksasa */}
      <h1
        id="hero-title"
        data-hero-title
        className="display-tight gutter-x absolute inset-x-0 top-[13svh] z-10 text-[min(23vw,11svh)] leading-[0.8] text-bone md:top-[18svh] md:text-[min(16.5vw,26svh)]"
      >
        {TITLE_LINES.map((line) => (
          <span key={line.text} data-hero-line className="block w-fit">
            <SplitChars text={line.text} className={line.className} />
          </span>
        ))}
      </h1>

      {/* Kartu pemain Ridho: jangkar layout + fallback DOM untuk kartu WebGL */}
      <div
        ref={cardRef}
        data-cursor="PLAY"
        className="absolute top-[64%] left-1/2 z-10 w-[min(54vw,33svh)] -translate-x-1/2 -translate-y-1/2 md:top-[52%] md:left-[71%] md:w-[min(25vw,46svh)]"
      >
        <div
          data-hero-card-outer
          className={cn('transition-opacity duration-700', glReady && 'opacity-0')}
        >
          <div data-hero-card className="[perspective:900px]">
            <div ref={tiltRef} className="[transform-style:preserve-3d]">
              <PlayerCard
                photo={RIDHO_PHOTO}
                name={ridho?.name ?? 'Ridho'}
                number={ridho?.number ?? '02'}
                role={RIDHO_PROFILE.role}
                rank={RIDHO_PROFILE.rank}
                level={RIDHO_PROFILE.level}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scene 3D (lazy). Di atas judul agar objek melayang di depan tipografi. */}
      {webgl && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-1000"
          style={{ opacity: glReady ? 1 : 0 }}
        >
          <CanvasBoundary onError={handleFail}>
            <Suspense fallback={null}>
              <HeroScene
                cardRef={cardRef}
                active={inView}
                quality={graphics.quality}
                compact={graphics.compact}
                onReady={handleReady}
              />
            </Suspense>
          </CanvasBoundary>
        </div>
      )}

      {/* HUD atas */}
      <div
        data-hero-fade
        className="hud gutter-x pointer-events-none absolute inset-x-0 top-19 z-30 flex justify-between gap-4 text-smoke md:top-24"
      >
        <span data-hero-reveal className="flex items-center gap-2">
          <span className="size-1.5 animate-blink rounded-full bg-papaya" />
          Live · {SITE.location}
        </span>
        <span data-hero-reveal className="hidden text-right sm:block">
          {SITE.city}, Kalbar · {SITE.coords.lat} {SITE.coords.lng}
        </span>
      </div>

      {/* Bawah: subjudul + indikator scroll */}
      <div
        data-hero-fade
        className="gutter-x absolute inset-x-0 bottom-5 z-30 flex items-end justify-between gap-6 md:bottom-9"
      >
        <div data-hero-reveal className="max-w-[26rem]">
          <p className="display-tight text-[clamp(1.35rem,3.2vw,2.6rem)] leading-[0.95] text-bone">
            {SITE.location},<br />
            <span className="text-acid">{SITE.city}</span>
          </p>
          <p className="mt-2 hidden text-sm text-bone/70 sm:block">
            Markas digital lima sahabat. {SITE.est}.
          </p>
        </div>

        <div data-hero-reveal className="hidden items-center gap-2 md:flex" aria-hidden="true">
          <span className="hud text-smoke">Players online</span>
          {MEMBERS.map((member) => (
            <span
              key={member.id}
              className="size-2 rounded-full"
              style={{ backgroundColor: member.accent }}
            />
          ))}
        </div>

        <a
          data-hero-reveal
          href="#manifesto"
          onClick={(event) => {
            event.preventDefault()
            scrollToTarget('#manifesto')
          }}
          className="hud flex flex-col items-center gap-3 text-bone"
          aria-label="Scroll ke manifesto"
        >
          Scroll
          <span className="relative h-14 w-px overflow-hidden bg-bone/20">
            <span className="scroll-line absolute inset-0 bg-acid" />
          </span>
        </a>
      </div>

      <div
        aria-hidden="true"
        data-hero-shade
        className="pointer-events-none absolute inset-0 z-40 bg-ink opacity-0"
      />
    </section>
  )
}
