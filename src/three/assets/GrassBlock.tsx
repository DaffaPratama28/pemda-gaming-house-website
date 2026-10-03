import { useMemo } from 'react'
import { MeshStandardMaterial } from 'three'
import { pixelTexture } from '../textures'

let blockMaterials: MeshStandardMaterial[] | null = null

function getBlockMaterials() {
  if (!blockMaterials) {
    const make = (kind: Parameters<typeof pixelTexture>[0]) =>
      new MeshStandardMaterial({ map: pixelTexture(kind), roughness: 0.9, metalness: 0 })
    const side = make('grass-side')
    // Urutan muka BoxGeometry: +x, -x, +y, -y, +z, -z
    blockMaterials = [side, side, make('grass-top'), make('dirt'), side, side]
  }
  return blockMaterials
}

/** Blok tanah berumput ala sandbox, pixel art 16x16 prosedural. */
export function GrassBlock() {
  const faces = useMemo(() => getBlockMaterials(), [])
  return (
    <mesh material={faces}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  )
}
