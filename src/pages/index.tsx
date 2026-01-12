import React, { useState, useRef, useEffect } from 'react'
import HeroSection from '@/components/organism/HeroSection/HeroSection'
import { createFileRoute } from '@tanstack/react-router'
import gsap from 'gsap'
import { createPortal } from 'react-dom'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

const creators = [
  {
    name: 'Jonatan Hermanto',
    image: '/assets/images/jonatan_image.png',
  },
  {
    name: 'Aryadi Putra',
    image:
      '/assets/images/aryadi_image.png',
  },
  {
    name: 'Fadli Anwar',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop',
  },
]

const sneakverseMemberCount = 12842

const latestNews = [
  {
    badgeA: 'Earlier Today',
    badgeB: 'New Drop',
    title: "Nike Relases Air Max 1 '86",
    subtitle: 'Variable colorway + premium materials',
    image: '/assets/images/news-1.jpeg',
  },
  {
    badgeA: 'This Week',
    badgeB: 'Community',
    title: 'Sneakverse Meetup',
    subtitle: 'Jakarta — collab, trade, and live talks',
    image: '/assets/images/news-2.jpeg',
  },
  {
    badgeA: 'Just In',
    badgeB: 'Studio',
    title: 'The evolution of modern sneaker design',
    subtitle: 'Deep‑dive the evolution of modern sneaker design',
    image: '/assets/images/news-3.jpeg',
  },
]

const toolkitTabs = ['Events', 'News/Article', 'Gallery',]

const toolkitCards = [
  {
    key: 'Gallery',
    label: 'CHECK LATEST GALLERY',
    title: 'Gallery',
    bg: '#5D5FEF',
    fg: '#ffffff',
  },
  {
    key: 'events',
    label: 'ALL EVENT HELD THIS YEAR',
    title: 'Events',
    bg: '#0f0f10',
    fg: '#ffffff',
  },
  {
    key: 'news/article',
    label: 'CHECK LATEST NEWS',
    title: 'News/Article',
    bg: '#FF6B6B',
    fg: '#0b0b0c',
  },
]

const toolkitTabToCardIndex: Record<string, number> = {
  Events: 1,
  'News/Article': 2,
  Gallery: 3,
}

const toolkitDefaultTabByCardIndex = ['Gallery', 'Events', 'News/Article']

function HomeComponent() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const creatorIndexRef = useRef(0)

  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const aboutOverlayRef = useRef<HTMLDivElement>(null)
  const aboutPanelRef = useRef<HTMLDivElement>(null)
  const aboutScrollPosRef = useRef(0)

  const [newsIndex, setNewsIndex] = useState(0)
  const newsIndexRef = useRef(0)
  const newsCardRefs = useRef<Array<HTMLDivElement | null>>([])

  const [toolkitIndex, setToolkitIndex] = useState(1)
  const toolkitIndexRef = useRef(1)
  const [activeToolkitTab, setActiveToolkitTab] = useState<string>(toolkitTabs[0])
  const toolkitCardRefs = useRef<Array<HTMLDivElement | null>>([])
  const toolkitDragRef = useRef({ down: false, startX: 0, moved: false })
  const toolkitAreaRef = useRef<HTMLDivElement>(null)
  const toolkitCursorRef = useRef<HTMLDivElement>(null)
  const toolkitCursorXTo = useRef<((value: number) => gsap.core.Tween) | null>(null)
  const toolkitCursorYTo = useRef<((value: number) => gsap.core.Tween) | null>(null)

  const animateTransition = (nextIndex: number) => {
    if (!imageRef.current || !nameRef.current) {
      setCurrentIndex(nextIndex)
      creatorIndexRef.current = nextIndex
      return
    }

    const tl = gsap.timeline()

    tl.to([imageRef.current, nameRef.current], {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.in',
      stagger: 0.1,
    })
      .call(() => {
        setCurrentIndex(nextIndex)
        creatorIndexRef.current = nextIndex
      })
      .set([imageRef.current, nameRef.current], { y: -20, opacity: 0 })
      .to([nameRef.current, imageRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
      })
  }

  useEffect(() => {
    creatorIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    const id = setInterval(() => {
      const nextIndex = (creatorIndexRef.current + 1) % creators.length
      animateTransition(nextIndex)
    }, 4000)

    return () => clearInterval(id)
  }, [])

  const setNewsPositions = (nextIndex: number, animate: boolean) => {
    const n = latestNews.length
    const wrapped = ((nextIndex % n) + n) % n

    setNewsIndex(wrapped)
    newsIndexRef.current = wrapped

    const getDiff = (i: number) => {
      let d = i - wrapped
      if (d > n / 2) d -= n
      if (d < -n / 2) d += n
      return d
    }

    newsCardRefs.current.forEach((el, i) => {
      if (!el) return

      const d = getDiff(i)
      const isActive = d === 0
      const api = animate ? gsap.to : gsap.set

      const isNext = d === 1
      const isVisible = isActive || isNext

      api(el, {
        xPercent: isActive ? 0 : isNext ? 68 : 0,
        rotateY: isActive ? 0 : isNext ? -35 : 0,
        scale: isActive ? 1 : isNext ? 0.92 : 0.92,
        z: isActive ? 0 : isNext ? -260 : -400,
        zIndex: isActive ? 3 : isNext ? 2 : 1,
        opacity: isVisible ? 1 : 0,
        filter: isActive ? 'blur(0px)' : isNext ? 'blur(1.5px)' : 'blur(3px)',
        duration: animate ? 0.9 : 0,
        ease: animate ? 'power3.inOut' : 'none',
        overwrite: 'auto',
        transformOrigin: '50% 50%',
        force3D: true,
      })
    })
  }

  useEffect(() => {
    setNewsPositions(0, false)

    const id = setInterval(() => {
      setNewsPositions(newsIndexRef.current + 1, true)
    }, 4200)

    return () => clearInterval(id)
  }, [])

  const setToolkitPositions = (nextIndex: number, animate: boolean, nextTab?: string) => {
    const n = toolkitCards.length
    const wrapped = ((nextIndex % n) + n) % n

    setToolkitIndex(wrapped)
    toolkitIndexRef.current = wrapped
    setActiveToolkitTab(nextTab ?? toolkitDefaultTabByCardIndex[wrapped] ?? toolkitTabs[0])

    const getDiff = (i: number) => {
      let d = i - wrapped
      if (d > n / 2) d -= n
      if (d < -n / 2) d += n
      return d
    }

    toolkitCardRefs.current.forEach((el, i) => {
      if (!el) return

      const d = getDiff(i)
      const isActive = d === 0
      const isLeft = d === -1
      const isRight = d === 1

      const api = animate ? gsap.to : gsap.set
      api(el, {
        x: isActive ? 0 : isLeft ? -420 : 420,
        y: isActive ? 0 : 100,
        rotation: isActive ? 0 : isLeft ? -16 : 16,
        scale: isActive ? 1 : 0.93,
        opacity: isActive || isLeft || isRight ? 1 : 0,
        zIndex: isActive ? 3 : 2,
        duration: animate ? 0.75 : 0,
        ease: animate ? 'power3.inOut' : 'none',
        overwrite: 'auto',
        transformOrigin: '50% 50%',
        force3D: true,
      })
    })
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() => setToolkitPositions(1, false))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!toolkitAreaRef.current || !toolkitCursorRef.current) return

    gsap.set(toolkitCursorRef.current, { x: 0, y: 0, autoAlpha: 0, scale: 0.9 })
    toolkitCursorXTo.current = gsap.quickTo(toolkitCursorRef.current, 'x', { duration: 0.18, ease: 'power3.out' })
    toolkitCursorYTo.current = gsap.quickTo(toolkitCursorRef.current, 'y', { duration: 0.18, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    const nav = document.querySelector('.card-nav-container') as HTMLElement | null
    if (!aboutOverlayRef.current || !aboutPanelRef.current) return

    if (isAboutOpen) {
      aboutScrollPosRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${aboutScrollPosRef.current}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (nav) nav.style.visibility = 'hidden'

      gsap.set(aboutOverlayRef.current, { display: 'block' })
      gsap.fromTo(
        aboutOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' },
      )
      gsap.fromTo(
        aboutPanelRef.current,
        { xPercent: 110 },
        { xPercent: 0, duration: 0.6, ease: 'power3.out' },
      )
      return
    }

    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    if (nav) nav.style.visibility = ''
    window.scrollTo(0, aboutScrollPosRef.current)

    gsap.to(aboutPanelRef.current, {
      xPercent: 110,
      duration: 0.45,
      ease: 'power3.in',
    })
    gsap.to(aboutOverlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        if (aboutOverlayRef.current) gsap.set(aboutOverlayRef.current, { display: 'none' })
      },
    })
  }, [isAboutOpen])

  return (
    <React.Fragment>
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={aboutOverlayRef}
            className="fixed inset-0 z-[20000] hidden bg-black/50 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setIsAboutOpen(false)
            }}
          >
            <div
              ref={aboutPanelRef}
              className="absolute right-0 top-0 z-[20001] h-full w-[92vw] sm:w-[640px] bg-[#111] text-white shadow-2xl rounded-l-[2.5rem] overflow-hidden isolate"
            >
              <div className="relative h-full overflow-y-auto overscroll-contain p-8 sm:p-10 flex flex-col">


                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">

                    <div className="font-bold tracking-wider text-sm">SNEAKVERSE</div>
                  </div>
                  <button
                    className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors px-4 sticky py-2 cursor-pointer"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    <span className="text-sm text-white/80">Close</span>
                    <span className="text-xl leading-none text-white/80">×</span>
                  </button>
                </div>

                <div className="relative mt-10">
                  <div className="text-5xl sm:text-6xl font-semibold tracking-tight leading-none">A platform by…</div>
                  <div className="mt-4 text-sm text-white/60 leading-relaxed max-w-[40ch]">
                    Built together with the Sneakverse team to bring sneaker culture closer through news, stories, and events.
                  </div>
                </div>

                <div className="relative mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {creators.map((c) => (
                    <div key={c.name} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 ring-1 ring-white/10">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-semibold leading-tight truncate">{c.name}</div>
                        <div className="text-xs text-white/50 mt-1">Sneakverse Team</div>
                        <div className="mt-3 flex items-center gap-2">
                          <a className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center" href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram">
                            <span className="text-xs font-semibold">IG</span>
                          </a>
                          <a className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center" href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn">
                            <span className="text-xs font-semibold">in</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative mt-auto pt-8">
                  <div className="h-[1px] bg-white/10" />
                  <div className="mt-6 text-sm text-white/60 leading-relaxed">
                    Sneakverse is a community platform for sneaker culture — a place for the latest drops, stories, and events.
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <div className="bg-[#f6f5f2]">
        <div className="relative z-10 bg-[#f6f5f2] shadow-2xl">
          <HeroSection />
          <section className="relative pt-24 pb-100 bg-[#f6f5f2]">
            <div className="absolute inset-0 flex justify-center pointer-events-none">
              <div className="w-[2px] h-full bg-[#ff6b6b] shadow-[0_0_16px_rgba(255,107,107,0.25)]" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)' }} />
            </div>
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
              <p
                className="text-3xl font-medium leading-relaxed"
              >
                Sneakverse is a community‑driven platform celebrating sneaker culture. Discover curated drops, deep‑dive stories, and events — made for collectors, creators, and fans. Learn, share, and connect with a global community.
              </p>
              <div className="mt-10 relative">
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[200vw]">
                  <div className="h-[1px] bg-[#ff6b6b]" />
                </div>
                <div className="relative flex justify-center">
                  <div className="relative group">
                    <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-[-80%] -translate-x-[1vw] text-5xl md:text-[9vw] font-semibold tracking-tight text-black/10 transform-gpu transition-transform duration-700 ease-out group-hover:-translate-x-[3vw]">Play</span>
                    <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-[-100%] translate-x-[1vw] text-5xl md:text-[9vw] font-semibold tracking-tight text-black/10 transform-gpu transition-transform duration-700 ease-out group-hover:translate-x-[3vw]">Trailer</span>
                    <div className="relative z-10 w-[320px] md:w-[420px] aspect-video rounded-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)] bg-black ring-1 ring-black/5 cursor-pointer" onClick={() => (window as any).SVVideo?.open('/assets/video/trailer_video.mp4')}>
                      <video src="/assets/video/trailer_video.mp4" muted playsInline preload="auto" className="w-full h-full object-cover blur-md" />
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute left-4 top-4 text-white text-xs font-semibold">Sneakverse trailer summit</span>
                      <span className="absolute right-4 top-4 text-white/80 text-xs font-medium">00:05</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Us / Updates Section */}
          <section className="relative pb-24 md:px-8 bg-[#f6f5f2] overflow-hidden">
            <div className="w-auto mx-auto mb-12">
              <div className="w-full h-[1.5px] bg-black/10" />
            </div>
            <div className="w-auto mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

              <div
                className="lg:col-span-5 relative h-[600px] bg-[#5D5FEF] rounded-3xl overflow-hidden cursor-pointer group hover:shadow-2xl transition-shadow duration-500"
              >
                {/* Content Overlay - Top Left */}
                <div className="absolute top-8 left-8 z-20 text-white select-none">
                  <div>
                    <p className="text-2xl opacity-90 mb-1" style={{ fontFamily: '"Brisa Pro", "Caveat", cursive' }}>
                      Created by
                    </p>
                  </div>
                  <div ref={nameRef}>
                    <h3 className="text-5xl md:text-6xl font-bold leading-none tracking-tight">
                      {creators[currentIndex].name.split(' ')[0]}<br />
                      <span className="text-3xl md:text-4xl font-normal opacity-80">{creators[currentIndex].name.split(' ').slice(1).join(' ')}</span>
                    </h3>
                  </div>
                </div>

                {/* Decorative Circular Ticks - Centered behind image */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <svg className="w-[120%] h-[120%] animate-[spin_60s_linear_infinite] opacity-20 text-white" viewBox="0 0 100 100">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <rect
                        key={i}
                        x="49"
                        y="2"
                        width="2"
                        height="4"
                        transform={`rotate(${i * 6} 50 50)`}
                        fill="currentColor"
                      />
                    ))}
                  </svg>
                </div>

                {/* Creator Image - Bottom Centered */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[75%] z-10 flex items-end justify-center pointer-events-none">
                  <img
                    ref={imageRef}
                    src={creators[currentIndex].image}
                    alt={creators[currentIndex].name}
                    className="w-full h-full object-cover object-top rounded-t-[3rem]"
                  />
                </div>

                {/* About Us Button - Bottom Center Overlay */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                  <button
                    className="bg-white text-black px-8 py-3 rounded-full font-medium shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 cursor-pointer transition-transform duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsAboutOpen(true)
                    }}
                  >
                    About us
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 relative h-[600px] bg-[#111] rounded-[4rem] md:rounded-[10rem] px-8 py-16 md:px-24 flex flex-col justify-between text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                <div className="flex justify-between items-start relative z-10 w-full">
                  <div className="flex flex-col gap-1">
                    <div className="mt-6">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">Members</div>
                      <div className="text-4xl font-bold leading-none">{sneakverseMemberCount.toLocaleString('en-US')}</div>
                      <div className="text-xs text-white/40 font-mono mt-2">EST. 2024 · JAKARTA, ID</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <h4 className="text-2xl md:text-3xl font-bold leading-tight">
                      Latest news<br />
                      <span className="text-white/50">from Community</span>
                    </h4>
                  </div>
                </div>

                <div className="relative z-10 w-full mt-10 overflow-hidden rounded-3xl shadow-xl border border-white/10 [perspective:1200px] isolate">
                  <div className="relative h-64 [transform-style:preserve-3d]">
                    {latestNews.map((n, i) => (
                      <div
                        key={n.title}
                        ref={(el) => {
                          newsCardRefs.current[i] = el
                        }}
                        className="absolute inset-0 transform-gpu [transform-style:preserve-3d]"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 h-64 rounded-3xl overflow-hidden">
                          <div className="bg-[#ff6b6b] text-black p-7 md:p-10 flex flex-col justify-between">
                            <div className="flex gap-2">
                              <span className="inline-block bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{n.badgeA}</span>
                              <span className="inline-block border border-black/20 text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{n.badgeB}</span>
                            </div>
                            <div>
                              <h5 className="text-3xl font-bold leading-none tracking-tight">{n.title}</h5>
                              <p className="mt-2 text-sm font-medium opacity-70">{n.subtitle}</p>
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-60">Latest update</div>
                          </div>

                          <div className="bg-[#F3F0E6] relative overflow-hidden">
                            <img
                              src={n.image}
                              alt={n.title}
                              className="w-full h-full object-cover"
                              draggable={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/0 via-black/0 to-black/10 pointer-events-none" />
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#FF6B6B] rounded-full blur-2xl opacity-20 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-none">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${newsIndex === i ? 'h-8 bg-white/80' : 'h-2 bg-white/20'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative py-24 bg-[#f6f5f2] overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center">
                <h2 className="text-[50px] md:text-7xl font-semibold tracking-tight leading-[0.95] text-black">
                  One place for<br />
                  everything sneakers
                </h2>
                <p className="mt-6 text-sm md:text-base text-black/60">
                  Sneakverse combines events, news/articles, and galleries into a single community website.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center">
                  {toolkitTabs.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`px-4 py-2 text-[14px] font-medium cursor-pointer transition-all duration-300 ${activeToolkitTab === t ? 'bg-black text-white rounded-full' : 'bg-white text-black/70 hover:text-black'
                        }`}
                      onClick={() => {
                        const target = toolkitTabToCardIndex[t] ?? toolkitIndexRef.current
                        setToolkitPositions(target, true, t)
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div
                ref={toolkitAreaRef}
                className="relative h-[600px] select-none cursor-none mt-10"
                onPointerEnter={(e) => {
                  if (e.pointerType !== 'mouse') return
                  if (!toolkitCursorRef.current) return
                  gsap.to(toolkitCursorRef.current, { autoAlpha: 1, scale: 1, duration: 0.15, ease: 'power2.out' })
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== 'mouse') return
                  toolkitDragRef.current.down = false
                  toolkitDragRef.current.moved = false
                  if (!toolkitCursorRef.current) return
                  gsap.to(toolkitCursorRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.15, ease: 'power2.in' })
                }}
                onPointerDown={(e) => {
                  toolkitDragRef.current.down = true
                  toolkitDragRef.current.startX = e.clientX
                  toolkitDragRef.current.moved = false
                    ; (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
                }}
                onPointerMove={(e) => {
                  if (e.pointerType === 'mouse') {
                    const rect = toolkitAreaRef.current?.getBoundingClientRect()
                    if (rect) {
                      toolkitCursorXTo.current?.(e.clientX - rect.left)
                      toolkitCursorYTo.current?.(e.clientY - rect.top)
                    }
                  }

                  if (!toolkitDragRef.current.down || toolkitDragRef.current.moved) return
                  const dx = e.clientX - toolkitDragRef.current.startX
                  if (Math.abs(dx) < 70) return
                  toolkitDragRef.current.moved = true
                  setToolkitPositions(toolkitIndexRef.current + (dx < 0 ? 1 : -1), true)
                }}
                onPointerUp={() => {
                  toolkitDragRef.current.down = false
                  toolkitDragRef.current.moved = false
                }}
                onPointerCancel={() => {
                  toolkitDragRef.current.down = false
                  toolkitDragRef.current.moved = false
                }}
              >
                <img
                  src="/assets/images/sneakers-1.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute left-[-160px] bottom-[-120px] w-[520px] max-w-none rotate-[-18deg] opacity-90 drop-shadow-[0_40px_80px_rgba(0,0,0,0.18)]"
                  draggable={false}
                />
                <img
                  src="/assets/images/sneakers-4.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute right-[-190px] bottom-[-140px] w-[560px] max-w-none rotate-[20deg] opacity-90 drop-shadow-[0_40px_80px_rgba(0,0,0,0.18)]"
                  draggable={false}
                />

                <div
                  ref={toolkitCursorRef}
                  className="pointer-events-none z-9999 absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium shadow-lg">
                    Drag
                  </div>
                </div>

                <svg className="absolute left-1/2 -translate-x-1/2 w-[120%] max-w-[1100px] opacity-30" viewBox="0 0 1000 220" fill="none">
                  <path d="M40 190 C 260 40, 740 40, 960 190" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
                </svg>

                <div className="absolute left-1/2 top-[5%] -translate-x-1/2 -translate-y-1/2 w-full [perspective:1400px]">
                  <div className="relative mx-auto w-full flex items-center justify-center [transform-style:preserve-3d]">
                    {toolkitCards.map((c, i) => (
                      <div
                        key={c.key}
                        ref={(el) => {
                          toolkitCardRefs.current[i] = el
                        }}
                        className="absolute left-1/2 top-0 -translate-x-1/2 w-[280px] h-[380px] sm:w-[320px] sm:h-[430px] md:w-[360px] md:h-[480px] rounded-3xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.35)] overflow-hidden"
                        style={{ backgroundColor: c.bg, color: c.fg }}
                      >
                        <div className="h-full p-6 flex flex-col">
                          <div className="text-[9px] font-bold uppercase tracking-[0.22em] opacity-70">
                            {c.label}
                          </div>

                          <div className="mt-6 flex items-start justify-between gap-4">
                            <div className="text-4xl font-semibold tracking-tight leading-none">
                              {c.title}
                            </div>
                          </div>

                          {c.key === 'events' ? (
                            <>
                              <div className="mt-4 text-sm opacity-75">
                                The main feature is to track every release event in the near future.
                              </div>
                              <div className="mt-8 flex-1 rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
                                <img src="/assets/images/events-image-card.webp" className='w-full h-full object-cover' />
                              </div>
                            </>
                          ) : c.key === 'news/article' ? (
                            <>
                              <div className="mt-4 text-sm opacity-80">
                                A space to read trusted news and articles from Sneakverse.
                              </div>
                              <div className="mt-8 flex-1 rounded-full bg-white/5 ring-1 ring-white/10 overflow-hidden">
                                <img src="/assets/images/news-image-card.webp" className='w-full h-full' />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mt-4 text-sm opacity-75">
                                Gallery area for showing off: sneakers, events, and gatherings
                              </div>
                              <div className="mt-8 flex-1 rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
                                <img src="/assets/images/gallery-image-card.webp" className='w-full h-full object-cover' />
                              </div>
                            </>
                          )}

                          <div className="mt-6">
                            <button
                              type="button"
                              className={`w-fit px-5 py-2 rounded-full text-sm cursor-pointer font-medium ${c.key === 'vault' ? 'bg-white text-black' : 'bg-white/90 text-black'
                                }`}
                            >
                              Discover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>
    </React.Fragment>
  )
}