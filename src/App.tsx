import { useCallback, useState } from 'react'
import { Cursor } from './components/Cursor'
import { GrainOverlay } from './components/GrainOverlay'
import { Navbar } from './components/Navbar'
import { Preloader } from './components/Preloader'
import { ScrollProgress } from './components/ScrollProgress'
import { Toast } from './components/Toast'
import { useSmoothScrollSetup } from './hooks/useLenis'
import { completeTask } from './lib/loader'

export default function App() {
  useSmoothScrollSetup()
  const [introDone, setIntroDone] = useState(false)
  const handleIntroDone = useCallback(() => {
    completeTask('scene')
    setIntroDone(true)
  }, [])

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
        <section className="grid h-svh place-items-center">
          <h1 className="display-tight text-[18vw]">{introDone ? 'Ready' : 'Loading'}</h1>
        </section>
      </main>
      <ScrollProgress />
      <Cursor />
      <GrainOverlay />
      <Toast />
    </>
  )
}
