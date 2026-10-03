import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { ArrowUpRight, Discord, Heart, Instagram, TikTok, YouTube } from '../components/Icons'
import { MagneticButton } from '../components/MagneticButton'
import { FOOTER, SITE } from '../data/content'
import { showToast } from '../lib/easterEgg'
import { gsap, MEDIA, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/smoothScroll'

const YEAR = new Date().getFullYear()

const SOCIAL_ICONS: Record<string, ReactNode> = {
  Instagram: <Instagram className="size-5" />,
  TikTok: <TikTok className="size-5" />,
  YouTube: <YouTube className="size-5" />,
  Discord: <Discord className="size-5" />,
}

type Ticket = { number: number; eta: string }

/** Footer CTA: teks raksasa, tombol magnetik "ambil nomor antrian", sosial, kredit. */
export function FooterCta() {
  const footerRef = useRef<HTMLElement>(null)
  const [ticket, setTicket] = useState<Ticket | null>(null)

  const takeTicket = () => {
    const number = 1000 + Math.floor(Math.random() * 9000)
    const eta = FOOTER.etas[Math.floor(Math.random() * FOOTER.etas.length)] ?? 'secepatnya'
    setTicket({ number, eta })
    showToast(`Nomor antrian #${number} tercatat (di hati)`)
  }

  const onSocial = (event: MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    if (href !== '#') return
    event.preventDefault()
    showToast(`Akun ${label} menyusul. Sabar, admin lagi ranked.`)
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motion, () => {
        gsap.from('[data-footer-inner]', {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'top 25%',
            scrub: true,
          },
        })
        gsap.from('[data-footer-line]', {
          yPercent: 100,
          stagger: 0.1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: '[data-footer-title]', start: 'top 80%' },
        })
      })
    },
    { scope: footerRef },
  )

  return (
    <footer
      ref={footerRef}
      id="join"
      aria-labelledby="join-title"
      className="relative overflow-hidden bg-ink"
    >
      <div data-footer-inner className="gutter-x relative pt-[16vh] pb-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[20%] left-1/2 size-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(198_255_61/0.12),transparent_60%)]"
        />
        <p className="hud relative text-acid">Join the house // Rekrutmen musim depan</p>
        <h2
          id="join-title"
          data-footer-title
          className="display-tight relative mt-6 text-[clamp(4.2rem,16.5vw,17rem)] leading-[0.82]"
        >
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-footer-line className="block">
              {FOOTER.headline[0]}
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span
              data-footer-line
              className="text-outline block [--outline-color:var(--color-acid)] [--outline-width:2px]"
            >
              {FOOTER.headline[1]}
            </span>
          </span>
        </h2>

        <div className="relative mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="max-w-md leading-relaxed text-bone/75">{FOOTER.sub}</p>
            <div aria-live="polite" className="mt-8 min-h-[5.5rem]">
              {ticket && (
                <div
                  key={ticket.number}
                  className="toast-in inline-flex overflow-hidden rounded-lg border border-acid/40 bg-ink-2"
                >
                  <div className="bg-acid px-5 py-4 text-ink">
                    <p className="hud">No. antrian</p>
                    <p className="display-tight text-5xl">#{ticket.number}</p>
                  </div>
                  <div className="flex flex-col justify-center px-5 py-4">
                    <p className="hud text-smoke">Estimasi dipanggil</p>
                    <p className="mt-1 font-mono text-sm tracking-[0.06em] text-bone uppercase">
                      {ticket.eta}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <MagneticButton size="xl" onClick={takeTicket} cursor="AMBIL">
            {FOOTER.cta}
          </MagneticButton>
        </div>

        <div className="relative mt-[10vh] grid gap-8 border-t border-line pt-8 md:grid-cols-3 md:items-center">
          <nav aria-label="Sosial media">
            <ul className="flex gap-3">
              {FOOTER.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    onClick={(event) => onSocial(event, social.href, social.label)}
                    aria-label={social.label}
                    className="grid size-11 place-items-center rounded-full border border-line text-bone transition-colors duration-300 hover:border-acid hover:text-acid"
                  >
                    {SOCIAL_ICONS[social.label] ?? <ArrowUpRight className="size-5" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="hud text-smoke md:text-center">
            {SITE.location} · {SITE.city}, {SITE.province}
          </p>
          <p className="hud flex items-center gap-1.5 text-smoke md:justify-end">
            © {YEAR} {SITE.name} · Made with
            <Heart className="size-3.5 text-acid" />
            <span className="sr-only">cinta</span>
            in {SITE.city}
          </p>
        </div>

        <div className="hud relative mt-8 flex flex-wrap justify-between gap-4 text-smoke">
          <span>Psst… coba klik logo 5x.</span>
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="text-bone transition-colors hover:text-acid"
          >
            Kembali ke atas ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
