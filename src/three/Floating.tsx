import { useFrame } from '@react-three/fiber'
import { useRef, type ReactNode } from 'react'
import { MathUtils, type Group } from 'three'
import { motion, scrollEnergy } from '../lib/motion'

type Vec3 = [number, number, number]

type Props = {
  children: ReactNode
  position: Vec3
  rotation?: Vec3
  scale?: number
  /** Kecepatan rotasi idle (rad/detik) per sumbu; makin cepat saat scroll. */
  spin?: Vec3
  /** Kekuatan reaksi ke mouse ≈ kedalaman parallax. */
  depth?: number
  /** Pergeseran [x, y, z] pada progres scroll 1 (parallax berbeda tiap objek). */
  drift?: Vec3
  /** Penundaan muncul saat intro (0..0.6). */
  delay?: number
  seed?: number
  getProgress?: () => number
  getIntro?: () => number
}

const damp = MathUtils.damp

/** Amplitudo melayang naik-turun (unit dunia). */
const FLOAT_AMPLITUDE = 0.12

/** Pembungkus objek melayang: float idle, parallax mouse, drift scroll, intro bertahap. */
export function Floating({
  children,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  spin = [0.08, 0.14, 0],
  depth = 1,
  drift = [0, 2, 0],
  delay = 0,
  seed = 1,
  getProgress,
  getIntro,
}: Props) {
  const outer = useRef<Group>(null)
  const spinner = useRef<Group>(null)

  useFrame((state, delta) => {
    const group = outer.current
    const spinGroup = spinner.current
    if (!group || !spinGroup) return

    const time = state.clock.elapsedTime
    const progress = getProgress?.() ?? 0
    const intro = getIntro?.() ?? 1
    const local = MathUtils.clamp(intro * (1 + delay) - delay, 0, 1)
    const eased = 1 - (1 - local) ** 3
    const energy = scrollEnergy()
    const { nx, ny } = motion.pointer

    const x = position[0] + nx * 0.35 * depth + drift[0] * progress
    const y =
      position[1] +
      Math.sin(time * 0.8 + seed) * FLOAT_AMPLITUDE +
      ny * 0.25 * depth +
      drift[1] * progress
    const z = position[2] + drift[2] * progress - (1 - eased) * 6
    group.position.set(
      damp(group.position.x, x, 3.5, delta),
      damp(group.position.y, y, 3.5, delta),
      damp(group.position.z, z, 4, delta),
    )
    group.rotation.x = damp(group.rotation.x, rotation[0] - ny * 0.25 * depth, 3, delta)
    group.rotation.y = damp(group.rotation.y, rotation[1] + nx * 0.35 * depth, 3, delta)
    group.rotation.z = rotation[2]
    group.scale.setScalar(Math.max(scale * eased, 0.0001))

    const boost = 1 + energy * 6
    spinGroup.rotation.x += delta * spin[0] * boost
    spinGroup.rotation.y += delta * spin[1] * boost
    spinGroup.rotation.z += delta * spin[2] * boost
  })

  return (
    <group ref={outer} position={position} rotation={rotation} scale={0.0001}>
      <group ref={spinner}>{children}</group>
    </group>
  )
}
