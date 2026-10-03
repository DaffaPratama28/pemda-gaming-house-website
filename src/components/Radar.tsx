import { HOUSE, SITE } from '../data/content'
import { cn } from '../lib/cn'

/** Durasi satu putaran sweep (detik), harus sama dengan `.radar-sweep` di effects.css. */
const SWEEP_SECONDS = 4.8

/** Sudut (derajat, 0 = utara, searah jarum jam) titik pada kotak radar 0..100. */
function bearing(x: number, y: number) {
  const degrees = (Math.atan2(x - 50, -(y - 50)) * 180) / Math.PI
  return (degrees + 360) % 360
}

const TICKS = Array.from({ length: 36 }, (_, index) => index * 10)

/** Radar HUD bergaya peta: ilustrasi, bukan peta sungguhan. */
export function Radar() {
  return (
    <figure className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <svg viewBox="0 0 400 400" aria-hidden="true" className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(198 255 61 / 0.12)" />
            <stop offset="70%" stopColor="rgb(198 255 61 / 0.03)" />
            <stop offset="100%" stopColor="rgb(198 255 61 / 0)" />
          </radialGradient>
          <clipPath id="radar-clip">
            <circle cx="200" cy="200" r="194" />
          </clipPath>
        </defs>
        <circle
          cx="200"
          cy="200"
          r="196"
          fill="url(#radar-fill)"
          stroke="rgb(242 239 230 / 0.18)"
        />
        <g clipPath="url(#radar-clip)">
          <path
            d="M-20 262C70 236 128 300 214 276S352 206 430 236"
            fill="none"
            stroke="rgb(61 224 255 / 0.28)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="186"
            x2="400"
            y2="186"
            stroke="var(--color-acid)"
            strokeDasharray="6 7"
            opacity="0.7"
          />
        </g>
        {[48, 96, 144].map((radius) => (
          <circle
            key={radius}
            cx="200"
            cy="200"
            r={radius}
            fill="none"
            stroke="rgb(198 255 61 / 0.2)"
          />
        ))}
        <path d="M200 6V394M6 200H394" stroke="rgb(242 239 230 / 0.12)" />
        {TICKS.map((angle) => (
          <line
            key={angle}
            x1="200"
            y1={angle % 90 === 0 ? 4 : 8}
            x2="200"
            y2="16"
            stroke="rgb(242 239 230 / 0.4)"
            transform={`rotate(${angle} 200 200)`}
          />
        ))}
        <g className="fill-bone font-mono text-[11px] tracking-[0.2em]" opacity="0.75">
          <text x="200" y="34" textAnchor="middle">
            N
          </text>
          <text x="372" y="204" textAnchor="middle">
            E
          </text>
          <text x="200" y="378" textAnchor="middle">
            S
          </text>
          <text x="28" y="204" textAnchor="middle">
            W
          </text>
        </g>
        <text x="60" y="178" className="fill-acid font-mono text-[10px] tracking-[0.16em]">
          0°00&apos; KHATULISTIWA
        </text>
        <text
          x="250"
          y="300"
          className="font-mono text-[10px] tracking-[0.16em]"
          fill="rgb(61 224 255 / 0.8)"
        >
          S. KAPUAS
        </text>
      </svg>

      <div aria-hidden="true" className="radar-sweep absolute inset-[2%] rounded-full" />

      {HOUSE.blips.map((blip) => (
        <div
          key={blip.label}
          aria-hidden="true"
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
          style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
        >
          <span
            className={cn(
              'radar-blip block size-2.5 rounded-full',
              blip.tone === 'papaya' ? 'bg-papaya' : 'bg-bone',
            )}
            style={{ animationDelay: `${(bearing(blip.x, blip.y) / 360) * SWEEP_SECONDS}s` }}
          />
          <span className="hud text-[0.6rem] whitespace-nowrap text-bone/70">{blip.label}</span>
        </div>
      ))}

      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="relative grid size-5 place-items-center">
          <span className="absolute inset-0 animate-ping-slow rounded-full bg-acid" />
          <span className="relative size-3.5 rounded-full bg-acid shadow-[0_0_24px_rgb(198_255_61/0.9)]" />
        </span>
        <span className="hud mt-2 rounded-sm bg-acid px-1.5 py-0.5 text-[0.6rem] font-bold text-ink">
          Markas
        </span>
      </div>

      <figcaption className="hud absolute inset-x-0 -bottom-8 text-center text-[0.6rem] text-smoke">
        Ilustrasi, bukan peta asli · {SITE.coords.lat} {SITE.coords.lng}
      </figcaption>
    </figure>
  )
}
