import { useThree } from '@react-three/fiber'
import { use, useEffect } from 'react'
import { loadEnvironment } from './environment'
import { ENV_SCALE } from './environmentPanels'

type Props = {
  /** Dipanggil saat semua shader scene siap; render loop boleh mulai. */
  onWarm: () => void
}

/**
 * Pemanasan scene sebelum frame pertama:
 * 1. pasang environment yang sudah dipanggang (envMap mengubah define shader, jadi harus duluan),
 * 2. `compileAsync`: shader dikompilasi paralel di thread driver
 *    (KHR_parallel_shader_compile) alih-alih memblokir main thread di render pertama.
 * Taruh di dalam <Suspense> yang sama dengan isi scene, supaya semua material sudah ada.
 */
export function SceneWarmup({ onWarm }: Props) {
  const environment = use(loadEnvironment())
  const get = useThree((state) => state.get)

  useEffect(() => {
    let cancelled = false
    const { gl, scene, camera } = get()
    scene.environment = environment
    scene.environmentIntensity = ENV_SCALE
    const finish = () => {
      if (!cancelled) onWarm()
    }
    // Tanpa ekstensi paralel, compileAsync tetap sinkron (plus warning): render langsung saja.
    if (gl.extensions.has('KHR_parallel_shader_compile')) {
      gl.compileAsync(scene, camera).then(finish, finish)
    } else {
      queueMicrotask(finish)
    }
    return () => {
      cancelled = true
      scene.environment = null
    }
  }, [get, environment, onWarm])

  return null
}

/** Untuk frameloop `demand` (reduced motion): minta satu render saat `signal` berubah. */
export function RenderOnChange({ signal }: { signal: unknown }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    invalidate()
  }, [invalidate, signal])
  return null
}
