import { useState } from 'react'
import { detectQuality, isCompactViewport, supportsWebGL, type Quality } from '../lib/device'

export type Graphics = {
  webgl: boolean
  quality: Quality
  /** Viewport ponsel saat halaman dimuat: jumlah objek 3D dikurangi. */
  compact: boolean
}

/** Profil grafis dihitung sekali per komponen (deteksi di-cache di modul). */
export function useGraphics(): Graphics {
  const [graphics] = useState<Graphics>(() => ({
    webgl: supportsWebGL(),
    quality: detectQuality(),
    compact: isCompactViewport(),
  }))
  return graphics
}
