import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { NAV_LINKS } from '../data/content'
import { cn } from '../lib/cn'
import { activateRgbMode, createClickCounter } from '../lib/easterEgg'
import { gsap } from '../lib/gsap'
import { motion } from '../lib/motion'
import { scrollToTarget } from '../lib/smoothScroll'
import { MagneticButton } from './MagneticButton'
import { MobileMenu } from './MobileMenu'

/** Logo kecil: crosshair dalam kotak (selaras dengan favicon). */
function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7">
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="16" cy="16" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 5v5M16 22v5M5 16h5M22 16h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  )
}

/**
 * Navbar minimal: wordmark + link (blend difference agar terbaca di atas warna apa pun),
 * tombol JOIN magnetik, menu fullscreen di mobile. Sembunyi saat scroll turun.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const [onLogoClick] = useState(() => createClickCounter(5, 2500, activateRgbMode))

  useEffect(() => {
    const root = document.documentElement
    let hidden = false
    const tick = () => {
      const { y, velocity } = motion.scroll
      let next = hidden
      if (y < 140 || root.dataset.menu === 'open') next = false
      else if (velocity > 1.5) next = true
      else if (velocity < -1.5) next = false
      if (next !== hidden) {
        hidden = next
        root.dataset.nav = hidden ? 'hidden' : 'visible'
      }
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      delete root.dataset.nav
    }
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const navigate = useCallback((event: MouseEvent<HTMLElement>, id: string) => {
    event.preventDefault()
    setMenuOpen(false)
    scrollToTarget(`#${id}`)
  }, [])

  const hideOnScroll =
    'transition-transform duration-700 ease-out-expo in-data-[nav=hidden]:-translate-y-[130%]'

  return (
    <>
      <header
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-[80] text-bone mix-blend-difference',
          hideOnScroll,
        )}
      >
        <div className="gutter-x flex h-18 items-center justify-between md:h-22">
          <button
            type="button"
            onClick={() => {
              onLogoClick()
              scrollToTarget(0)
            }}
            aria-label="PEMDA GAMING HOUSE: kembali ke atas"
            className="pointer-events-auto flex items-center gap-2.5"
          >
            <LogoMark />
            <span className="display-tight text-[1.65rem] leading-none">
              PEMDA<span className="opacity-60">/</span>GH
            </span>
          </button>

          <nav aria-label="Navigasi utama" className="pointer-events-auto hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(event) => navigate(event, link.id)}
                    className="group hud relative block overflow-hidden"
                  >
                    <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
                    >
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            ref={burgerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            className="pointer-events-auto relative flex size-11 items-center justify-center lg:hidden"
          >
            <span
              className={cn(
                'absolute h-0.5 w-7 bg-current transition-transform duration-500 ease-out-expo',
                menuOpen ? 'rotate-45' : '-translate-y-1.5',
              )}
            />
            <span
              className={cn(
                'absolute h-0.5 w-7 bg-current transition-transform duration-500 ease-out-expo',
                menuOpen ? '-rotate-45' : 'translate-y-1.5',
              )}
            />
          </button>
        </div>
      </header>

      {/* Tombol JOIN di luar header agar warnanya tidak ikut blend difference. */}
      <div
        className={cn(
          'fixed top-0 right-0 z-[81] hidden h-22 items-center pr-[max(1rem,4.5vw)] lg:flex',
          hideOnScroll,
        )}
      >
        <MagneticButton
          href="#join"
          size="sm"
          cursor="JOIN"
          onClick={(event) => navigate(event, 'join')}
        >
          Join the house
          <span className="size-1.5 rounded-full bg-ink" />
        </MagneticButton>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        onNavigate={navigate}
        returnFocusRef={burgerRef}
      />
    </>
  )
}
