import { useEffect, useRef, type MouseEvent, type RefObject } from 'react'
import { NAV_LINKS, SITE } from '../data/content'
import { EASE, gsap, useGSAP } from '../lib/gsap'
import { setScrollLocked } from '../lib/smoothScroll'

type Props = {
  open: boolean
  onClose: () => void
  onNavigate: (event: MouseEvent<HTMLElement>, id: string) => void
  /** Fokus dikembalikan ke tombol ini saat menu ditutup. */
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

const LINKS = [...NAV_LINKS, { id: 'join', label: 'Join the house' }]

/** Menu fullscreen mobile: wipe dari atas, link raksasa bertahap, Esc untuk menutup. */
export function MobileMenu({ open, onClose, onNavigate, returnFocusRef }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const links = root.querySelectorAll('[data-menu-link]')
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (open) {
        gsap
          .timeline()
          .set(root, { visibility: 'visible' })
          .to(root, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: reduce ? 0 : 0.9,
            ease: EASE.inOut,
          })
          .fromTo(
            links,
            { yPercent: 110 },
            { yPercent: 0, duration: reduce ? 0 : 0.9, stagger: 0.05, ease: EASE.out },
            '-=0.45',
          )
      } else {
        gsap
          .timeline()
          .to(root, {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: reduce ? 0 : 0.7,
            ease: EASE.inOut,
          })
          .set(root, { visibility: 'hidden' })
      }
    },
    { dependencies: [open], scope: rootRef },
  )

  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const background = [document.getElementById('main'), document.getElementById('join')]
    html.dataset.menu = 'open'
    setScrollLocked(true)
    background.forEach((element) => element?.setAttribute('inert', ''))
    rootRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const focusTarget = returnFocusRef.current

    return () => {
      delete html.dataset.menu
      setScrollLocked(false)
      background.forEach((element) => element?.removeAttribute('inert'))
      window.removeEventListener('keydown', onKey)
      focusTarget?.focus({ preventScroll: true })
    }
  }, [open, onClose, returnFocusRef])

  return (
    <div
      ref={rootRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu navigasi"
      className="fixed inset-0 z-[75] flex flex-col justify-between bg-ink pt-24 pb-8 lg:hidden"
      style={{ visibility: 'hidden', clipPath: 'inset(0% 0% 100% 0%)' }}
    >
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-30 [--grid-size:4rem]" />
      <nav aria-label="Navigasi mobile" className="gutter-x relative">
        <ul>
          {LINKS.map((link, index) => (
            <li key={link.id} className="overflow-hidden border-b border-line">
              <a
                data-menu-link
                href={`#${link.id}`}
                onClick={(event) => onNavigate(event, link.id)}
                className="flex items-baseline gap-4 py-2"
              >
                <span className="hud text-acid">{String(index + 1).padStart(2, '0')}</span>
                <span className="display-tight text-[clamp(2.6rem,12vw,5rem)] text-bone">
                  {link.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="gutter-x hud relative flex justify-between text-smoke">
        <span>{SITE.location}</span>
        <span>{SITE.city}</span>
      </div>
    </div>
  )
}
