import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useState, type RefObject } from 'react'
import { RIDHO_PHOTO } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { maxDpr, type Quality } from '../lib/device'
import { motion } from '../lib/motion'
import { PORTRAIT_ASPECT } from '../lib/photo'
import { Asset, type AssetKind } from './assets/Asset'
import type { KeycapTone } from './assets/Keycap'
import { CAMERA_FOV, CAMERA_Z, VIEW_HEIGHT } from './constants'
import { Floating } from './Floating'
import { PhotoPlane } from './PhotoPlane'
import { RIDHO_HUD } from './ridho'
import { ReadySignal, RgbModeDriver } from './SceneSignals'
import { RenderOnChange, SceneWarmup } from './SceneWarmup'
import { Studio } from './Studio'

type Vec3 = [number, number, number]

type Props = {
  photoRef: RefObject<HTMLElement | null>
  active: boolean
  quality: Quality
  onReady?: () => void
}

type FrontItem = {
  kind: AssetKind
  label?: string
  tone?: KeycapTone
  at: Vec3
  scale: number
  rotation: Vec3
  drift: Vec3
}

/** Objek lapisan depan: bergerak jauh lebih cepat dari scroll (parallax paling dekat). */
// prettier-ignore
const FRONT_ITEMS: FrontItem[] = [
  { kind: 'keycap', label: 'G', tone: 'acid', at: [-0.5, -0.9, 2.6], scale: 0.42, rotation: [0.9, 0.4, -0.2], drift: [0, 7, 0] },
  { kind: 'keycap', label: 'G', at: [-0.3, -1.2, 2.1], scale: 0.38, rotation: [1, -0.3, 0.25], drift: [0, 6.2, 0] },
  { kind: 'coin', at: [0.48, -0.5, 2.3], scale: 0.4, rotation: [0.2, 0.6, 0], drift: [0, 7.8, 0] },
  { kind: 'crystal', at: [0.62, -1.1, 1.6], scale: 0.5, rotation: [0.2, 0, 0.3], drift: [0, 5.4, 0] },
  { kind: 'dice', at: [-0.66, -0.2, 1.3], scale: 0.4, rotation: [0.6, 0.6, 0.1], drift: [0, 6, 0] },
  { kind: 'coin', at: [0.28, -1.5, 2.8], scale: 0.3, rotation: [0.4, -0.5, 0.2], drift: [0, 9, 0] },
]

const spotProgress = () => motion.spotlight.progress
const spotReveal = () => motion.spotlight.reveal
const spotZoom = () => 1 + (1 - motion.spotlight.reveal) * 0.18
const spotIntro = () => Math.min(1, motion.spotlight.reveal * 1.4)

function FrontObjects() {
  const size = useThree((state) => state.size)
  const halfHeight = VIEW_HEIGHT / 2
  const halfWidth = halfHeight * (size.width / Math.max(size.height, 1))

  return FRONT_ITEMS.map((item, index) => (
    <Floating
      key={`${item.kind}-${index}`}
      position={[item.at[0] * halfWidth, item.at[1] * halfHeight, item.at[2]]}
      rotation={item.rotation}
      scale={item.scale}
      spin={[0.1, 0.3, 0.05]}
      depth={1.4}
      drift={item.drift}
      delay={index * 0.08}
      seed={index * 2.3}
      getProgress={spotProgress}
      getIntro={spotIntro}
    >
      <Asset kind={item.kind} label={item.label} tone={item.tone} />
    </Floating>
  ))
}

/** Scene spotlight (lazy, desktop): foto Ridho dengan reveal shader + objek 3D di depan. */
export default function SpotlightScene({ photoRef, active, quality, onReady }: Props) {
  const reduced = usePrefersReducedMotion()
  const [warm, setWarm] = useState(false)
  const markWarm = useCallback(() => setWarm(true), [])
  return (
    <Canvas
      dpr={[1, maxDpr(quality)]}
      gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV, near: 0.1, far: 80 }}
      frameloop={!active || !warm ? 'never' : reduced ? 'demand' : 'always'}
      resize={{ offsetSize: true }}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Studio />
        <PhotoPlane
          anchorRef={photoRef}
          photo={RIDHO_PHOTO}
          aspect={PORTRAIT_ASPECT}
          hud={RIDHO_HUD}
          getReveal={spotReveal}
          getZoom={spotZoom}
          tilt={0.7}
        />
        <FrontObjects />
        <RgbModeDriver />
        <SceneWarmup onWarm={markWarm} />
        <RenderOnChange signal={warm} />
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
