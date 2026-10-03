import { useMemo } from 'react'
import { MeshStandardMaterial } from 'three'
import { MEMBERS } from '../../data/content'
import { diceFaceTexture } from '../textures'

/** Inisial unik tiap anggota (Agung & Abip → "AG" & "AB"). */
function initials() {
  return MEMBERS.map((member) => {
    const first = member.name.charAt(0).toUpperCase()
    const clash = MEMBERS.some(
      (other) => other !== member && other.name.charAt(0).toUpperCase() === first,
    )
    return { label: clash ? member.name.slice(0, 2).toUpperCase() : first, accent: member.accent }
  })
}

let faceMaterials: MeshStandardMaterial[] | null = null

function getFaceMaterials() {
  if (!faceMaterials) {
    const faces = [...initials(), { label: '★', accent: '#c6ff3d' }].slice(0, 6)
    faceMaterials = faces.map(
      ({ label, accent }) =>
        new MeshStandardMaterial({
          map: diceFaceTexture(label, accent),
          roughness: 0.38,
          metalness: 0.25,
        }),
    )
  }
  return faceMaterials
}

/** Dadu dengan inisial lima anggota + satu bintang. */
export function Dice() {
  const faces = useMemo(() => getFaceMaterials(), [])
  return (
    <mesh material={faces}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  )
}
