import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { materials } from '../materials'

const SIDES = [-1, 1] as const

/** Headset gaming: bando setengah torus, earcup silinder, ring neon, dan mic boom. */
export function Headset() {
  const micCurve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-0.96, -0.28, 0.12),
        new Vector3(-0.86, -0.62, 0.42),
        new Vector3(-0.52, -0.82, 0.62),
      ]),
    [],
  )

  return (
    <group>
      <mesh material={materials.graphite}>
        <torusGeometry args={[0.9, 0.075, 16, 56, Math.PI]} />
      </mesh>
      <mesh material={materials.neonAcid} position-z={0.07}>
        <torusGeometry args={[0.9, 0.016, 8, 56, Math.PI]} />
      </mesh>
      {SIDES.map((side) => (
        <group key={side} position={[side * 0.92, -0.14, 0]}>
          <mesh material={materials.graphite} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.36, 0.36, 0.26, 36]} />
          </mesh>
          <mesh material={materials.matte} position-x={-side * 0.15} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.31, 0.33, 0.08, 36]} />
          </mesh>
          <mesh
            material={materials.neonAcid}
            position-x={side * 0.135}
            rotation={[0, Math.PI / 2, 0]}
          >
            <torusGeometry args={[0.24, 0.022, 10, 44]} />
          </mesh>
        </group>
      ))}
      <mesh material={materials.matte}>
        <tubeGeometry args={[micCurve, 32, 0.026, 8, false]} />
      </mesh>
      <mesh material={materials.neonPapaya} position={[-0.52, -0.82, 0.62]}>
        <sphereGeometry args={[0.065, 16, 16]} />
      </mesh>
    </group>
  )
}
