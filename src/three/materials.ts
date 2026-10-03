import { MeshPhysicalMaterial, MeshStandardMaterial } from 'three'

/** Palet 3D, selaras dengan token CSS di src/styles/index.css. */
export const COLORS = {
  ink: '#0a0a0a',
  graphite: '#1c1c21',
  bone: '#f2efe6',
  acid: '#c6ff3d',
  papaya: '#ff7a1a',
  cyan: '#3de0ff',
  pink: '#ff4fa3',
  yellow: '#ffd23d',
} as const

/** Material neon: emissive tanpa tone mapping supaya warnanya "menyala". */
function neon(color: string, intensity = 2.2) {
  return new MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    toneMapped: false,
  })
}

/**
 * Material bersama (dibuat sekali per sesi, dipakai ulang oleh semua scene).
 * Sengaja sedikit variasi agar jumlah shader program yang dikompilasi tetap kecil.
 */
export const materials = {
  graphite: new MeshPhysicalMaterial({
    color: COLORS.graphite,
    roughness: 0.3,
    metalness: 0.45,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
  }),
  matte: new MeshStandardMaterial({ color: '#131316', roughness: 0.78, metalness: 0.15 }),
  bone: new MeshStandardMaterial({ color: COLORS.bone, roughness: 0.42, metalness: 0.02 }),
  chrome: new MeshStandardMaterial({ color: '#e9e9e9', roughness: 0.14, metalness: 1 }),
  acid: new MeshStandardMaterial({ color: COLORS.acid, roughness: 0.34, metalness: 0.08 }),
  crystal: new MeshPhysicalMaterial({
    color: COLORS.acid,
    roughness: 0.08,
    metalness: 0.15,
    clearcoat: 1,
    flatShading: true,
    emissive: '#4b6510',
    emissiveIntensity: 0.4,
    iridescence: 0.7,
    iridescenceIOR: 1.5,
  }),
  visor: new MeshPhysicalMaterial({
    color: '#bfefff',
    roughness: 0.05,
    metalness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  }),
  neonAcid: neon(COLORS.acid),
  neonPapaya: neon(COLORS.papaya),
  neonCyan: neon(COLORS.cyan),
  neonPink: neon(COLORS.pink),
  neonYellow: neon(COLORS.yellow),
}

export type MaterialName = keyof typeof materials

/** Material neon yang ikut berputar warna saat easter egg RGB mode aktif. */
export const NEON_MATERIALS = [
  materials.neonAcid,
  materials.neonPapaya,
  materials.neonCyan,
  materials.neonPink,
  materials.neonYellow,
]
