import { useRef, type MouseEvent, type ReactNode } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import { cn } from '../lib/cn'

type Size = 'sm' | 'xl'

type Props = {
  children: ReactNode
  href?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
  size?: Size
  /** Label cursor kustom saat hover (mis. "JOIN"). */
  cursor?: string
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-[0.7rem]',
  xl: 'size-44 justify-center rounded-full px-6 text-center text-sm md:size-56',
}

/** Tombol/tautan lime dengan efek magnet + isi yang bergerak sedikit lebih jauh. */
export function MagneticButton({ children, href, onClick, size = 'sm', cursor }: Props) {
  const areaRef = useRef<HTMLSpanElement>(null)
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  useMagnetic(areaRef, href ? anchorRef : buttonRef, innerRef)

  const classes = cn(
    'group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full bg-acid font-mono font-bold tracking-[0.14em] text-ink uppercase',
    sizes[size],
  )

  const content = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 translate-y-full rounded-[inherit] bg-bone transition-transform duration-500 ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0"
      />
      <span ref={innerRef} className="relative inline-flex items-center gap-3">
        {children}
      </span>
    </>
  )

  return (
    <span ref={areaRef} className="-m-4 inline-block p-4">
      {href ? (
        <a ref={anchorRef} href={href} onClick={onClick} className={classes} data-cursor={cursor}>
          {content}
        </a>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          onClick={onClick}
          className={classes}
          data-cursor={cursor}
        >
          {content}
        </button>
      )}
    </span>
  )
}
