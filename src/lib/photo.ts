import type { CSSProperties } from 'react'
import type { Photo } from '../data/content'

/** Persegi crop ternormalisasi (0..1), origin kiri-atas foto. */
export type CropRect = { x: number; y: number; w: number; h: number }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Hitung crop untuk frame dengan rasio `aspect` (lebar / tinggi).
 * Tinggi crop dipertahankan (rambut sampai dagu tetap utuh), lebar menyesuaikan.
 */
export function cropRect(photo: Photo, aspect: number): CropRect {
  const { top, height, centerX } = photo.crop
  let h = height
  let w = (h * photo.height * aspect) / photo.width
  if (w > 1) {
    w = 1
    h = photo.width / aspect / photo.height
  }
  return {
    x: clamp(centerX - w / 2, 0, 1 - w),
    y: clamp(top, 0, 1 - h),
    w,
    h,
  }
}

/** Style `<img>` absolut yang menghasilkan crop di atas di dalam frame `overflow: hidden`. */
export function cropStyle(photo: Photo, aspect: number): CSSProperties {
  const { x, y, w, h } = cropRect(photo, aspect)
  return {
    position: 'absolute',
    left: `${(-x / w) * 100}%`,
    top: `${(-y / h) * 100}%`,
    width: `${100 / w}%`,
    height: `${100 / h}%`,
    maxWidth: 'none',
  }
}

/** Rasio kartu pemain (hero, squad) = 3:4. */
export const CARD_ASPECT = 3 / 4

/** Rasio frame spotlight & galeri = 4:5. */
export const PORTRAIT_ASPECT = 4 / 5
