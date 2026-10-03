import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three'
import { COLORS } from './materials'

/**
 * Tekstur prosedural berbasis Canvas 2D (tanpa file aset eksternal).
 * Semua di-cache per kunci: dibuat sekali, dipakai ulang lintas scene.
 */

export type CardHud = {
  name: string
  number: string
  role: string
  rank: string
  level: number
}

const DISPLAY = 'Anton, Impact, sans-serif'
const MONO = '"JetBrains Mono Variable", ui-monospace, monospace'

type Context = CanvasRenderingContext2D & { letterSpacing?: string }

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d') as Context | null
  if (!context) throw new Error('Canvas 2D tidak tersedia')
  return { canvas, context }
}

function finalize(canvas: HTMLCanvasElement, { pixel = false } = {}) {
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  if (pixel) {
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    texture.generateMipmaps = false
  } else {
    texture.anisotropy = 4
  }
  return texture
}

const cache = new Map<string, CanvasTexture>()

function memo(key: string, create: () => CanvasTexture): CanvasTexture {
  let texture = cache.get(key)
  if (!texture) {
    texture = create()
    cache.set(key, texture)
  }
  return texture
}

function spacing(context: Context, value: string) {
  if ('letterSpacing' in context) context.letterSpacing = value
}

function roundedRect(
  context: Context,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.arcTo(x + width, y, x + width, y + height, radius)
  context.arcTo(x + width, y + height, x, y + height, radius)
  context.arcTo(x, y + height, x, y, radius)
  context.arcTo(x, y, x + width, y, radius)
  context.closePath()
}

/** PRNG deterministik (mulberry32): variasi "acak" yang sama di tiap render. */
export function seeded(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Halo radial untuk sprite glow aditif (pengganti bloom yang jauh lebih ringan). */
export function glowTexture() {
  return memo('glow', () => {
    const { canvas, context } = createCanvas(128, 128)
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.22, 'rgba(255,255,255,0.5)')
    gradient.addColorStop(0.55, 'rgba(255,255,255,0.09)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
    return finalize(canvas)
  })
}

/** Huruf/teks transparan untuk permukaan keycap. */
export function glyphTexture(text: string, color: string) {
  return memo(`glyph:${text}:${color}`, () => {
    const size = 256
    const { canvas, context } = createCanvas(size, size)
    const fontSize = text.length > 1 ? 118 : 168
    context.fillStyle = color
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = `400 ${fontSize}px ${DISPLAY}`
    context.fillText(text, size / 2, size / 2 + fontSize * 0.04)
    return finalize(canvas)
  })
}

/** Muka dadu inisial anggota. Label '★' digambar sebagai bintang empat sudut. */
export function diceFaceTexture(label: string, accent: string) {
  return memo(`dice:${label}:${accent}`, () => {
    const size = 256
    const { canvas, context } = createCanvas(size, size)
    context.fillStyle = '#17171b'
    context.fillRect(0, 0, size, size)
    context.strokeStyle = 'rgba(242,239,230,0.16)'
    context.lineWidth = 12
    context.strokeRect(6, 6, size - 12, size - 12)
    context.strokeStyle = accent
    context.lineWidth = 4
    roundedRect(context, 28, 28, size - 56, size - 56, 26)
    context.stroke()

    context.fillStyle = accent
    if (label === '★') {
      const c = size / 2
      context.beginPath()
      context.moveTo(c, c - 76)
      context.lineTo(c + 16, c - 16)
      context.lineTo(c + 76, c)
      context.lineTo(c + 16, c + 16)
      context.lineTo(c, c + 76)
      context.lineTo(c - 16, c + 16)
      context.lineTo(c - 76, c)
      context.lineTo(c - 16, c - 16)
      context.closePath()
      context.fill()
    } else {
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = `400 ${label.length > 1 ? 112 : 150}px ${DISPLAY}`
      context.fillText(label, size / 2, size / 2 + 6)
    }
    return finalize(canvas)
  })
}

/** Emblem koin "PGH". */
export function coinFaceTexture() {
  return memo('coin', () => {
    const size = 256
    const c = size / 2
    const { canvas, context } = createCanvas(size, size)
    context.fillStyle = '#1d1d22'
    context.fillRect(0, 0, size, size)
    context.strokeStyle = COLORS.acid
    context.lineWidth = 7
    context.beginPath()
    context.arc(c, c, 106, 0, Math.PI * 2)
    context.stroke()
    context.lineWidth = 2
    context.setLineDash([5, 9])
    context.beginPath()
    context.arc(c, c, 90, 0, Math.PI * 2)
    context.stroke()
    context.setLineDash([])
    context.fillStyle = COLORS.acid
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = `400 88px ${DISPLAY}`
    context.fillText('PGH', c, c + 5)
    return finalize(canvas)
  })
}

/** Panel peti loot: pelat logam, pita hazard, stensil. */
export function crateTexture() {
  return memo('crate', () => {
    const size = 256
    const { canvas, context } = createCanvas(size, size)
    context.fillStyle = '#25252b'
    context.fillRect(0, 0, size, size)
    context.save()
    context.beginPath()
    context.rect(0, 96, size, 64)
    context.clip()
    for (let x = -size; x < size * 2; x += 36) {
      context.fillStyle = COLORS.papaya
      context.beginPath()
      context.moveTo(x, 96)
      context.lineTo(x + 18, 96)
      context.lineTo(x + 18 + 64, 160)
      context.lineTo(x + 64, 160)
      context.closePath()
      context.fill()
    }
    context.restore()
    context.strokeStyle = 'rgba(242,239,230,0.14)'
    context.lineWidth = 3
    context.strokeRect(14, 14, size - 28, size - 28)
    context.fillStyle = 'rgba(242,239,230,0.75)'
    spacing(context, '4px')
    context.font = `700 22px ${MONO}`
    context.textAlign = 'center'
    context.fillText('LOOT // 05', size / 2, 62)
    context.fillStyle = 'rgba(242,239,230,0.4)'
    context.font = `500 14px ${MONO}`
    context.fillText('JALUR 1 SUPPLY', size / 2, 206)
    return finalize(canvas)
  })
}

type PixelKind = 'grass-top' | 'grass-side' | 'dirt'

/** Pixel art 16x16 ala blok tanah berumput (filter nearest agar tetap tajam). */
export function pixelTexture(kind: PixelKind) {
  return memo(`pixel:${kind}`, () => {
    const { canvas, context } = createCanvas(16, 16)
    const random = seeded(kind === 'dirt' ? 7 : kind === 'grass-top' ? 13 : 29)
    const greens = ['#9fd630', '#b6ef3a', '#8bc12a', '#c6ff3d', '#7aa923']
    const dirts = ['#7a4e2e', '#8a5a36', '#6b4428', '#9b6a42', '#5a3921']
    for (let x = 0; x < 16; x += 1) {
      const drip = kind === 'grass-side' ? 3 + Math.floor(random() * 3) : 0
      for (let y = 0; y < 16; y += 1) {
        const palette = kind === 'grass-top' || y < drip ? greens : dirts
        context.fillStyle = palette[Math.floor(random() * palette.length)] ?? '#000'
        context.fillRect(x, y, 1, 1)
      }
    }
    return finalize(canvas, { pixel: true })
  })
}

/**
 * Overlay HUD kartu pemain (transparan), digambar setinggi 1024px.
 * Banner bawah opaque menutup porsi `banner` dari tinggi kartu.
 */
export function cardHudTexture(hud: CardHud, banner: number) {
  return memo(`hud:${hud.name}:${hud.level}:${banner}`, () => {
    const width = 768
    const height = 1024
    const radius = 36
    const { canvas, context } = createCanvas(width, height)

    context.save()
    roundedRect(context, 0, 0, width, height, radius)
    context.clip()

    const shade = context.createLinearGradient(0, 0, 0, 230)
    shade.addColorStop(0, 'rgba(10,10,10,0.55)')
    shade.addColorStop(1, 'rgba(10,10,10,0)')
    context.fillStyle = shade
    context.fillRect(0, 0, width, 230)

    const bannerHeight = Math.ceil(height * banner) + 2
    const bannerTop = height - bannerHeight
    const middle = bannerTop + bannerHeight / 2
    context.fillStyle = COLORS.ink
    context.fillRect(0, bannerTop, width, bannerHeight)
    context.fillStyle = COLORS.acid
    context.fillRect(0, bannerTop, width, 5)

    context.fillStyle = COLORS.bone
    context.font = `400 80px ${DISPLAY}`
    context.textAlign = 'left'
    context.textBaseline = 'middle'
    context.fillText(hud.name.toUpperCase(), 46, middle + 4)

    spacing(context, '3px')
    context.textAlign = 'right'
    context.font = `700 19px ${MONO}`
    context.fillStyle = COLORS.acid
    context.fillText(hud.role.toUpperCase(), width - 46, middle - 13)
    context.font = `500 17px ${MONO}`
    context.fillStyle = 'rgba(242,239,230,0.72)'
    context.fillText(hud.rank.toUpperCase(), width - 46, middle + 16)
    context.restore()

    context.strokeStyle = 'rgba(242,239,230,0.26)'
    context.lineWidth = 3
    roundedRect(context, 1.5, 1.5, width - 3, height - 3, radius - 1.5)
    context.stroke()

    context.strokeStyle = COLORS.acid
    context.lineWidth = 6
    context.lineCap = 'square'
    const inset = 28
    const arm = 46
    const corners: Array<[number, number, number, number]> = [
      [inset, inset, 1, 1],
      [width - inset, inset, -1, 1],
      [inset, height - inset, 1, -1],
      [width - inset, height - inset, -1, -1],
    ]
    for (const [x, y, dx, dy] of corners) {
      context.beginPath()
      context.moveTo(x + arm * dx, y)
      context.lineTo(x, y)
      context.lineTo(x, y + arm * dy)
      context.stroke()
    }

    spacing(context, '2px')
    context.font = `700 22px ${MONO}`
    const tag = `PLAYER ${hud.number}/05`
    const tagWidth = context.measureText(tag).width
    context.fillStyle = COLORS.acid
    context.fillRect(50, 56, tagWidth + 28, 42)
    context.fillStyle = COLORS.ink
    context.textAlign = 'left'
    context.textBaseline = 'middle'
    context.fillText(tag, 64, 78)

    spacing(context, '0px')
    context.font = `400 66px ${DISPLAY}`
    context.fillStyle = COLORS.bone
    context.textAlign = 'right'
    context.textBaseline = 'top'
    context.fillText(`LV.${hud.level}`, width - 52, 44)

    context.save()
    context.translate(38, height * 0.5)
    context.rotate(-Math.PI / 2)
    spacing(context, '4px')
    context.font = `500 15px ${MONO}`
    context.fillStyle = 'rgba(242,239,230,0.55)'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText('PEMDA GAMING HOUSE // SEASON 01', 0, 0)
    context.restore()

    context.strokeStyle = 'rgba(242,239,230,0.38)'
    context.lineWidth = 2
    for (let index = 0; index < 9; index += 1) {
      const y = height * 0.3 + index * 22
      context.beginPath()
      context.moveTo(width - 34, y)
      context.lineTo(width - (index % 4 === 0 ? 54 : 44), y)
      context.stroke()
    }

    return finalize(canvas)
  })
}
