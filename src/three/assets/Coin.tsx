import { useMemo } from 'react'
import { MeshStandardMaterial } from 'three'
import { materials } from '../materials'
import { coinFaceTexture } from '../textures'

let faceMaterial: MeshStandardMaterial | null = null

function getFaceMaterial() {
  faceMaterial ??= new MeshStandardMaterial({
    map: coinFaceTexture(),
    roughness: 0.32,
    metalness: 0.75,
  })
  return faceMaterial
}

/** Token "PGH": silinder krom dengan emblem dan ring neon. */
export function Coin() {
  const face = useMemo(() => getFaceMaterial(), [])
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={[materials.chrome, face, face]}>
        <cylinderGeometry args={[0.5, 0.5, 0.09, 48]} />
      </mesh>
      <mesh material={materials.neonAcid} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.022, 10, 64]} />
      </mesh>
    </group>
  )
}
