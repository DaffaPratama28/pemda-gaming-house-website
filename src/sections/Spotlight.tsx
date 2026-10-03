import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { CanvasBoundary } from '../components/CanvasBoundary'
import { CroppedPhoto } from '../components/CroppedPhoto'
import { HudCorners } from '../components/HudCorners'
import { RIDHO_PHOTO, RIDHO_PROFILE } from '../data/content'
import { useGraphics } from '../hooks/useGraphics'
import { useInView } from '../hooks/useInView'
import { useIsDesktop, usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { cn } from '../lib/cn'
import { gsap, MEDIA, useGSAP } from '../lib/gsap'
import { motion } from '../lib/motion'
import { PORTRAIT_ASPECT } from '../lib/photo'

const SpotlightScene = lazy(() => import('../three/SpotlightScene'))

/**
 * Spotlight Ridho: stage di-pin (desktop) dengan parallax berlapis:
 * teks outline raksasa (belakang) → foto (tengah, reveal shader) → objek 3D (depan).
 */
export function Spotlight() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const graphics = useGraphics()
  const isDesktop = useIsDesktop()
  const reduced = usePrefersReducedMotion()
  const near = useInView(sectionRef, { rootMargin: '120% 0px', once: true })
  const inView = useInView(stageRef)
  const [glReady, setGlReady] = useState(false)
  const [glFailed, setGlFailed] = useState(false)
  const webgl = graphics.webgl && !glFailed && isDesktop && !reduced

  const handleReady = useCallback(() => setGlReady(true), [])
  const handleFail = useCallback(() => setGlFailed(true), [])

  useGSAP(
    () => {
      const stage = stageRef.current
      if (!stage) return
      const mm = gsap.matchMedia()

      mm.add(MEDIA.reduce, () => {
        motion.spotlight.reveal = 1
      })

      mm.add(`${MEDIA.motion} and ${MEDIA.desktop}`, () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: '+=160%',
              pin: true,
              scrub: 0.6,
              onUpdate: (self) => {
                motion.spotlight.progress = self.progress
              },
            },
          })
          .fromTo(
            stage,
            { clipPath: 'inset(9% 7% 9% 7% round 28px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.22 },
            0,
          )
          .fromTo('[data-spot-row="a"]', { xPercent: 0 }, { xPercent: -38, duration: 1 }, 0)
          .fromTo('[data-spot-row="b"]', { xPercent: -38 }, { xPercent: 0, duration: 1 }, 0)
          .fromTo(motion.spotlight, { reveal: 0 }, { reveal: 1, duration: 0.32 }, 0.1)
          .fromTo(
            '[data-spot-dom-photo]',
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.32 },
            0.1,
          )
          .from('[data-spot-copy] > *', { y: 60, autoAlpha: 0, stagger: 0.03, duration: 0.18 }, 0.3)
          .from('[data-spot-callout]', { x: 50, autoAlpha: 0, stagger: 0.05, duration: 0.14 }, 0.42)
          .from('[data-spot-line]', { scaleX: 0, stagger: 0.05, duration: 0.14 }, 0.42)
        return () => {
          motion.spotlight.progress = 0
          motion.spotlight.reveal = 0
        }
      })

      mm.add(`${MEDIA.motion} and ${MEDIA.mobile}`, () => {
        motion.spotlight.reveal = 1
        gsap.fromTo(
          '[data-spot-dom-photo]',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-spot-photo]',
              start: 'top 90%',
              end: 'top 40%',
              scrub: 0.6,
            },
          },
        )
        gsap.fromTo(
          '[data-spot-row="a"]',
          { xPercent: 0 },
          {
            xPercent: -30,
            ease: 'none',
            scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.fromTo(
          '[data-spot-row="b"]',
          { xPercent: -30 },
          {
            xPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.from('[data-spot-callout]', {
          y: 30,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.9,
          scrollTrigger: { trigger: '[data-spot-callouts]', start: 'top 88%' },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="ridho" aria-labelledby="ridho-title" className="relative bg-ink">
      <div ref={stageRef} className="relative overflow-hidden bg-ink-2 md:h-svh">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-[3vh] overflow-hidden"
        >
          <p
            data-spot-row="a"
            className="display-tight text-outline text-[26vw] leading-[0.8] whitespace-nowrap opacity-50 [--outline-color:rgb(198_255_61/0.5)] md:opacity-100"
          >
            Ridho Ridho Ridho
          </p>
          <p
            data-spot-row="b"
            className="display-tight text-[26vw] leading-[0.8] whitespace-nowrap text-ink-3"
          >
            Carry Carry Carry
          </p>
        </div>

        <div className="gutter-x relative z-30 grid gap-10 py-24 md:h-full md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-[4vw] md:py-0">
          <div data-spot-copy className="order-2 md:order-1 md:self-end md:pb-[11vh]">
            <p className="hud text-acid">Spotlight // Player 02</p>
            <h2 id="ridho-title" className="display-tight mt-3 text-[clamp(4rem,8.5vw,8rem)]">
              Ridho
            </h2>
            <p className="hud mt-3 text-bone">
              {RIDHO_PROFILE.role} · Rank {RIDHO_PROFILE.rank} · LV.{RIDHO_PROFILE.level}
            </p>
            <p className="mt-6 max-w-sm leading-relaxed text-bone/75">{RIDHO_PROFILE.bio}</p>
            <blockquote className="mt-8 max-w-sm border-l-2 border-acid pl-4">
              <p className="display-tight text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none text-bone">
                &ldquo;{RIDHO_PROFILE.quote}&rdquo;
              </p>
              <footer className="hud mt-3 text-smoke">Ridho, lima detik sebelum kalah</footer>
            </blockquote>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <div
              ref={photoRef}
              data-spot-photo
              data-cursor="VIEW"
              className="relative w-[min(80vw,26rem)] md:w-[min(30vw,46svh)]"
              style={{ aspectRatio: PORTRAIT_ASPECT }}
            >
              <div
                data-spot-dom-photo
                className={cn(
                  'relative h-full transition-opacity duration-700',
                  glReady && 'opacity-0',
                )}
              >
                <CroppedPhoto
                  photo={RIDHO_PHOTO}
                  aspect={PORTRAIT_ASPECT}
                  className="h-full rounded-[1.1rem]"
                  banner={
                    <span className="hud flex w-full justify-between px-4 text-bone">
                      <span>Ridho</span>
                      <span className="text-acid">P02</span>
                    </span>
                  }
                />
                <HudCorners className="m-3" />
              </div>
            </div>
          </div>

          <ul
            data-spot-callouts
            aria-label="Statistik Ridho (versi dia sendiri)"
            className="order-3 grid grid-cols-2 gap-5 md:block md:space-y-6 md:self-start md:pt-[18vh]"
          >
            {RIDHO_PROFILE.callouts.map((callout) => (
              <li key={callout.label} data-spot-callout className="flex items-center gap-4">
                <span
                  data-spot-line
                  aria-hidden="true"
                  className="hidden h-px w-14 shrink-0 origin-left bg-acid md:block"
                />
                <div>
                  <p className="hud text-acid">{callout.label}</p>
                  <p className="mt-1 font-mono text-[0.78rem] tracking-[0.06em] text-bone uppercase">
                    {callout.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {webgl && near && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-700"
            style={{ opacity: glReady ? 1 : 0 }}
          >
            <CanvasBoundary onError={handleFail}>
              <Suspense fallback={null}>
                <SpotlightScene
                  photoRef={photoRef}
                  active={inView}
                  quality={graphics.quality}
                  onReady={handleReady}
                />
              </Suspense>
            </CanvasBoundary>
          </div>
        )}
      </div>
    </section>
  )
}
