/**
 * Generator environment map untuk development (bukan bagian dari bundle produksi).
 * Merender panel cahaya → PMREM (layout CubeUV) → PNG sRGB dengan skala 1/ENV_SCALE.
 */
import {
  Color,
  DataUtils,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PMREMGenerator,
  RingGeometry,
  Scene,
  WebGLRenderer,
} from 'three'
import { ENV_BACKGROUND, ENV_PANELS, ENV_SCALE, ENV_SIZE } from '../src/three/environmentPanels'

declare global {
  interface Window {
    __ENV_PNG__?: string
  }
}

const status = document.getElementById('status')
const preview = document.getElementById('preview')
const download = document.getElementById('download')

const renderer = new WebGLRenderer()
const scene = new Scene()
scene.background = new Color(ENV_BACKGROUND)

for (const panel of ENV_PANELS) {
  const geometry = panel.form === 'ring' ? new RingGeometry(0.5, 1, 64) : new PlaneGeometry(1, 1)
  const material = new MeshBasicMaterial({
    color: new Color(panel.color).multiplyScalar(panel.intensity),
    side: DoubleSide,
    toneMapped: false,
  })
  const mesh = new Mesh(geometry, material)
  mesh.position.set(...panel.position)
  mesh.scale.set(panel.scale[0], panel.scale[1], 1)
  mesh.lookAt(0, 0, 0)
  scene.add(mesh)
}

const generator = new PMREMGenerator(renderer)
const target = generator.fromScene(scene, 0.04, 0.1, 100, { size: ENV_SIZE })
const { width, height } = target
const raw = new Uint16Array(width * height * 4)
renderer.readRenderTargetPixels(target, 0, 0, width, height, raw)

const encode = (linear: number) => {
  const value = Math.min(1, Math.max(0, linear / ENV_SCALE))
  const srgb = value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055
  return Math.round(srgb * 255)
}

const canvas = document.createElement('canvas')
canvas.width = width
canvas.height = height
const context = canvas.getContext('2d')
if (!context) throw new Error('Canvas 2D tidak tersedia')
const image = context.createImageData(width, height)

// readPixels berurutan bawah→atas; PNG atas→bawah (dibalik lagi oleh flipY saat dimuat).
for (let y = 0; y < height; y += 1) {
  const source = (height - 1 - y) * width * 4
  const destination = y * width * 4
  for (let x = 0; x < width * 4; x += 4) {
    for (let channel = 0; channel < 3; channel += 1) {
      image.data[destination + x + channel] = encode(
        DataUtils.fromHalfFloat(raw[source + x + channel] ?? 0),
      )
    }
    image.data[destination + x + 3] = 255
  }
}
context.putImageData(image, 0, 0)

const url = canvas.toDataURL('image/png')
window.__ENV_PNG__ = url
if (preview instanceof HTMLImageElement) preview.src = url
if (download instanceof HTMLAnchorElement) download.href = url
if (status)
  status.textContent = `Selesai: ${width}×${height}px (size ${ENV_SIZE}, scale ${ENV_SCALE})`
