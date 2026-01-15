import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import AnimatedContent from '../../../anim/AnimatedContent/AnimatedContent'
import { TransitionLink } from '@/components/atoms/TransitionLink/TransitionLink'

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const videoCardRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const titleLeftRef = useRef<HTMLHeadingElement>(null)
  const titleRightRef = useRef<HTMLHeadingElement>(null)
  const shape1Ref = useRef<HTMLDivElement>(null)
  const shape2Ref = useRef<HTMLDivElement>(null)
  const shape3Ref = useRef<HTMLDivElement>(null)
  const shape4Ref = useRef<HTMLDivElement>(null)
  const shape5Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mouse movement parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!videoCardRef.current) return

      const { clientX, clientY } = e
      const xPos = (clientX / window.innerWidth - 0.5) * 2
      const yPos = (clientY / window.innerHeight - 0.5) * 2

      // Card moves opposite to mouse (stronger effect)
      gsap.to(videoCardRef.current, {
        x: -xPos * 30,
        y: -yPos * 30,
        rotationY: xPos * 5,
        rotationX: -yPos * 5,
        duration: 1,
        ease: 'power2.out'
      })

      // Text moves slightly with mouse (depth effect)
      gsap.to([titleLeftRef.current, titleRightRef.current], {
        x: xPos * 15,
        y: yPos * 15,
        duration: 1,
        ease: 'power2.out'
      })

      // Floating parallax
      gsap.to(shape1Ref.current, {
        x: xPos * 40,
        y: yPos * 40,
        rotation: xPos * 10,
        duration: 1.5,
        ease: 'power2.out'
      })
      gsap.to(shape2Ref.current, {
        x: -xPos * 25,
        y: -yPos * 25,
        duration: 1.8,
        ease: 'power2.out'
      })
      gsap.to(shape3Ref.current, {
        x: xPos * 20,
        y: -yPos * 20,
        duration: 2,
        ease: 'power2.out'
      })
      gsap.to(shape4Ref.current, {
        x: -xPos * 30,
        y: yPos * 35,
        duration: 1.7,
        ease: 'power2.out'
      })
      gsap.to(shape5Ref.current, {
        x: xPos * 18,
        y: yPos * 10,
        rotation: xPos * 6,
        duration: 1.6,
        ease: 'power2.out'
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    if (tickerRef.current) {
      const tickerContent = tickerRef.current.firstElementChild
      if (tickerContent) {
        if (!tickerRef.current.dataset.seamless) {
          const clone = tickerContent.cloneNode(true)
          tickerRef.current.appendChild(clone)
          tickerRef.current.dataset.seamless = 'true'
        }

        gsap.to(tickerRef.current, {
          xPercent: -50,
          duration: 20,
          ease: 'none',
          repeat: -1,
          force3D: true
        })
      }
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#f6f5f2] text-black flex items-center justify-center pb-10"
    >
      {/* Floating Shapes */}
      <div ref={shape1Ref} className="absolute top-[15%] left-[8%] z-0 pointer-events-none">
        <img src="/assets/images/sneakers-1.png" alt="Sneaker" className="w-[350px] rotate-[-12deg] opacity-80" />
      </div>
      <div ref={shape2Ref} className="absolute bottom-[18%] right-[12%] z-0 pointer-events-none">
        <img src="/assets/images/sneakers-4.png" alt="Sneaker" className="w-[350px] rotate-[-10deg]" />
      </div>
      <div ref={shape3Ref} className="absolute top-[47%] right-[1%] z-0 pointer-events-none">
        <img src="/assets/images/sneakers-7.png" alt="Sneaker" className="w-[160px] md:w-[200px] rotate-[22deg] opacity-60" style={{ filter: 'blur(1.5px)' }} />
      </div>
      <div ref={shape5Ref} className="absolute top-[45%] left-[10%] -translate-x-1/2 z-0 pointer-events-none">
        <img src="/assets/images/sneakers-9.png" alt="Sneaker" className="w-[120px] md:w-[160px] rotate-[6deg]" style={{ filter: 'blur(1.5px)' }} />
      </div>

      {/* 1. Tilted Marquee Background (Running diagonally) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[150vw] -rotate-12 bg-black text-white py-6 shadow-2xl origin-center translate-y-10">
          <div ref={tickerRef} className="flex whitespace-nowrap" style={{ willChange: 'transform' }}>
            <div className="flex items-center gap-12 px-6">
              {Array(4).fill("").map((_, i) => (
                <React.Fragment key={i}>
                  <span className="text-6xl font-black uppercase tracking-tighter italic">
                    Showcase ✦ Sneakers ✦ Culture ✦
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex justify-center items-end pointer-events-none z-0">
        <div className="w-[2px] h-[10%] bg-[#ff6b6b] shadow-[0_0_16px_rgba(255,107,107,0.35)]" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 90%, black 10%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 80%, black 10%)' }} />
      </div>

      {/* 2. Main Layout Layer */}
      <div className="relative z-10 w-full max-w-[1400px] h-screen flex flex-col justify-center items-center px-4">

        {/* Giant Typography Layer (Behind Card) */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <h1
            ref={titleLeftRef}
            className="absolute left-[-3vw] top-[10vh] text-[20vw] leading-[0.85] font-black tracking-tighter text-[#DADDE2]"
          >
            FUT
          </h1>
          <h1
            ref={titleRightRef}
            className="absolute right-[-3vw] bottom-[4vh] text-[20vw] leading-[0.85] font-black tracking-tighter text-[#DADDE2]"
          >
            URE
          </h1>
        </div>

        {/* Center: Video Card (Focal Point) */}
        <div className="relative z-40">

          <div ref={videoCardRef} className="relative w-[300px] md:w-[380px] aspect-[9/14] perspective-[1000px] group cursor-pointer">
            {/* Card Container */}
            <TransitionLink to="/events/detail/" label="Events Detail">
              <div className="w-full h-full mt-15 rounded-[30px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-white bg-black relative z-10 transition-all duration-500 group-hover:scale-[1.02]">
                <video
                  src="/assets/video/video_hero.mp4"
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="h-full w-full object-cover scale-110 opacity-90 group-hover:opacity-100 transition-opacity"
                />

                {/* Internal Card Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="overflow-hidden">
                    <p className="text-white text-3xl font-black uppercase tracking-tighter translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      Tokyo Summit
                    </p>
                  </div>
                  <div className="overflow-hidden delay-75">
                    <p className="text-[#ff6b6b] text-sm font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      February 2026
                    </p>
                  </div>
                </div>
              </div>
            </TransitionLink>

            {/* Decorative Elements around card */}
            <div className="absolute -top-5 -right-12 z-30">
              <AnimatedContent delay={0.5} scale={0}>
                <div className="h-24 w-24 rounded-full bg-[#ff6b6b] flex items-center justify-center shadow-lg animate-spin-slow">
                  <svg className="w-full h-full p-2 fill-current text-black" viewBox="0 0 100 100">
                    <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
                    <text className="text-[11px] font-bold uppercase tracking-widest">
                      <textPath href="#curve">
                        Official Event • Official Event •
                      </textPath>
                    </text>
                  </svg>
                  <span className="absolute text-2xl font-black">↗</span>
                </div>
              </AnimatedContent>
            </div>
          </div>

        </div>

        {/* Up Right: Description */}
        <div className="absolute top-25 -right-1 z-30 max-w-xs hidden md:block">
          <AnimatedContent direction="vertical" distance={50} delay={0.4}>
            <p className="text-sm font-medium leading-relaxed text-neutral-600 backdrop-blur-sm">
              <span className="font-bold text-black block mb-2 uppercase"> Discover your passion and sneaker community</span>
              An interactive platform for sneaker enthusiasts to share, learn, and connect with a global community.
            </p>
          </AnimatedContent>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.8s ease-in-out infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(-15%); }
          50% { transform: translateY(15%); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
