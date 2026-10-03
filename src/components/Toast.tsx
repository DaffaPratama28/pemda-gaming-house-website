import { useEffect, useState } from 'react'
import { TOAST_EVENT } from '../lib/easterEgg'

/** Notifikasi kecil (easter egg, nomor antrian). Diumumkan ke pembaca layar. */
export function Toast() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let timer = 0
    const onToast = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== 'string') return
      setMessage(event.detail)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setMessage(null), 3800)
    }
    window.addEventListener(TOAST_EVENT, onToast)
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[110] flex justify-center px-4"
    >
      {message && (
        <p
          key={message}
          className="toast-in rounded-full bg-acid px-5 py-3 text-center font-mono text-[0.7rem] font-bold tracking-[0.14em] text-ink uppercase shadow-[0_0_48px_rgb(198_255_61/0.45)]"
        >
          {message}
        </p>
      )}
    </div>
  )
}
