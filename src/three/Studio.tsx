import { Environment, Lightformer } from '@react-three/drei'
import type { Quality } from '../lib/device'
import { COLORS } from './materials'

/**
 * Lighting dramatis: key light hangat + rim neon (lime & papaya).
 * Environment dibangun dari Lightformer (prosedural) alih-alih preset HDR,
 * jadi tidak ada unduhan file HDR dari CDN dan refleksinya ikut warna brand.
 */
export function Studio({ quality }: { quality: Quality }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 8]} intensity={2.2} color="#fff4e6" />
      <pointLight position={[-6, 1.5, 4]} intensity={55} color={COLORS.acid} />
      <pointLight position={[6, -3, 3]} intensity={40} color={COLORS.papaya} />
      <Environment resolution={quality === 'high' ? 256 : 128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#ffffff"
          position={[0, 5, 6]}
          scale={[12, 4, 1]}
        />
        <Lightformer
          form="ring"
          intensity={5}
          color={COLORS.acid}
          position={[-7, 1, 2]}
          scale={5}
        />
        <Lightformer
          form="rect"
          intensity={3.5}
          color={COLORS.papaya}
          position={[7, -2, 1]}
          scale={[3, 8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color={COLORS.cyan}
          position={[0, -6, -3]}
          scale={[10, 2, 1]}
        />
      </Environment>
    </>
  )
}
