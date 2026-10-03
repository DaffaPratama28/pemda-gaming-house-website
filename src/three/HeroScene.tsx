import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useState, type RefObject } from 'react'
import { MathUtils, type Group } from 'three'
import { RIDHO_PHOTO } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { maxDpr, type Quality } from '../lib/device'
import { motion } from '../lib/motion'
import { CARD_ASPECT } from '../lib/photo'
import { Asset, type AssetKind } from './assets/Asset'
import type { KeycapTone } from './assets/Keycap'
import { CAMERA_FOV, CAMERA_Z, VIEW_HEIGHT } from './constants'
import { Floating } from './Floating'
import { PhotoPlane } from './PhotoPlane'
import { ReadySignal, RgbModeDriver } from './SceneSignals'
import { RenderOnChange, SceneWarmup } from './SceneWarmup'
import { Studio } from './Studio'
import { RIDHO_HUD } from './ridho'

type Vec3 = [number, number, number]

type Props = {
  cardRef: RefObject<HTMLElement | null>
  /** False saat hero di luar layar: render loop berhenti total. */
  active: boolean
  quality: Quality
  compact: boolean
  onReady: () => void
}

type HeroItem = {
  kind: AssetKind
  label?: string
  tone?: KeycapTone
  /** x, y = fraksi setengah viewport (-1..1); z = kedalaman dunia. */
  at: Vec3
  scale: number
  rotation: Vec3
  spin: Vec3
  depth: number
  drift: Vec3
  delay: number
  /** Dilewati di perangkat lemah (material physical/iridescence). */
  heavy?: boolean
}

// prettier-ignore
const DESKTOP_ITEMS: HeroItem[] = [
  { kind: 'gamepad', at: [0.02, -0.74, 1.6], scale: 0.58, rotation: [0.5, -0.55, 0.2], spin: [0, 0.16, 0], depth: 1.4, drift: [-1, 4.2, 2.6], delay: 0.12 },
  { kind: 'headset', at: [0.9, 0.4, -1.4], scale: 0.7, rotation: [0.2, 0.6, -0.2], spin: [0, 0.12, 0.04], depth: 0.7, drift: [0.8, 3.2, 0], delay: 0.28, heavy: true },
  { kind: 'keycap', label: 'P', tone: 'acid', at: [-0.42, 0.56, 0.9], scale: 0.4, rotation: [0.95, 0.3, -0.15], spin: [0.05, 0.2, 0], depth: 1.1, drift: [-0.5, 5, 1.5], delay: 0.05 },
  { kind: 'keycap', label: 'E', at: [-0.12, 0.6, -1.8], scale: 0.36, rotation: [1, -0.4, 0.2], spin: [0.1, 0.18, 0], depth: 0.6, drift: [0, 2.8, 0], delay: 0.2 },
  { kind: 'keycap', label: 'M', at: [0.6, -0.86, 1.1], scale: 0.4, rotation: [0.8, 0.5, 0.1], spin: [0.06, -0.2, 0], depth: 1.2, drift: [0.6, 4.6, 2], delay: 0.32 },
  { kind: 'keycap', label: 'D', tone: 'bone', at: [1, -0.22, 0.5], scale: 0.38, rotation: [1.1, -0.3, -0.25], spin: [0.12, 0.1, 0], depth: 1, drift: [1.2, 3.6, 1], delay: 0.4 },
  { kind: 'keycap', label: 'A', at: [-0.62, -0.42, -0.9], scale: 0.36, rotation: [0.9, 0.2, 0.3], spin: [0.08, 0.22, 0], depth: 0.8, drift: [-0.8, 3, 0.6], delay: 0.45 },
  { kind: 'coin', at: [0.34, 0.5, 0.9], scale: 0.42, rotation: [0.2, 0.5, 0], spin: [0, 0.9, 0], depth: 1.1, drift: [0.2, 4.4, 1.6], delay: 0.18 },
  { kind: 'coin', at: [-0.95, -0.78, 0.2], scale: 0.36, rotation: [0.1, -0.6, 0.2], spin: [0, -0.8, 0], depth: 0.9, drift: [-0.6, 3.8, 1.2], delay: 0.5 },
  { kind: 'crystal', at: [0.02, 0.32, -2.8], scale: 0.7, rotation: [0, 0, 0.2], spin: [0.1, 0.3, 0], depth: 0.4, drift: [0, 2, -1], delay: 0.35, heavy: true },
  { kind: 'crystal', at: [0.99, 0.3, -2.2], scale: 0.5, rotation: [0.3, 0, -0.3], spin: [0.12, -0.28, 0], depth: 0.5, drift: [0.5, 2.6, 0], delay: 0.55, heavy: true },
  { kind: 'dice', at: [-0.42, -0.9, 1.6], scale: 0.42, rotation: [0.6, 0.7, 0.2], spin: [0.25, 0.18, 0.1], depth: 1.3, drift: [-0.4, 5.2, 2.2], delay: 0.25 },
]

// prettier-ignore
const COMPACT_ITEMS: HeroItem[] = [
  { kind: 'gamepad', at: [0.74, -0.42, 1.2], scale: 0.36, rotation: [0.5, -0.5, 0.25], spin: [0, 0.16, 0], depth: 1, drift: [0, 3.4, 1.6], delay: 0.1 },
  { kind: 'keycap', label: 'P', tone: 'acid', at: [0.7, 0.62, 0.4], scale: 0.3, rotation: [0.95, 0.3, -0.15], spin: [0.05, 0.2, 0], depth: 0.8, drift: [-0.3, 3.6, 1], delay: 0.05 },
  { kind: 'keycap', label: 'A', at: [0.8, 0.34, 0.2], scale: 0.28, rotation: [0.9, -0.3, 0.2], spin: [0.08, 0.22, 0], depth: 0.8, drift: [0.4, 3, 0.6], delay: 0.3 },
  { kind: 'coin', at: [-0.74, -0.56, 0.6], scale: 0.3, rotation: [0.1, -0.6, 0.2], spin: [0, 0.8, 0], depth: 0.8, drift: [-0.3, 3.4, 1], delay: 0.2 },
  { kind: 'crystal', at: [0.78, -0.08, -2], scale: 0.42, rotation: [0.3, 0, -0.3], spin: [0.12, -0.28, 0], depth: 0.4, drift: [0.3, 2.2, 0], delay: 0.4, heavy: true },
  { kind: 'dice', at: [-0.8, 0.12, 0.8], scale: 0.3, rotation: [0.6, 0.7, 0.2], spin: [0.25, 0.18, 0.1], depth: 0.9, drift: [-0.2, 3.8, 1.4], delay: 0.25 },
]

const heroProgress = () => motion.hero.progress
const heroIntro = () => motion.hero.intro

function HeroObjects({ compact, quality }: { compact: boolean; quality: Quality }) {
  const size = useThree((state) => state.size)
  const halfHeight = VIEW_HEIGHT / 2
  const halfWidth = halfHeight * (size.width / Math.max(size.height, 1))
  const source = compact ? COMPACT_ITEMS : DESKTOP_ITEMS
  const items = quality === 'low' ? source.filter((item) => !item.heavy) : source

  return items.map((item, index) => (
    <Floating
      key={`${item.kind}-${index}`}
      position={[item.at[0] * halfWidth, item.at[1] * halfHeight, item.at[2]]}
      rotation={item.rotation}
      scale={item.scale}
      spin={item.spin}
      depth={item.depth}
      drift={item.drift}
      delay={item.delay}
      seed={index * 1.7}
      getProgress={heroProgress}
      getIntro={heroIntro}
    >
      <Asset kind={item.kind} label={item.label} tone={item.tone} />
    </Floating>
  ))
}

/** Kamera: parallax halus ke arah mouse + dolly maju saat hero di-scroll. */
function CameraRig() {
  useFrame((state, delta) => {
    const camera = state.camera
    const progress = motion.hero.progress
    camera.position.x = MathUtils.damp(camera.position.x, motion.pointer.nx * 0.22, 2.5, delta)
    camera.position.y = MathUtils.damp(camera.position.y, motion.pointer.ny * 0.16, 2.5, delta)
    camera.position.z = MathUtils.damp(camera.position.z, CAMERA_Z - progress * 2.2, 6, delta)
    camera.lookAt(0, 0, 0)
  })
  return null
}

/** Intro kartu (berputar masuk) + scroll-out (miring ke belakang, naik, mengecil). */
function heroCardTransform(group: Group) {
  const { intro, progress } = motion.hero
  const eased = 1 - (1 - intro) ** 3
  group.rotation.set(progress * 0.55, (1 - eased) * -1.3 + progress * 0.3, 0)
  group.position.set(0, progress * 0.45, (1 - eased) * -0.6 - progress * 0.4)
  group.scale.setScalar(0.82 + eased * 0.18)
}

/** Scene hero (lazy-loaded): kartu Ridho + aset gaming prosedural yang melayang. */
export default function HeroScene({ cardRef, active, quality, compact, onReady }: Props) {
  const reduced = usePrefersReducedMotion()
  const [dpr, setDpr] = useState(() => maxDpr(quality))
  const [warm, setWarm] = useState(false)
  const markWarm = useCallback(() => setWarm(true), [])

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV, near: 0.1, far: 80 }}
      frameloop={!active || !warm ? 'never' : reduced ? 'demand' : 'always'}
      resize={{ offsetSize: true }}
      style={{ pointerEvents: 'none' }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Suspense fallback={null}>
        <Studio />
        <CameraRig />
        <PhotoPlane
          anchorRef={cardRef}
          photo={RIDHO_PHOTO}
          aspect={CARD_ASPECT}
          hud={RIDHO_HUD}
          transform={heroCardTransform}
        />
        <HeroObjects compact={compact} quality={quality} />
        <RgbModeDriver />
        <SceneWarmup onWarm={markWarm} />
        <RenderOnChange signal={warm} />
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
