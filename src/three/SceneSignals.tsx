import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { motion } from '../lib/motion'
import { NEON_MATERIALS } from './materials'

/** Memanggil `onReady` sekali, pada frame pertama setelah semua aset scene selesai dimuat. */
export function ReadySignal({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false)
  useFrame(() => {
    if (fired.current) return
    fired.current = true
    onReady?.()
  })
  return null
}

const baseColors = NEON_MATERIALS.map((material) => material.color.clone())
let rgbActive = false

/** Easter egg: material neon berputar hue selama RGB mode aktif, lalu kembali normal. */
export function RgbModeDriver() {
  useFrame((state) => {
    if (motion.rgb) {
      rgbActive = true
      const time = state.clock.elapsedTime
      NEON_MATERIALS.forEach((material, index) => {
        const hue = (time * 0.35 + index * 0.2) % 1
        material.color.setHSL(hue, 1, 0.55)
        material.emissive.setHSL(hue, 1, 0.55)
      })
    } else if (rgbActive) {
      rgbActive = false
      NEON_MATERIALS.forEach((material, index) => {
        const base = baseColors[index]
        if (!base) return
        material.color.copy(base)
        material.emissive.copy(base)
      })
    }
  })
  return null
}
