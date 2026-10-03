import { cn } from '../lib/cn'

type Props = {
  name: string
  accent: string
  className?: string
  /** Ukuran inisial (CSS font-size). */
  initialSize?: string
  /** Tampilkan label HUD (matikan bila induk merender label sendiri). */
  labels?: boolean
}

/** Label HUD "NO SIGNAL / FOTO MENYUSUL" di atas placeholder. */
export function PlaceholderLabels() {
  return (
    <>
      <div
        aria-hidden="true"
        className="hud absolute top-3 left-3 flex items-center gap-2 text-bone/80"
      >
        <span className="size-1.5 animate-blink rounded-full bg-papaya" />
        No signal
      </div>
      <div aria-hidden="true" className="hud absolute top-3 right-3 text-bone/50">
        Foto menyusul
      </div>
    </>
  )
}

/**
 * Placeholder anggota yang belum punya foto: inisial raksasa + gradient aksen,
 * siluet, noise, scanline, dan glitch saat hover. Sengaja tampak "by design".
 */
export function PlaceholderAvatar({
  name,
  accent,
  className,
  initialSize = '13rem',
  labels = true,
}: Props) {
  const initial = name.charAt(0).toUpperCase()

  return (
    <div
      role="img"
      aria-label={`Placeholder foto ${name}: foto menyusul`}
      className={cn('glitch-host relative h-full w-full overflow-hidden bg-ink-2', className)}
      style={{ '--accent': accent }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 75% at 18% 8%, ${accent}40, transparent 58%), radial-gradient(90% 60% at 92% 100%, ${accent}26, transparent 62%), linear-gradient(165deg, #191919, #0b0b0b 70%)`,
        }}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 200 210"
        className="absolute bottom-0 left-1/2 h-[74%] -translate-x-1/2"
        fill={`${accent}14`}
        stroke={`${accent}66`}
        strokeWidth="1.2"
        strokeDasharray="4 5"
      >
        <circle cx="100" cy="66" r="40" />
        <path d="M18 210c0-50 36-84 82-84s82 34 82 84Z" />
      </svg>
      <span
        aria-hidden="true"
        data-text={initial}
        className="glitch display-tight absolute inset-0 grid place-items-center text-bone/90"
        style={{ fontSize: initialSize, lineHeight: 1 }}
      >
        {initial}
      </span>
      <div aria-hidden="true" className="noise absolute inset-0 opacity-[0.16] mix-blend-overlay" />
      <div aria-hidden="true" className="scanlines absolute inset-0 opacity-70" />
      {labels && <PlaceholderLabels />}
    </div>
  )
}
