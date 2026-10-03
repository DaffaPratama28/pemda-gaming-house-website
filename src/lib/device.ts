let webglSupport: boolean | undefined

/** Cek dukungan WebGL sekali saja; context uji langsung dilepas. */
export function supportsWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    webglSupport = gl !== null
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglSupport = false
  }
  return webglSupport
}

export type Quality = 'high' | 'low'

/** Tebakan kasar kemampuan perangkat untuk menurunkan kompleksitas 3D. */
export function detectQuality(): Quality {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = nav.hardwareConcurrency ?? 8
  const memory = nav.deviceMemory ?? 8
  return cores <= 4 || memory <= 4 ? 'low' : 'high'
}

/** Layout ringkas (ponsel): objek 3D dikurangi. */
export function isCompactViewport(): boolean {
  return window.matchMedia('(max-width: 767px)').matches
}

/** DPR dibatasi 1.5 agar fill-rate tetap aman; perangkat lemah dipaksa 1. */
export function maxDpr(quality: Quality): number {
  return quality === 'low' ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
}
