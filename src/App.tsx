import { useCallback, useState } from 'react'
import { Cursor } from './components/Cursor'
import { GrainOverlay } from './components/GrainOverlay'
import { Navbar } from './components/Navbar'
import { Preloader } from './components/Preloader'
import { ScrollProgress } from './components/ScrollProgress'
import { Toast } from './components/Toast'
import { useSmoothScrollSetup } from './hooks/useSmoothScroll'
import { Arsenal } from './sections/Arsenal'
import { FooterCta } from './sections/FooterCta'
import { Gallery } from './sections/Gallery'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Marquee } from './sections/Marquee'
import { Spotlight } from './sections/Spotlight'
import { Squad } from './sections/Squad'
import { Stats } from './sections/Stats'
import { TheHouse } from './sections/TheHouse'

export default function App() {
  useSmoothScrollSetup()
  const [introDone, setIntroDone] = useState(false)
  const handleIntroDone = useCallback(() => setIntroDone(true), [])

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[130] rounded-full bg-acid px-5 py-3 font-mono text-xs font-bold text-ink uppercase focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Lompat ke konten
      </a>
      <Preloader onComplete={handleIntroDone} />
      <Navbar />

      <main id="main" className="relative">
        <Hero introDone={introDone} />
        {/* Konten setelah hero naik menutupi hero yang di-pin. */}
        <div className="relative z-10 bg-ink">
          <Marquee />
          <Manifesto />
          <Squad />
          <Spotlight />
          <Arsenal />
          <TheHouse />
          <Stats />
          <Gallery />
        </div>
      </main>
      <FooterCta />

      <ScrollProgress />
      <Cursor />
      <GrainOverlay />
      <Toast />
    </>
  )
}
