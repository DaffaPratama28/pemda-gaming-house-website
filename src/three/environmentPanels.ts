/**
 * Konfigurasi environment studio (dipakai halaman generator `scripts/bake-environment.html`).
 * Ubah panel di sini → jalankan generator → timpa `src/three/studio-env.png`.
 */

export type EnvironmentPanel = {
  form: 'rect' | 'ring'
  color: string
  intensity: number
  position: [number, number, number]
  scale: [number, number]
}

/** Panel cahaya virtual (ala Lightformer): key light putih + rim neon brand. */
export const ENV_PANELS: EnvironmentPanel[] = [
  { form: 'rect', color: '#ffffff', intensity: 2.4, position: [0, 5, 6], scale: [12, 4] },
  { form: 'ring', color: '#c6ff3d', intensity: 5, position: [-7, 1, 2], scale: [5, 5] },
  { form: 'rect', color: '#ff7a1a', intensity: 3.5, position: [7, -2, 1], scale: [3, 8] },
  { form: 'rect', color: '#3de0ff', intensity: 1.2, position: [0, -6, -3], scale: [10, 2] },
]

export const ENV_BACKGROUND = '#0c0c0e'

/** Ukuran cubemap PMREM (PNG hasil = 3·size × 4·size). */
export const ENV_SIZE = 256

/**
 * Radiance HDR disimpan sebagai (nilai / ENV_SCALE) ber-encode sRGB di PNG 8-bit,
 * lalu dipulihkan lewat `scene.environmentIntensity = ENV_SCALE` saat runtime.
 */
export const ENV_SCALE = 8
