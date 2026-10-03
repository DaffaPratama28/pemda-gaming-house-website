import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import {
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PMREMGenerator,
  RingGeometry,
  Scene,
  type WebGLRenderer,
  type WebGLRenderTarget,
} from 'three'
import type { Quality } from '../lib/device'
import { COLORS } from './materials'

type Panel = {
  form: 'rect' | 'ring'
  color: string
  intensity: number
  position: [number, number, number]
  scale: [number, number]
}

/** Panel cahaya virtual (ala Lightformer): key light putih + rim neon brand. */
const PANELS: Panel[] = [
  { form: 'rect', color: '#ffffff', intensity: 2.4, position: [0, 5, 6], scale: [12, 4] },
  { form: 'ring', color: COLORS.acid, intensity: 5, position: [-7, 1, 2], scale: [5, 5] },
  { form: 'rect', color: COLORS.papaya, intensity: 3.5, position: [7, -2, 1], scale: [3, 8] },
  { form: 'rect', color: COLORS.cyan, intensity: 1.2, position: [0, -6, -3], scale: [10, 2] },
]

/**
 * "Memanggang" environment map prosedural sekali: panel emissive dirender ke
 * cubemap lalu diproses PMREM. Tanpa file HDR, tanpa loader EXR/RGBE di bundle.
 */
function bakeEnvironment(renderer: WebGLRenderer, size: number) {
  const scene = new Scene()
  scene.background = new Color('#0c0c0e')
  const disposables: Array<{ dispose: () => void }> = []

  for (const panel of PANELS) {
    const geometry = panel.form === 'ring' ? new RingGeometry(0.5, 1, 64) : new PlaneGeometry(1, 1)
    const material = new MeshBasicMaterial({
      color: new Color(panel.color).multiplyScalar(panel.intensity),
      side: DoubleSide,
      toneMapped: false,
    })
    const mesh = new Mesh(geometry, material)
    mesh.position.set(...panel.position)
    mesh.scale.set(panel.scale[0], panel.scale[1], 1)
    mesh.lookAt(0, 0, 0)
    scene.add(mesh)
    disposables.push(geometry, material)
  }

  const generator = new PMREMGenerator(renderer)
  const target = generator.fromScene(scene, 0.04, 0.1, 100, { size })
  generator.dispose()
  disposables.forEach((item) => item.dispose())
  return target
}

/** Lighting dramatis: key light hangat + rim neon (lime & papaya) + environment prosedural. */
export function Studio({ quality }: { quality: Quality }) {
  const baked = useRef<WebGLRenderTarget | null>(null)

  // Dipanggang pada frame pertama (renderer sudah siap), dibuang saat unmount.
  useFrame((state) => {
    if (baked.current) return
    baked.current = bakeEnvironment(state.gl, quality === 'high' ? 256 : 128)
    state.scene.environment = baked.current.texture
  })

  useEffect(
    () => () => {
      baked.current?.dispose()
      baked.current = null
    },
    [],
  )

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 8]} intensity={2.2} color="#fff4e6" />
      <pointLight position={[-6, 1.5, 4]} intensity={55} color={COLORS.acid} />
      <pointLight position={[6, -3, 3]} intensity={40} color={COLORS.papaya} />
    </>
  )
}
