import {
  CubeUVReflectionMapping,
  LinearFilter,
  SRGBColorSpace,
  TextureLoader,
  type Texture,
} from 'three'
import environmentUrl from './studio-env.png?url'

let promise: Promise<Texture> | null = null

/**
 * Environment studio yang sudah dipanggang (layout CubeUV hasil PMREM).
 * Memuat PNG jauh lebih murah daripada menjalankan PMREM di browser pengunjung
 * (yang mengompilasi shader blur secara sinkron, ±600 ms di GPU integrated).
 * Generator: `scripts/bake-environment.html`. Skala HDR: lihat `ENV_SCALE`.
 */
export function loadEnvironment(): Promise<Texture> {
  promise ??= new TextureLoader().loadAsync(environmentUrl).then((texture) => {
    texture.mapping = CubeUVReflectionMapping
    texture.colorSpace = SRGBColorSpace
    texture.generateMipmaps = false
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    return texture
  })
  return promise
}
