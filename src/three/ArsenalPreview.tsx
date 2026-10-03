import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { MathUtils, type Group } from 'three'
import { GAMES, type GameAsset } from '../data/content'
import { motion } from '../lib/motion'
import { Asset } from './assets/Asset'
import { Glow } from './assets/Glow'
import { RgbModeDriver } from './SceneSignals'
import { Studio } from './Studio'

/** Skala tiap aset agar ukurannya seragam di jendela preview. */
const ASSET_SCALE: Record<GameAsset, number> = {
  crystal: 1.25,
  keycaps: 1,
  ball: 1.45,
  grass: 1.15,
  crate: 1.05,
  crewmate: 1.05,
  pawn: 1.5,
}

/** Semua aset dipasang sekaligus; hanya yang aktif membesar (tanpa re-render React). */
function Carousel() {
  const groups = useRef<Array<Group | null>>([])

  useFrame((state, delta) => {
    const active = motion.arsenal.active
    const time = state.clock.elapsedTime
    groups.current.forEach((group, index) => {
      if (!group) return
      const game = GAMES[index]
      const target = index === active && game ? ASSET_SCALE[game.asset] : 0
      const scale = MathUtils.damp(group.scale.x, target, 9, delta)
      group.scale.setScalar(Math.max(scale, 0.0001))
      group.visible = scale > 0.01
      group.rotation.y += delta * 0.9
      group.rotation.x = Math.sin(time * 1.3 + index) * 0.22
      group.position.y = Math.sin(time * 1.8 + index) * 0.08
    })
  })

  return GAMES.map((game, index) => (
    <group
      key={game.title}
      ref={(group) => {
        groups.current[index] = group
      }}
      scale={0.0001}
    >
      <Asset kind={game.asset} />
    </group>
  ))
}

/** Jendela preview 3D kecil yang mengikuti kursor di section Arsenal (lazy, desktop). */
export default function ArsenalPreview({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={[1, Math.min(window.devicePixelRatio || 1, 1.5)]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5], fov: 32 }}
      frameloop={active ? 'always' : 'never'}
      resize={{ offsetSize: true }}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Studio quality="low" />
        <Glow size={4.2} opacity={0.3} position={[0, 0, -1.5]} />
        <Carousel />
        <RgbModeDriver />
      </Suspense>
    </Canvas>
  )
}
