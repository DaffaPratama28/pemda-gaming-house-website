import { RoundedBox } from '@react-three/drei'
import { useMemo } from 'react'
import { MeshBasicMaterial } from 'three'
import { COLORS, materials } from '../materials'
import { glyphTexture } from '../textures'

export type KeycapTone = 'dark' | 'acid' | 'bone'

const legendCache = new Map<string, MeshBasicMaterial>()

/** Legend huruf tanpa lighting: tampak seperti keycap dengan backlight RGB. */
function legendMaterial(label: string, tone: KeycapTone) {
  const key = `${label}:${tone}`
  let material = legendCache.get(key)
  if (!material) {
    material = new MeshBasicMaterial({
      map: glyphTexture(label, tone === 'dark' ? COLORS.acid : COLORS.ink),
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    })
    legendCache.set(key, material)
  }
  return material
}

const bodies = {
  dark: materials.graphite,
  acid: materials.acid,
  bone: materials.bone,
} as const

/** Keycap keyboard mekanik melayang dengan huruf menyala di permukaan atas. */
export function Keycap({ label, tone = 'dark' }: { label: string; tone?: KeycapTone }) {
  const legend = useMemo(() => legendMaterial(label, tone), [label, tone])
  return (
    <group>
      <RoundedBox args={[1, 0.6, 1]} radius={0.14} smoothness={4} material={bodies[tone]} />
      <mesh position={[0, 0.302, 0]} rotation={[-Math.PI / 2, 0, 0]} material={legend}>
        <planeGeometry args={[0.72, 0.72]} />
      </mesh>
    </group>
  )
}
