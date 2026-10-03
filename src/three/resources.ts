import { NoColorSpace, TextureLoader, type Texture } from 'three'

const photoCache = new Map<string, Promise<Texture>>()

/**
 * Muat tekstur foto sekali saja (dipakai bersama oleh scene hero & spotlight).
 * `NoColorSpace` = pass-through: shader menulis nilai sRGB apa adanya, persis seperti
 * `<img>` di DOM, sehingga crossfade DOM → WebGL tidak bergeser warna.
 */
export function loadPhotoTexture(src: string): Promise<Texture> {
  let promise = photoCache.get(src)
  if (!promise) {
    promise = new TextureLoader().loadAsync(src).then((texture) => {
      texture.colorSpace = NoColorSpace
      texture.anisotropy = 4
      return texture
    })
    photoCache.set(src, promise)
  }
  return promise
}

let fontsPromise: Promise<void> | null = null

/** Tekstur canvas (huruf keycap, HUD kartu) baru digambar setelah font siap. */
export function canvasFontsReady(): Promise<void> {
  fontsPromise ??= Promise.all([
    document.fonts.load('400 64px Anton'),
    document.fonts.load('700 24px "JetBrains Mono Variable"'),
    document.fonts.load('500 24px "JetBrains Mono Variable"'),
  ]).then(
    () => undefined,
    () => undefined,
  )
  return fontsPromise
}
