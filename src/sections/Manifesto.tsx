import { Fragment, useRef } from 'react'
import { RotatingBadge } from '../components/RotatingBadge'
import { MANIFESTO, MANIFESTO_FACTS } from '../data/content'
import { EASE, gsap, MEDIA, useGSAP } from '../lib/gsap'

type Token = { text: string; highlight: boolean; space: boolean }

/**
 * Pecah teks manifesto per kata; bagian `**...**` ditandai sebagai sorotan.
 * Spasi asli dipertahankan, jadi tanda baca setelah sorotan tetap menempel.
 */
function tokenize(text: string): Token[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .flatMap((part) => {
      const highlight = part.startsWith('**') && part.endsWith('**')
      const clean = highlight ? part.slice(2, -2) : part
      return clean
        .split(/(\s+)/)
        .filter(Boolean)
        .map((chunk) => ({ text: chunk, highlight, space: /^\s+$/.test(chunk) }))
    })
}

const TOKENS = tokenize(MANIFESTO)

/** Manifesto: kata-kata menyala bertahap mengikuti scroll (scrubbed reveal). */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        gsap.fromTo(
          '[data-word]',
          // 0.38 = kontras ≥ 3:1 (WCAG AA teks besar) bahkan sebelum kata menyala.
          { opacity: 0.38 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: {
              trigger: '[data-manifesto-text]',
              start: 'top 80%',
              end: 'bottom 55%',
              scrub: 0.6,
            },
          },
        )
        gsap.from('[data-manifesto-fact]', {
          y: 60,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: EASE.out,
          scrollTrigger: { trigger: '[data-manifesto-facts]', start: 'top 88%' },
        })
        gsap.to('[data-manifesto-index]', {
          yPercent: -45,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      aria-labelledby="manifesto-title"
      className="gutter-x relative overflow-hidden py-[16vh] md:py-[22vh]"
    >
      <span
        data-manifesto-index
        aria-hidden="true"
        className="display-tight text-outline pointer-events-none absolute top-[8%] -right-[3vw] text-[36vw] leading-none opacity-[0.07]"
      >
        01
      </span>

      <div className="relative mb-10 flex flex-wrap items-center justify-between gap-4 md:mb-16">
        <h2 id="manifesto-title" className="hud flex items-center gap-3 text-acid">
          <span className="h-px w-10 bg-acid" />
          Manifesto // 001
        </h2>
        <span className="hud text-smoke">Bacanya pelan-pelan, sambil minum es teh</span>
      </div>

      <p
        data-manifesto-text
        className="relative max-w-[62rem] text-[clamp(1.9rem,4.3vw,4.4rem)] leading-[1.06] font-medium tracking-[-0.035em] text-bone"
      >
        {TOKENS.map((token, index) =>
          token.space ? (
            <Fragment key={index}> </Fragment>
          ) : (
            <span key={index} data-word className={token.highlight ? 'text-acid' : undefined}>
              {token.text}
            </span>
          ),
        )}
      </p>

      <div className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-[1fr_auto] md:items-end">
        <dl data-manifesto-facts className="grid max-w-xl grid-cols-3 gap-4 md:gap-8">
          {MANIFESTO_FACTS.map((fact) => (
            <div
              key={fact.label}
              data-manifesto-fact
              className="flex flex-col-reverse gap-2 border-t border-line pt-4"
            >
              <dt className="hud text-smoke">{fact.label}</dt>
              <dd className="display-tight text-[clamp(2.6rem,6vw,5rem)] text-bone">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
        <RotatingBadge
          text="Pemda Gaming House • Jalur 1 • Pontianak • "
          className="size-32 md:size-40"
        />
      </div>
    </section>
  )
}
