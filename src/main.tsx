import { StrictMode, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import "locomotive-scroll/dist/locomotive-scroll.css"
import reportWebVitals from "./reportWebVitals"
import App from "./app/App"
import { gsap } from "gsap"

function GlobalVideoOverlay() {
  const [open, setOpen] = useState(false)
  const [src, setSrc] = useState<string>("/assets/video/trailer_video.mp4")
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrollPosRef = useRef(0)

  const handleClose = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, scaleY: 0.02, scaleX: 1.2, duration: 0.5, ease: 'power3.in', onComplete: () => setOpen(false) })
    } else {
      setOpen(false)
    }
  }

  useEffect(() => {
    ;(window as any).SVVideo = {
      open: (nextSrc?: string) => { if (nextSrc) setSrc(nextSrc); setOpen(true) },
      close: () => handleClose()
    }
  }, [])

  useEffect(() => {
    const nav = document.querySelector('.card-nav-container') as HTMLElement | null
    if (open) {
      scrollPosRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPosRef.current}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (nav) nav.style.visibility = 'hidden'

      if (overlayRef.current) {
        gsap.set(overlayRef.current, { opacity: 0, scaleY: 0.02, scaleX: 1.2, transformOrigin: '50% 50%' })
        gsap.to(overlayRef.current, { opacity: 1, scaleY: 1, scaleX: 1, duration: 0.6, ease: 'power3.out' })
      }
      if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play() }
    } else {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (nav) nav.style.visibility = ''
      window.scrollTo(0, scrollPosRef.current)
    }
  }, [open])

  if (!open) return null

  return (
    <div ref={overlayRef} className="fixed inset-0 w-screen h-screen z-[9999] bg-black overflow-hidden">
      <button onClick={handleClose} className="fixed z-[9999] top-6 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full px-4 cursor-pointer py-2">Close</button>
      <div className="h-full w-full flex items-center justify-center">
        <div className="relative w-screen h-screen md:w-[96vw] md:h-[92vh] rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 bg-black">
          <video ref={videoRef} src={src} playsInline autoPlay onEnded={handleClose} className="w-full h-full object-contain md:object-cover" />
        </div>
      </div>
    </div>
  )
}

const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App />
      <GlobalVideoOverlay />
    </StrictMode>,
  )
}

reportWebVitals()
