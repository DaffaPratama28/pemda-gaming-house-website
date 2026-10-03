import { useRef } from 'react'
import { CroppedPhoto } from '../components/CroppedPhoto'
import { ArrowRight } from '../components/Icons'
import { PlaceholderAvatar, PlaceholderLabels } from '../components/PlaceholderAvatar'
import { StatBar } from '../components/StatBar'
import { MEMBERS, type Member } from '../data/content'
import { useTilt } from '../hooks/useTilt'
import { EASE, gsap, MEDIA, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/smoothScroll'

const MEDIA_ASPECT = 1

/** Kartu anggota: media (foto/placeholder), identitas, stat bar, game favorit. */
function MemberCard({ member }: { member: Member }) {
  const tiltRef = useRef<HTMLDivElement>(null)
  useTilt(tiltRef, { max: 7 })

  return (
    <article
      data-member-card
      aria-labelledby={`member-${member.id}`}
      className="w-[min(82vw,21rem,40svh)] shrink-0 [perspective:1000px]"
    >
      <div
        ref={tiltRef}
        className="relative overflow-hidden rounded-[1.1rem] border border-bone/15 bg-ink-2 [transform-style:preserve-3d]"
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: MEDIA_ASPECT }}>
          {member.photo ? (
            <CroppedPhoto
              photo={member.photo}
              aspect={MEDIA_ASPECT}
              className="h-full w-full"
              banner={
                <span className="hud flex w-full justify-between px-4 text-bone">
                  <span className="text-acid">
                    P{member.number} · {member.name}
                  </span>
                  <span>Verified player</span>
                </span>
              }
            />
          ) : (
            <>
              <div data-member-parallax className="absolute inset-0 scale-[1.1]">
                <PlaceholderAvatar
                  name={member.name}
                  accent={member.accent}
                  initialSize="11rem"
                  labels={false}
                />
              </div>
              <PlaceholderLabels />
            </>
          )}
          {!member.photo && (
            <span
              aria-hidden="true"
              className="display-tight absolute bottom-3 left-4 text-5xl text-bone/90 mix-blend-difference"
            >
              {member.number}
            </span>
          )}
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="hud text-smoke">Player {member.number}/05</span>
            <span
              className="hud rounded-full border px-2.5 py-1"
              style={{ color: member.accent, borderColor: `${member.accent}59` }}
            >
              {member.role}
            </span>
          </div>
          <div>
            <h3
              id={`member-${member.id}`}
              className="display-tight text-[clamp(2.6rem,5vw,3.4rem)] text-bone"
            >
              {member.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-bone/70">{member.tagline}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-5 gap-y-3">
            {member.stats.map((stat) => (
              <StatBar
                key={stat.label}
                label={stat.label}
                value={stat.value}
                accent={member.accent}
              />
            ))}
          </dl>
          <p className="hud flex justify-between gap-3 border-t border-line pt-3 text-smoke">
            <span>Main</span>
            <span className="text-right text-bone">{member.game}</span>
          </p>
        </div>
        <span aria-hidden="true" className="tilt-glare pointer-events-none absolute inset-0" />
      </div>
    </article>
  )
}

/** Squad: section di-pin dengan scroll horizontal ala layar "player select". */
export function Squad() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const pin = pinRef.current
      const track = trackRef.current
      if (!pin || !track) return
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
        const cards = gsap.utils.toArray<HTMLElement>('[data-member-card]')

        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const index = Math.min(
                MEMBERS.length,
                Math.max(1, Math.round(self.progress * (MEMBERS.length + 1))),
              )
              if (counterRef.current) {
                counterRef.current.textContent = String(index).padStart(2, '0')
              }
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
            },
          },
        })

        cards.forEach((card) => {
          gsap.fromTo(
            card.querySelectorAll('.stat-fill'),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              stagger: 0.08,
              ease: EASE.out,
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontal,
                start: 'left 88%',
                toggleActions: 'play none none reverse',
              },
            },
          )
          const media = card.querySelector('[data-member-parallax]')
          if (media) {
            gsap.fromTo(
              media,
              { xPercent: 5 },
              {
                xPercent: -5,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontal,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              },
            )
          }
        })

        gsap.from('[data-squad-intro] > *', {
          y: 80,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1.1,
          ease: EASE.out,
          scrollTrigger: { trigger: pin, start: 'top 75%' },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="squad" aria-labelledby="squad-title" className="relative">
      <div
        ref={pinRef}
        className="relative flex h-svh flex-col justify-center overflow-hidden motion-reduce:h-auto motion-reduce:py-24"
      >
        <div
          aria-hidden="true"
          className="bg-grid pointer-events-none absolute inset-0 opacity-40 [--grid-size:5rem]"
        />
        <div className="hud gutter-x absolute inset-x-0 top-20 flex justify-between text-smoke motion-reduce:static motion-reduce:mb-10 md:top-24">
          <span>Player select // Season 01</span>
          <span className="hidden sm:block">Scroll untuk memilih ↓</span>
        </div>

        <div
          ref={trackRef}
          className="relative flex w-max items-center gap-[clamp(1.25rem,3vw,3rem)] px-[max(1rem,4.5vw)] will-change-transform motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center"
        >
          <div data-squad-intro className="w-[min(84vw,34rem)] shrink-0 pr-[4vw]">
            <p className="hud text-acid">05 players · 01 colokan</p>
            <h2 id="squad-title" className="display-tight mt-4 text-[clamp(4.5rem,13vw,11rem)]">
              The <span className="text-acid">Squad</span>
            </h2>
            <p className="mt-6 max-w-sm text-bone/70">
              Lima pemain, lima role, satu tujuan: menang. Atau minimal ndak kalah memalukan. Pilih
              jagoanmu (spoiler: semuanya jago, menurut pengakuan masing-masing).
            </p>
          </div>

          {MEMBERS.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}

          <div className="flex w-[min(80vw,26rem)] shrink-0 flex-col items-start gap-6 pl-[2vw]">
            <p className="display-tight text-[clamp(3.5rem,8vw,7rem)] text-outline">Mabar?</p>
            <p className="max-w-xs text-bone/70">
              Lima sudah penuh. Tapi kursi cadangan selalu ada, asal bawa camilan.
            </p>
            <a
              href="#join"
              onClick={(event) => {
                event.preventDefault()
                scrollToTarget('#join')
              }}
              className="hud group flex items-center gap-3 text-acid"
              data-cursor="JOIN"
            >
              Ambil nomor antrian
              <ArrowRight className="size-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-2" />
            </a>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="gutter-x absolute inset-x-0 bottom-6 flex items-center gap-5 motion-reduce:hidden md:bottom-9"
        >
          <span className="hud text-bone">
            Player <span ref={counterRef}>01</span>/05
          </span>
          <span className="relative h-px flex-1 bg-bone/15">
            <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-acid" />
          </span>
        </div>
      </div>
    </section>
  )
}
