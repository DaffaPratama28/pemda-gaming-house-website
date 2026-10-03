import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/anton/latin-400.css'
import '@fontsource-variable/space-grotesk/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import 'lenis/dist/lenis.css'
import './styles/index.css'
import App from './App'

// Intro & animasi berbasis scroll selalu dimulai dari atas.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

const container = document.getElementById('root')
if (!container) throw new Error('Elemen #root tidak ditemukan di index.html')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
