import { RoundedBox } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { use, useEffect, useMemo, useRef, type RefObject } from 'react'
import {
  AdditiveBlending,
  MathUtils,
  Vector2,
  Vector3,
  Vector4,
  type Group,
  type ShaderMaterial,
} from 'three'
import type { Photo } from '../data/content'
import { motion, scrollEnergy } from '../lib/motion'
import { cropRect } from '../lib/photo'
import { VIEW_HEIGHT } from './constants'
import { COLORS, materials } from './materials'
import { canvasFontsReady, loadPhotoTexture } from './resources'
import { photoFragment, photoVertex } from './shaders/photo'
import { cardHudTexture, glowTexture, type CardHud } from './textures'

type Props = {
  /** Elemen DOM yang menentukan posisi & ukuran kartu (layout tetap diatur CSS). */
  anchorRef: RefObject<HTMLElement | null>
  photo: Photo
  /** Rasio frame (lebar / tinggi), harus sama dengan rasio anchor. */
  aspect: number
  hud?: CardHud
  /** 0..1 untuk wipe reveal; default selalu terlihat. */
  getReveal?: () => number
  /** ≥ 1, zoom foto di dalam frame. */
  getZoom?: () => number
  /** Transform tambahan per frame (intro, scroll) di sekitar pusat kartu. */
  transform?: (group: Group, delta: number) => void
  /** Tebal pelat belakang dalam satuan tinggi kartu (0 = tanpa pelat). */
  depth?: number
  /** Pengali tilt hover & parallax mouse. */
  tilt?: number
  glow?: boolean
}

const damp = MathUtils.damp

function hexToVector(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16)
  return new Vector3(((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255)
}

/**
 * Foto sebagai plane 3D yang selalu menempel ke rect elemen DOM jangkar.
 * Hover pada jangkar → tilt 3D, ripple, RGB split; scroll cepat → distorsi.
 */
export function PhotoPlane({
  anchorRef,
  photo,
  aspect,
  hud,
  getReveal,
  getZoom,
  transform,
  depth = 0.05,
  tilt = 1,
  glow = true,
}: Props) {
  const texture = use(loadPhotoTexture(photo.src))
  use(canvasFontsReady())
  const gl = useThree((state) => state.gl)
  const size = useThree((state) => state.size)

  const outer = useRef<Group>(null)
  const rig = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const material = useRef<ShaderMaterial>(null)
  const layout = useRef({ x: 0, y: 0, scale: 0 })
  const pointer = useRef({ u: 0.5, v: 0.5, inside: false })

  const hudTexture = useMemo(
    () => (hud ? cardHudTexture(hud, photo.crop.banner) : null),
    [hud, photo.crop.banner],
  )
  const glowMap = useMemo(() => glowTexture(), [])

  const uniforms = useMemo(() => {
    const crop = cropRect(photo, aspect)
    return {
      uMap: { value: texture },
      uCrop: { value: new Vector4(crop.x, crop.y, crop.w, crop.h) },
      uSize: { value: new Vector2(aspect, 1) },
      uRadius: { value: 0.035 },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uBanner: { value: photo.crop.banner },
      uReveal: { value: 1 },
      uZoom: { value: 1 },
      uInk: { value: hexToVector(COLORS.ink) },
      uAccent: { value: hexToVector(COLORS.acid) },
    }
  }, [texture, photo, aspect])

  // Petakan rect DOM → koordinat dunia pada bidang z = 0.
  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const canvas = gl.domElement
    const measure = () => {
      const canvasRect = canvas.getBoundingClientRect()
      if (!canvasRect.width || !canvasRect.height) return
      const rect = anchor.getBoundingClientRect()
      const viewWidth = VIEW_HEIGHT * (canvasRect.width / canvasRect.height)
      layout.current.x =
        ((rect.left + rect.width / 2 - canvasRect.left) / canvasRect.width - 0.5) * viewWidth
      layout.current.y =
        -((rect.top + rect.height / 2 - canvasRect.top) / canvasRect.height - 0.5) * VIEW_HEIGHT
      layout.current.scale = (rect.height / canvasRect.height) * VIEW_HEIGHT
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(anchor)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [anchorRef, gl, size])

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const onMove = (event: PointerEvent) => {
      const rect = anchor.getBoundingClientRect()
      pointer.current.u = (event.clientX - rect.left) / rect.width
      pointer.current.v = 1 - (event.clientY - rect.top) / rect.height
      pointer.current.inside = true
    }
    const onLeave = () => {
      pointer.current.inside = false
    }
    anchor.addEventListener('pointermove', onMove)
    anchor.addEventListener('pointerleave', onLeave)
    return () => {
      anchor.removeEventListener('pointermove', onMove)
      anchor.removeEventListener('pointerleave', onLeave)
    }
  }, [anchorRef])

  useFrame((state, delta) => {
    const group = outer.current
    const rigGroup = rig.current
    const tiltGroup = inner.current
    const shader = material.current
    if (!group || !rigGroup || !tiltGroup || !shader) return

    const { x, y, scale } = layout.current
    group.position.set(x, y, 0)
    group.scale.setScalar(Math.max(scale, 0.0001))
    transform?.(rigGroup, delta)

    const u = shader.uniforms as typeof uniforms
    const target = pointer.current
    const time = state.clock.elapsedTime
    u.uTime.value = time
    u.uHover.value = damp(u.uHover.value, target.inside ? 1 : 0, 5, delta)
    u.uMouse.value.set(
      damp(u.uMouse.value.x, target.u, 8, delta),
      damp(u.uMouse.value.y, target.v, 8, delta),
    )
    u.uVelocity.value = damp(u.uVelocity.value, scrollEnergy(), 6, delta)
    u.uReveal.value = getReveal ? getReveal() : 1
    u.uZoom.value = getZoom ? getZoom() : 1

    const hover = u.uHover.value
    const tiltX =
      (-(target.v - 0.5) * 0.55 * hover - motion.pointer.ny * 0.07) * tilt +
      Math.sin(time * 0.7) * 0.025
    const tiltY =
      ((target.u - 0.5) * 0.7 * hover + motion.pointer.nx * 0.12) * tilt +
      Math.sin(time * 0.5 + 1.3) * 0.04
    tiltGroup.rotation.x = damp(tiltGroup.rotation.x, tiltX, 5, delta)
    tiltGroup.rotation.y = damp(tiltGroup.rotation.y, tiltY, 5, delta)
    tiltGroup.position.y = Math.sin(time * 0.9) * 0.012
  })

  return (
    <group ref={outer}>
      <group ref={rig}>
        <group ref={inner}>
          {glow && (
            <sprite position-z={-0.3} scale={[aspect * 2.4, 2.2, 1]}>
              <spriteMaterial
                map={glowMap}
                color={COLORS.acid}
                transparent
                opacity={0.26}
                blending={AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </sprite>
          )}
          {depth > 0 && (
            <RoundedBox
              args={[aspect, 1, depth]}
              radius={0.035}
              smoothness={4}
              position-z={-depth / 2}
              material={materials.graphite}
            />
          )}
          <mesh position-z={0.022} renderOrder={1}>
            <planeGeometry args={[aspect, 1, 48, 48]} />
            <shaderMaterial
              ref={material}
              uniforms={uniforms}
              vertexShader={photoVertex}
              fragmentShader={photoFragment}
              transparent
            />
          </mesh>
          {hudTexture && (
            <mesh position-z={0.046} renderOrder={2}>
              <planeGeometry args={[aspect, 1]} />
              <meshBasicMaterial
                map={hudTexture}
                transparent
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          )}
        </group>
      </group>
    </group>
  )
}
