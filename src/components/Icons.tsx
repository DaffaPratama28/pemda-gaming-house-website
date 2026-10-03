import type { ReactNode } from 'react'
import type { GalleryItem } from '../data/content'

type IconProps = { className?: string }

function Svg({
  className,
  children,
  filled = false,
}: IconProps & { children: ReactNode; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  )
}

export const ArrowUpRight = (props: IconProps) => (
  <Svg {...props}>
    <path d="M7 17 17 7M9 7h8v8" />
  </Svg>
)

export const ArrowDown = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </Svg>
)

export const ArrowRight = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
)

export const Crosshair = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="6.5" />
    <path d="M12 2v5M12 17v5M2 12h5M17 12h5" />
  </Svg>
)

export const Sparkle = (props: IconProps) => (
  <Svg {...props} filled>
    <path d="M12 1.5 14.2 9.8 22.5 12l-8.3 2.2L12 22.5l-2.2-8.3L1.5 12l8.3-2.2Z" />
  </Svg>
)

export const Heart = (props: IconProps) => (
  <Svg {...props} filled>
    <path d="M12 20.5s-7.5-4.6-7.5-10.4A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.8c0 5.8-7.5 10.4-7.5 10.4Z" />
  </Svg>
)

export const Instagram = (props: IconProps) => (
  <Svg {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
)

export const TikTok = (props: IconProps) => (
  <Svg {...props}>
    <path d="M14 3v11.6a3.6 3.6 0 1 1-3.6-3.6" />
    <path d="M14 3c.6 2.9 2.4 4.5 5.2 4.7" />
  </Svg>
)

export const YouTube = (props: IconProps) => (
  <Svg {...props}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10 9.4 5 2.6-5 2.6Z" fill="currentColor" />
  </Svg>
)

export const Discord = (props: IconProps) => (
  <Svg {...props}>
    <path d="M7.2 7.4a15 15 0 0 1 9.6 0c1.7 2.6 2.5 5.4 2.3 8.5a12 12 0 0 1-4.8 2.3l-.9-1.6M7.2 7.4C5.5 10 4.7 12.8 4.9 15.9a12 12 0 0 0 4.8 2.3l.9-1.6" />
    <circle cx="9.6" cy="12.6" r="1.2" />
    <circle cx="14.4" cy="12.6" r="1.2" />
  </Svg>
)

const galleryIcons: Record<GalleryItem['icon'], ReactNode> = {
  controller: (
    <>
      <path d="M6.5 8.5h11a4 4 0 0 1 3.9 4.8l-.8 3.7a2.3 2.3 0 0 1-4 1L14.8 16H9.2l-1.8 2a2.3 2.3 0 0 1-4-1l-.8-3.7a4 4 0 0 1 3.9-4.8Z" />
      <path d="M8 11v3.5M6.25 12.75h3.5" />
      <circle cx="15.6" cy="11.6" r="0.6" fill="currentColor" />
      <circle cx="17.6" cy="13.6" r="0.6" fill="currentColor" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 3.5h8V9a4 4 0 0 1-8 0Z" />
      <path d="M8 5.5H5a3 3 0 0 0 3 4.5M16 5.5h3a3 3 0 0 1-3 4.5M12 13v4M8.5 20.5h7M10 17h4" />
    </>
  ),
  coffee: (
    <>
      <path d="M4.5 8.5h11v5.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5Z" />
      <path d="M15.5 10H17a2.5 2.5 0 0 1 0 5h-1.5M8 3v2.5M11 3v2.5M14 3v2.5" />
    </>
  ),
  bolt: <path d="M13 2.5 5 14h6l-1 7.5L18 10h-6Z" />,
  camera: (
    <>
      <path d="M3.5 8h3.2l1.8-2.8h7l1.8 2.8h3.2v11h-17Z" />
      <circle cx="12" cy="13" r="3.4" />
    </>
  ),
  moon: <path d="M19.5 14.6A7.8 7.8 0 0 1 9.4 4.5a7.8 7.8 0 1 0 10.1 10.1Z" />,
}

export function GalleryIcon({ name, className }: IconProps & { name: GalleryItem['icon'] }) {
  return <Svg className={className}>{galleryIcons[name]}</Svg>
}
