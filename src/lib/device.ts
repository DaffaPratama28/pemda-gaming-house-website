let webglSupport: boolean | undefined

/**
 * Cek dukungan WebGL sekali saja; context uji langsung dilepas.
 * `failIfMajorPerformanceCaveat` menolak renderer software (tanpa akselerasi GPU):
 * di perangkat seperti itu scene 3D pasti patah-patah, jadi situs memakai versi DOM.
 * Override untuk pengujian: `?gl=force` (paksa 3D) atau `?gl=off` (paksa fallback).
 */
export function supportsWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport
  const override = new URLSearchParams(window.location.search).get('gl')
  if (override === 'off') {
    webglSupport = false
    return webglSupport
  }
  try {
    const canvas = document.createElement('canvas')
    const options: WebGLContextAttributes = {
      failIfMajorPerformanceCaveat: override !== 'force',
    }
    const gl = canvas.getContext('webgl2', options) ?? canvas.getContext('webgl', options)
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
