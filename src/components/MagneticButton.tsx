import { useRef, type MouseEvent, type ReactNode } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import { cn } from '../lib/cn'

type Variant = 'acid' | 'outline' | 'ink'
type Size = 'sm' | 'md' | 'xl'

type Props = {
  children: ReactNode
  href?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
  variant?: Variant
  size?: Size
  className?: string
  /** Label cursor kustom saat hover (mis. "PLAY"). */
  cursor?: string
  ariaLabel?: string
}

const variants: Record<Variant, string> = {
  acid: 'bg-acid text-ink',
  outline: 'border border-bone/30 text-bone',
  ink: 'bg-ink text-acid',
}

const fills: Record<Variant, string> = {
  acid: 'bg-bone',
  outline: 'bg-acid',
  ink: 'bg-ink-3',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-[0.7rem]',
  md: 'h-13 px-7 text-xs',
  xl: 'size-44 justify-center rounded-full px-6 text-center text-sm md:size-56',
}

/** Tombol/tautan dengan efek magnet + isi yang bergerak sedikit lebih jauh. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'acid',
  size = 'md',
  className,
  cursor,
  ariaLabel,
}: Props) {
  const areaRef = useRef<HTMLSpanElement>(null)
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  useMagnetic(areaRef, href ? anchorRef : buttonRef, { innerRef })

  const classes = cn(
    'group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full font-mono font-bold uppercase tracking-[0.14em] transition-colors duration-300',
    variant === 'outline' && 'hover:text-ink',
    variants[variant],
    sizes[size],
    className,
  )

  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 -z-10 translate-y-full rounded-[inherit] transition-transform duration-500 ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0',
          fills[variant],
        )}
      />
      <span ref={innerRef} className="relative inline-flex items-center gap-3">
        {children}
      </span>
    </>
  )

  return (
    <span ref={areaRef} className="-m-4 inline-block p-4">
      {href ? (
        <a
          ref={anchorRef}
          href={href}
          onClick={onClick}
          className={classes}
          data-cursor={cursor}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          onClick={onClick}
          className={classes}
          data-cursor={cursor}
          aria-label={ariaLabel}
        >
          {content}
        </button>
      )}
    </span>
  )
}
