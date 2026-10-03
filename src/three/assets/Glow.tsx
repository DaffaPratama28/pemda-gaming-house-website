import { useMemo } from 'react'
import { AdditiveBlending } from 'three'
import { COLORS } from '../materials'
import { glowTexture } from '../textures'

type Props = {
  size?: number
  opacity?: number
  position?: [number, number, number]
}

/** Halo aditif yang selalu menghadap kamera: "fake bloom" yang murah. */
export function Glow({ size = 2, opacity = 0.35, position }: Props) {
  const map = useMemo(() => glowTexture(), [])
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial
        map={map}
        color={COLORS.acid}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  )
}
