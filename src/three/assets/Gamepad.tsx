import { RoundedBox } from '@react-three/drei'
import { materials, type MaterialName } from '../materials'

const FACE_BUTTONS: Array<{ x: number; y: number; material: MaterialName }> = [
  { x: 0.62, y: 0.25, material: 'neonAcid' },
  { x: 0.79, y: 0.08, material: 'neonPapaya' },
  { x: 0.45, y: 0.08, material: 'neonCyan' },
  { x: 0.62, y: -0.09, material: 'neonPink' },
]

const SIDES = [-1, 1] as const

/** Stik/gamepad stylized dari RoundedBox, capsule, silinder, dan torus neon. */
export function Gamepad() {
  return (
    <group>
      <RoundedBox
        args={[2.1, 0.95, 0.42]}
        radius={0.2}
        smoothness={5}
        material={materials.graphite}
      />
      {SIDES.map((side) => (
        <mesh
          key={side}
          material={materials.graphite}
          position={[side * 0.78, -0.42, -0.02]}
          rotation={[0, 0, side * 0.45]}
          scale={[1, 1, 0.68]}
        >
          <capsuleGeometry args={[0.31, 0.55, 8, 20]} />
        </mesh>
      ))}
      {SIDES.map((side) => (
        <RoundedBox
          key={`shoulder-${side}`}
          args={[0.52, 0.14, 0.3]}
          radius={0.05}
          smoothness={3}
          position={[side * 0.62, 0.5, -0.03]}
          material={materials.matte}
        />
      ))}
      <group position={[-0.62, 0.08, 0.215]}>
        <mesh material={materials.matte}>
          <boxGeometry args={[0.38, 0.12, 0.07]} />
        </mesh>
        <mesh material={materials.matte}>
          <boxGeometry args={[0.12, 0.38, 0.07]} />
        </mesh>
      </group>
      {FACE_BUTTONS.map((button) => (
        <mesh
          key={button.material}
          material={materials[button.material]}
          position={[button.x, button.y, 0.215]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.075, 0.075, 0.08, 24]} />
        </mesh>
      ))}
      {[-0.3, 0.3].map((x) => (
        <group key={x} position={[x, -0.22, 0.22]}>
          <mesh material={materials.matte} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.17, 0.1, 28]} />
          </mesh>
          <mesh material={materials.neonAcid} position-z={0.052}>
            <torusGeometry args={[0.13, 0.014, 10, 40]} />
          </mesh>
        </group>
      ))}
      <mesh material={materials.neonAcid} position={[0, 0.33, 0.212]}>
        <boxGeometry args={[0.4, 0.045, 0.012]} />
      </mesh>
    </group>
  )
}
