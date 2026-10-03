import { useMemo } from 'react'
import { LatheGeometry, Vector2 } from 'three'
import { materials } from '../materials'

/** Profil bidak (radius, tinggi) dari bawah ke atas, diputar 360° oleh LatheGeometry. */
const PROFILE: Array<[number, number]> = [
  [0, 0],
  [0.42, 0],
  [0.42, 0.07],
  [0.35, 0.12],
  [0.37, 0.17],
  [0.27, 0.22],
  [0.2, 0.3],
  [0.15, 0.55],
  [0.145, 0.62],
  [0.25, 0.66],
  [0.25, 0.7],
  [0.14, 0.74],
  [0.17, 0.8],
  [0.205, 0.88],
  [0.205, 0.96],
  [0.17, 1.04],
  [0.1, 1.1],
  [0, 1.12],
]

let geometry: LatheGeometry | null = null

function getGeometry() {
  geometry ??= new LatheGeometry(
    PROFILE.map(([radius, height]) => new Vector2(radius, height - 0.56)),
    48,
  )
  return geometry
}

/** Bidak catur (lawan abadi: Pak RT). */
export function Pawn() {
  const lathe = useMemo(() => getGeometry(), [])
  return <mesh geometry={lathe} material={materials.bone} />
}
