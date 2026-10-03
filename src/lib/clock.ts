/** Store jam yang berdetak tiap detik, hanya aktif selama ada pelanggan. */
let now = Date.now()
let timer = 0
const listeners = new Set<() => void>()

function tick() {
  now = Date.now()
  listeners.forEach((listener) => listener())
}

export function subscribeClock(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) {
    tick()
    timer = window.setInterval(tick, 1000)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.clearInterval(timer)
  }
}

export const getClockSnapshot = () => now

/** Format jam di zona waktu tertentu, aman bila Intl tidak kenal zonanya. */
export function formatTimeParts(timestamp: number, timeZone: string) {
  let formatter: Intl.DateTimeFormat
  try {
    formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
  } catch {
    formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
  }
  const parts = formatter.formatToParts(new Date(timestamp))
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '00'
  return { hours: get('hour'), minutes: get('minute'), seconds: get('second') }
}
