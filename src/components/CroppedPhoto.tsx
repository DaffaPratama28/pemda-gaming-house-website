import type { ReactNode } from 'react'
import type { Photo } from '../data/content'
import { cn } from '../lib/cn'
import { cropStyle } from '../lib/photo'

type Props = {
  photo: Photo
  /** Rasio frame (lebar / tinggi). */
  aspect: number
  className?: string
  /** Muat segera (foto di atas lipatan). */
  priority?: boolean
  /** Isi banner bawah. Tingginya minimal `photo.crop.banner` dari frame. */
  banner?: ReactNode
  bannerClassName?: string
}

/** Foto dengan crop konsisten (lib/photo) + banner bawah yang selalu menutup area dagu. */
export function CroppedPhoto({
  photo,
  aspect,
  className,
  priority,
  banner,
  bannerClassName,
}: Props) {
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ aspectRatio: aspect }}>
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        style={cropStyle(photo, aspect)}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        className="select-none"
      />
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 flex items-center border-t-2 border-acid bg-ink',
          bannerClassName,
        )}
        style={{ minHeight: `${photo.crop.banner * 100}%` }}
      >
        {banner}
      </div>
    </div>
  )
}
