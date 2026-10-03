import 'react'

declare module 'react' {
  interface CSSProperties {
    /** Izinkan CSS custom properties (mis. `--accent`) di prop `style`. */
    [key: `--${string}`]: string | number | undefined
  }
}
