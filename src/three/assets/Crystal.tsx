import { materials } from '../materials'

/** Kristal low-poly (flat shading + iridescence). */
export function Crystal() {
  return (
    <mesh material={materials.crystal} scale={[0.75, 1.25, 0.75]}>
      <octahedronGeometry args={[0.7, 0]} />
    </mesh>
  )
}
