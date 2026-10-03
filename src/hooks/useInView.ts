import { useEffect, useState, type RefObject } from 'react'

type Options = {
  rootMargin?: string
  /** Berhenti mengamati setelah pertama kali terlihat. */
  once?: boolean
}

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = '0px', once = false }: Options = {},
): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setInView(entry.isIntersecting)
        if (once && entry.isIntersecting) observer.disconnect()
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin, once])

  return inView
}
