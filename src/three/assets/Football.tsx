import { useMemo } from 'react'
import { BufferAttribute, IcosahedronGeometry, MeshStandardMaterial, Vector3 } from 'three'

let geometry: IcosahedronGeometry | null = null
const material = new MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.45,
  flatShading: true,
})

/**
 * Bola low-poly: icosahedron detail 2, segitiga yang menyentuh 12 titik sudut
 * icosahedron asli diwarnai gelap sehingga membentuk pola segilima ala bola sepak.
 */
function getGeometry() {
  if (geometry) return geometry
  const ball = new IcosahedronGeometry(0.62, 2)
  const base = new IcosahedronGeometry(1, 0).getAttribute('position')
  const corners: Vector3[] = []
  const point = new Vector3()
  for (let index = 0; index < base.count; index += 1) {
    point.fromBufferAttribute(base, index).normalize()
    if (!corners.some((corner) => corner.distanceTo(point) < 1e-3)) corners.push(point.clone())
  }

  const position = ball.getAttribute('position')
  const colors = new Float32Array(position.count * 3)
  for (let face = 0; face < position.count; face += 3) {
    let dark = false
    for (let k = 0; k < 3; k += 1) {
      point.fromBufferAttribute(position, face + k).normalize()
      if (corners.some((corner) => corner.dot(point) > 0.999)) dark = true
    }
    const tone = dark ? [0.05, 0.05, 0.06] : [0.92, 0.9, 0.86]
    for (let k = 0; k < 3; k += 1) colors.set(tone, (face + k) * 3)
  }
  ball.setAttribute('color', new BufferAttribute(colors, 3))
  geometry = ball
  return ball
}

/** Bola sepak low-poly. */
export function Football() {
  const ball = useMemo(() => getGeometry(), [])
  return <mesh geometry={ball} material={material} />
}
