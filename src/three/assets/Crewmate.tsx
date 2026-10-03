import { RoundedBox } from '@react-three/drei'
import { materials } from '../materials'

/** Kru antariksa (party game) warna lime: kapsul, visor, ransel, kaki. */
export function Crewmate() {
  return (
    <group>
      <mesh material={materials.acid}>
        <capsuleGeometry args={[0.42, 0.5, 12, 24]} />
      </mesh>
      <mesh material={materials.visor} position={[0, 0.22, 0.3]} scale={[1, 0.62, 0.62]}>
        <sphereGeometry args={[0.32, 32, 16]} />
      </mesh>
      <RoundedBox
        args={[0.52, 0.66, 0.3]}
        radius={0.1}
        smoothness={3}
        position={[0, 0.02, -0.42]}
        material={materials.acid}
      />
      {[-0.19, 0.19].map((x) => (
        <mesh key={x} material={materials.acid} position={[x, -0.66, 0]}>
          <capsuleGeometry args={[0.15, 0.22, 8, 12]} />
        </mesh>
      ))}
    </group>
  )
}
