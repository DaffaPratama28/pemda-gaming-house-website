import { useEffect, useRef } from 'react'
import { CroppedPhoto } from '../components/CroppedPhoto'
import { GalleryIcon } from '../components/Icons'
import { GALLERY, type GalleryItem } from '../data/content'
import { useDragScroll } from '../hooks/useDragScroll'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { EASE, gsap, MEDIA, useGSAP } from '../lib/gsap'
import { PORTRAIT_ASPECT } from '../lib/photo'

/** Kemiringan kartu (deterministik, ala foto yang ditempel asal-asalan). */
const TILTS = [-4, 3, -2.5, 4.5, -3.5, 2]

function GalleryPlaceholder({ item }: { item: GalleryItem }) {
  return (
    <div className="relative grid size-full place-items-center bg-[linear-gradient(160deg,#1c1c1c,#0b0b0b)] text-bone/80">
      <div aria-hidden="true" className="noise absolute inset-0 opacity-20 mix-blend-overlay" />
      <div aria-hidden="true" className="scanlines absolute inset-0 opacity-60" />
      <div className="relative flex flex-col items-center gap-3">
        <GalleryIcon name={item.icon} className="size-14 text-acid" />
        <span className="hud text-bone/60">Foto menyusul</span>
      </div>
    </div>
  )
}

/** Galeri: strip kartu miring yang bisa di-drag (mouse) atau di-swipe (sentuh). */
export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const reduced = usePrefersReducedMotion()
  useDragScroll(scrollerRef)

  // Kartu sedikit miring (skew) mengikuti kecepatan geser horizontal.
  useEffect(() => {
    const scroller = scrollerRef.current
    const list = listRef.current
    if (!scroller || !list || reduced) return
    let last = scroller.scrollLeft
    let skew = 0
    const tick = () => {
      const velocity = scroller.scrollLeft - last
      last = scroller.scrollLeft
      const target = Math.max(-10, Math.min(10, velocity * 0.3))
      skew += (target - skew) * 0.12
      if (Math.abs(skew) < 0.01) skew = 0
      list.style.setProperty('--drag-skew', `${skew.toFixed(2)}deg`)
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [reduced])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        gsap.from('[data-gallery-card]', {
          y: 140,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1.2,
          ease: EASE.out,
          scrollTrigger: { trigger: listRef.current, start: 'top 85%' },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="galeri"
      aria-labelledby="galeri-title"
      className="relative overflow-hidden py-[14vh] md:py-[18vh]"
    >
      <header className="gutter-x grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="hud text-acid">Galeri // Arsip momen</p>
          <h2 id="galeri-title" className="display-tight mt-4 text-[clamp(4rem,11vw,10rem)]">
            Galeri
          </h2>
        </div>
        <p className="hud max-w-xs text-smoke">
          Yang lolos sensor saja. Geser ke samping (drag kalau pakai mouse) →
        </p>
      </header>

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Galeri foto, geser ke samping"
        tabIndex={0}
        data-cursor="DRAG"
        className="no-scrollbar mt-12 overflow-x-auto overscroll-x-contain select-none data-[dragging=true]:cursor-grabbing"
      >
        <ul
          ref={listRef}
          className="flex w-max gap-[clamp(1.25rem,3vw,2.5rem)] px-[max(1rem,4.5vw)] py-12"
        >
          {GALLERY.map((item, index) => (
            <li key={item.caption} data-gallery-card className="shrink-0">
              <figure
                className="relative w-[min(68vw,19rem)] rounded-md bg-bone p-3 pb-4 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] [transform:skewX(var(--drag-skew,0deg))]"
                style={{ rotate: `${TILTS[index % TILTS.length]}deg` }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-acid/85"
                />
                <div
                  className="relative overflow-hidden rounded-sm bg-ink"
                  style={{ aspectRatio: PORTRAIT_ASPECT }}
                >
                  {item.photo ? (
                    <CroppedPhoto
                      photo={item.photo}
                      aspect={PORTRAIT_ASPECT}
                      className="size-full"
                      banner={<span className="hud px-3 text-bone">{item.date}</span>}
                    />
                  ) : (
                    <GalleryPlaceholder item={item} />
                  )}
                </div>
                <figcaption className="mt-3 flex items-end justify-between gap-3">
                  <span className="font-mono text-[0.68rem] leading-snug font-bold tracking-[0.1em] uppercase">
                    {item.caption}
                  </span>
                  <span className="hud shrink-0 text-ink/50">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
