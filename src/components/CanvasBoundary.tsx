import { Component, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Dipanggil saat scene gagal (mis. WebGL context tidak bisa dibuat). */
  onError?: () => void
}

type State = { failed: boolean }

/** Error boundary untuk scene 3D: kalau WebGL gagal, situs tetap jalan dengan fallback DOM. */
export class CanvasBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('[PGH] Scene 3D dinonaktifkan, memakai fallback.', error)
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
