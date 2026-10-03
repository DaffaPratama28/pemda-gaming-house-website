import { COLORS } from './materials'

/**
 * Lighting dramatis: key light hangat + rim neon (lime & papaya).
 * Refleksi datang dari environment prosedural yang dipanggang oleh `SceneWarmup`.
 */
export function Studio() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 8]} intensity={2.2} color="#fff4e6" />
      <pointLight position={[-6, 1.5, 4]} intensity={55} color={COLORS.acid} />
      <pointLight position={[6, -3, 3]} intensity={40} color={COLORS.papaya} />
    </>
  )
}
