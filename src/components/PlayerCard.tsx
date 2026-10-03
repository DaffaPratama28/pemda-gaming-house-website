import type { Photo } from '../data/content'
import { cn } from '../lib/cn'
import { CARD_ASPECT } from '../lib/photo'
import { CroppedPhoto } from './CroppedPhoto'
import { HudCorners } from './HudCorners'

type Props = {
  photo: Photo
  name: string
  number: string
  role: string
  rank: string
  level: number
  className?: string
  priority?: boolean
}

/**
 * Kartu pemain versi DOM. Dipakai sebagai layout anchor + fallback untuk kartu
 * WebGL di hero (tampilan dibuat semirip mungkin dengan tekstur HUD 3D).
 */
export function PlayerCard({ photo, name, number, role, rank, level, className, priority }: Props) {
  return (
    <figure
      className={cn(
        'relative isolate overflow-hidden rounded-[1.1rem] border border-bone/20 bg-ink-2 shadow-[0_40px_120px_-40px_rgb(198_255_61/0.35)]',
        className,
      )}
    >
      <CroppedPhoto
        photo={photo}
        aspect={CARD_ASPECT}
        priority={priority}
        banner={
          <div className="flex w-full items-center justify-between gap-3 px-[6%]">
            <span className="display-tight text-[clamp(1.4rem,2.6vw,2.4rem)] leading-none text-bone">
              {name}
            </span>
            <span className="text-right font-mono text-[clamp(0.5rem,0.7vw,0.62rem)] leading-tight tracking-[0.14em] uppercase">
              <span className="block text-acid">{role}</span>
              <span className="block text-bone/70">{rank}</span>
            </span>
          </div>
        }
      />
      <div
        aria-hidden="true"
        className="scanlines pointer-events-none absolute inset-0 opacity-40"
      />
      <HudCorners className="m-3" />
      <div
        aria-hidden="true"
        className="absolute top-[5%] left-[6%] bg-acid px-2 py-1 font-mono text-[clamp(0.5rem,0.75vw,0.68rem)] font-bold tracking-[0.12em] text-ink"
      >
        PLAYER {number}/05
      </div>
      <div
        aria-hidden="true"
        className="display-tight absolute top-[4.5%] right-[6%] text-[clamp(1.2rem,2.2vw,2rem)] text-bone"
      >
        LV.{level}
      </div>
      <figcaption className="sr-only">
        {name}, Player {number}, {role}, rank {rank}
      </figcaption>
    </figure>
  )
}
