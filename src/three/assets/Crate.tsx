import { useMemo } from 'react'
import { MeshStandardMaterial } from 'three'
import { materials } from '../materials'
import { crateTexture } from '../textures'

type Vec3 = [number, number, number]

/** 12 rusuk rangka peti. */
const EDGES: Array<{ position: Vec3; size: Vec3 }> = [-0.5, 0.5].flatMap((a) =>
  [-0.5, 0.5].flatMap((b) => [
    { position: [0, a, b] as Vec3, size: [1.08, 0.1, 0.1] as Vec3 },
    { position: [a, 0, b] as Vec3, size: [0.1, 1.08, 0.1] as Vec3 },
    { position: [a, b, 0] as Vec3, size: [0.1, 0.1, 1.08] as Vec3 },
  ]),
)

let panelMaterial: MeshStandardMaterial | null = null

function getPanelMaterial() {
  panelMaterial ??= new MeshStandardMaterial({
    map: crateTexture(),
    roughness: 0.55,
    metalness: 0.35,
  })
  return panelMaterial
}

/** Peti loot battle royale dengan pita hazard. */
export function Crate() {
  const panel = useMemo(() => getPanelMaterial(), [])
  return (
    <group>
      <mesh material={panel}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      {EDGES.map((edge) => (
        <mesh key={edge.position.join(',')} material={materials.matte} position={edge.position}>
          <boxGeometry args={edge.size} />
        </mesh>
      ))}
      <mesh material={materials.neonPapaya} position={[0, 0.56, 0]}>
        <boxGeometry args={[0.5, 0.03, 0.08]} />
      </mesh>
    </group>
  )
}
