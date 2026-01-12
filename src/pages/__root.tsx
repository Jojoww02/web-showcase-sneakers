import { createRootRoute, useRouterState } from '@tanstack/react-router'

import Loader from '../components/templates/Loader/Loader'
import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import Header from '@/components/templates/Header/Header'
import Footer from '@/components/templates/Footer/Footer'
import AnimatedRoutes from './animatedRoutes'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function useWindowSize() {
  const [width, setWidth] = React.useState<number>(window.innerWidth)

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

function RootComponent() {
  const [scrollContainer, setScrollContainer] = React.useState<HTMLElement | null>(null)
  const locoScrollRef = React.useRef<LocomotiveScroll | null>(null)
  const isOverlayAnimating = React.useRef(false)
  const routerState = useRouterState()

  const [isLoading, setIsLoading] = React.useState(() => {
    if (typeof window === 'undefined') return true
    const hasSeenIntro = window.sessionStorage.getItem('hasSeenIntroLoader') === 'true'
    return !hasSeenIntro
  })

  React.useEffect(() => {
    if (!isLoading) return
    if (typeof window === 'undefined') return
  }, [isLoading])

  const width = useWindowSize()
  const isMobile = width < 1300
  const is404 = routerState.matches.some((match: any) => match.status === 'notFound' || match.globalNotFound)

  React.useEffect(() => {
    if (isLoading || isMobile || !scrollContainer) return

    locoScrollRef.current = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      multiplier: 1,
      lerp: 0.05,
      reloadOnContextChange: true,
    })

    locoScrollRef.current.on('scroll', (args: any) => {
      window.dispatchEvent(new CustomEvent('loco-scroll', { detail: args }))
    })

    return () => {
      locoScrollRef.current?.destroy()
      locoScrollRef.current = null
    }
  }, [isLoading, isMobile, scrollContainer])

  React.useEffect(() => {
    if (locoScrollRef.current) {
      if (isOverlayAnimating.current) return
      const timer = setTimeout(() => {
        locoScrollRef.current?.update()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [routerState.location.href, isLoading])

  React.useEffect(() => {
    const overlay = document.getElementById('page-transition')
    if (!overlay) return

    const rect = overlay.getBoundingClientRect()
    const isCoveringScreen = rect.top < window.innerHeight / 2
    if (!isCoveringScreen) return

    isOverlayAnimating.current = true

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gsap.to('#page-transition', {
          y: '-100%',
          duration: 1.0,
          ease: 'power4.inOut',
          delay: 0.1,
          force3D: true,
          onComplete: () => {
            gsap.set('#page-transition-text', { opacity: 0, y: 50 })
            isOverlayAnimating.current = false
            locoScrollRef.current?.update()
          }
        })
      })
    })
  }, [routerState.location.href])

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center p-6">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4">⚠️ Not Supported</h1>
          <p className="text-gray-600">
            Sorry, this website is not optimized for mobile or tablet devices.
            Please access it using a desktop or larger screen.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        id="page-transition"
        className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center translate-y-full will-change-transform"
        style={{ transform: 'translateY(100%)', contain: 'layout paint', backfaceVisibility: 'hidden' }}
      >
        <div className="absolute inset-0 bg-black w-full h-full">
           <svg 
             className="absolute bottom-full left-0 w-full h-[15vh] fill-black" 
             preserveAspectRatio="none" 
             viewBox="0 0 1440 320"
             style={{ marginBottom: '-1px' }}
           >
              <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
           </svg>
        </div>
        <div className="relative z-10 overflow-hidden">
          <h1 
            id="page-transition-text" 
            className="text-white text-6xl md:text-9xl font-black uppercase tracking-tighter opacity-0 translate-y-8"
            style={{
              fontFamily: '"Compressa VF", sans-serif',
              fontVariationSettings: '"wght" 900, "wdth" 100, "ital" 0'
            }}
          >
          </h1>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader
            key="loader"
            onFinish={() => {
              setIsLoading(false)
              window.sessionStorage.setItem('hasSeenIntroLoader', 'true')
            }}
          />
        ) : (
          <>
            {!is404 && <Header />}
            <main
              id="scroll-container"
              className="relative z-20 min-h-screen bg-transparent"
              data-scroll-container
              ref={setScrollContainer}
            >
              <div id="content-wrapper" className="relative bg-black">
                <AnimatedRoutes />
              </div>
              {!is404 && <Footer />}
            </main>
          </>
        )}
      </AnimatePresence>
    </>
  )
}