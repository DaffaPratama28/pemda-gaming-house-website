import { cn } from '../lib/cn'

type Props = {
  className?: string
}

const corners = [
  'left-0 top-0 border-l-2 border-t-2',
  'right-0 top-0 border-r-2 border-t-2',
  'left-0 bottom-0 border-l-2 border-b-2',
  'right-0 bottom-0 border-r-2 border-b-2',
]

/** Siku HUD di keempat sudut frame. */
export function HudCorners({ className }: Props) {
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      {corners.map((position) => (
        <span key={position} className={cn('absolute size-4 border-acid', position)} />
      ))}
    </span>
  )
}
