import { useSyncExternalStore } from 'react'
import { getClockSnapshot, subscribeClock } from '../lib/clock'

/** Timestamp (ms) yang ter-update tiap detik. */
export function useClock(): number {
  return useSyncExternalStore(subscribeClock, getClockSnapshot, getClockSnapshot)
}
