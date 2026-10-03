import { useEffect, type RefObject } from 'react'
import { useFinePointer } from './useMediaQuery'

/**
 * Drag-to-scroll dengan mouse + inersia untuk container `overflow-x: auto`.
 * Sentuhan & trackpad tetap memakai scroll native (lebih halus & aksesibel).
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  const finePointer = useFinePointer()

  useEffect(() => {
    const element = ref.current
    if (!element || !finePointer) return

    let dragging = false
    let startX = 0
    let startScroll = 0
    let lastX = 0
    let lastTime = 0
    let velocity = 0
    let travelled = 0
    let frame = 0

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      cancelAnimationFrame(frame)
      dragging = true
      travelled = 0
      velocity = 0
      startX = lastX = event.clientX
      startScroll = element.scrollLeft
      lastTime = performance.now()
      element.setPointerCapture(event.pointerId)
      element.dataset.dragging = 'true'
    }

    const onMove = (event: PointerEvent) => {
      if (!dragging) return
      const dx = event.clientX - startX
      travelled = Math.max(travelled, Math.abs(dx))
      element.scrollLeft = startScroll - dx
      const now = performance.now()
      velocity = (event.clientX - lastX) / Math.max(1, now - lastTime)
      lastX = event.clientX
      lastTime = now
    }

    const onUp = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      element.releasePointerCapture(event.pointerId)
      delete element.dataset.dragging
      let speed = -velocity * 16
      const glide = () => {
        element.scrollLeft += speed
        speed *= 0.94
        if (Math.abs(speed) > 0.35) frame = requestAnimationFrame(glide)
      }
      frame = requestAnimationFrame(glide)
    }

    // Jangan memicu klik setelah drag.
    const onClickCapture = (event: MouseEvent) => {
      if (travelled > 6) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    const onDragStart = (event: DragEvent) => event.preventDefault()

    element.addEventListener('pointerdown', onDown)
    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerup', onUp)
    element.addEventListener('pointercancel', onUp)
    element.addEventListener('click', onClickCapture, true)
    element.addEventListener('dragstart', onDragStart)
    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointerdown', onDown)
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerup', onUp)
      element.removeEventListener('pointercancel', onUp)
      element.removeEventListener('click', onClickCapture, true)
      element.removeEventListener('dragstart', onDragStart)
    }
  }, [ref, finePointer])
}
