import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import AnimatedContent from '@/anim/AnimatedContent/AnimatedContent'
import { LayoutGrid, Grid3X3, PencilLine } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useGetApiArticles } from '@/gen/sneakverse/hooks/useGetApiArticles'

export const Route = createFileRoute('/news/')({
    component: News,
})


function News() {
    const [view, setView] = useState<'large' | 'small'>('large')
    const token = useUserStore(s => s.token)
    const navigate = useNavigate()
    const { data, isLoading, isError } = useGetApiArticles({}, {
        query: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: true
        }
    })
    const tileRefs = useRef<HTMLDivElement[]>([])
    const bubbleRefs = useRef<HTMLDivElement[]>([])
    const bubbleVelocityRefs = useRef<{ x: number; y: number }[]>([])
    const flipStateRef = useRef<any>(null)
    const animateViewChange = (next: 'large' | 'small') => {
        const els = tileRefs.current.filter(Boolean)
        if (els.length === 0) { setView(next); return }
        flipStateRef.current = Flip.getState(els)
        setView(next)
    }

    useLayoutEffect(() => {
        if (flipStateRef.current) {
            Flip.from(flipStateRef.current, {
                duration: 0.7,
                ease: 'power3.inOut',
                stagger: 0.05,
                absolute: false,
                nested: true,
                onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }),
                onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3, ease: 'power2.in' }),
            })
            flipStateRef.current = null
        }
    }, [view])

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, Flip)
        tileRefs.current.forEach((el, index) => {
            if (!el) return
            gsap.fromTo(
                el,
                { y: 32, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    delay: index * 0.08,
                }
            )
        })
    }, [])

    const rawArticles = Array.isArray(data) ? data : (data as any)?.items ?? []
    const articles = rawArticles.map((article: any, index: number) => {
        const idRaw = article.id ?? article.Id ?? article.articleId ?? article.ArticleId
        const id = typeof idRaw === 'number' ? idRaw : idRaw ? Number(idRaw) : undefined
        const title = article.title ?? article.Title ?? `Untitled article ${index + 1}`
        const image =
            article.thumbnailUrl ??
            article.ThumbnailUrl ??
            article.thumbnail ??
            article.Thumbnail ??
            '/assets/images/news-1.jpeg'
        const minutes =
            article.minutes ??
            article.Minutes ??
            article.readingTime ??
            article.ReadingTime ??
            5
        const dateSource =
            article.createdAt ??
            article.CreatedAt ??
            article.publishedAt ??
            article.PublishedAt ??
            article.date ??
            article.Date
        const date = dateSource ? new Date(dateSource).toLocaleDateString('en-GB') : '-'

        return { id, title, image, minutes, date }
    })

    const gridClass = view === 'large' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14' : 'grid-cols-2 lg:grid-cols-4 gap-6'
    const tileClass = view === 'large' ? 'h-[400px] sm:h-[500px]' : 'h-[250px] sm:h-[300px]'

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="px-[5vw] pt-16 pb-6">
                <AnimatedContent
                    distance={80}
                    duration={0.9}
                    ease="power3.out"
                    threshold={0.3}
                    className="my-10"
                >
                    <div className="text-center">
                        <h1 className="text-[clamp(3rem,5vw,6rem)] font-semibold tracking-tight text-black leading-[0.95]">
                            News, thoughts, and everything in between
                        </h1>
                        <p className="mt-4 text-center max-w-2xl mx-auto text-sm md:text-base text-black/60">
                            Explore our latest insights, stories, and perspectives on community, sneaker culture, and growth.
                        </p>
                    </div>
                </AnimatedContent>

                <div className="mt-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => animateViewChange('large')}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm md:text-base font-medium ${view === 'large' ? 'bg-black text-white' : 'bg-black/5 text-black'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span>Large view</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => animateViewChange('small')}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm md:text-base font-medium ${view === 'small' ? 'bg-black text-white' : 'bg-black/5 text-black'}`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                            <span>Small view</span>
                        </button>
                    </div>
                    {token && (
                        <button
                            type="button"
                            onClick={() => navigate({ to: '/news/create-news/' })}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm md:text-base font-medium bg-[#ff6b6b] text-white shadow-[0_10px_24px_-8px_rgba(255,107,107,0.6)] hover:brightness-105 transition"
                        >
                            <PencilLine />
                            <span>Upload news</span>
                        </button>
                    )}
                </div>

                <div className={`mt-10 grid ${gridClass}`}>
                    {isLoading && (
                        <div className="col-span-full text-center text-sm text-black/60">
                            Loading articles...
                        </div>
                    )}
                    {isError && !isLoading && (
                        <div className="col-span-full text-center text-sm text-red-500">
                            Failed to load articles.
                        </div>
                    )}
                    {!isLoading && !isError && articles.map((item: { id?: number; title: string; image: string; minutes: number; date: string }, i: number) => (
                        <div
                            key={item.title}
                            ref={(el) => { if (el) tileRefs.current[i] = el }}
                            className="group cursor-pointer"
                            onClick={() => {
                                if (item.id != null) {
                                    navigate({ to: '/news/detail-news/', search: { id: item.id } })
                                } else {
                                    navigate({ to: '/news/detail-news/' })
                                }
                            }}
                        >
                            <div
                                className={`relative w-full rounded-3xl bg-[#111] ${tileClass} overflow-hidden`}
                                onMouseEnter={(e) => {
                                    const b = bubbleRefs.current[i]
                                    if (!b) return
                                    gsap.killTweensOf(b)
                                    const rect = e.currentTarget.getBoundingClientRect()
                                    const x = e.clientX - rect.left
                                    const y = e.clientY - rect.top
                                    bubbleVelocityRefs.current[i] = { x, y }
                                    gsap.set(b, { x: x - 48, y: y - 48, scaleX: 1, scaleY: 1, rotation: 0, autoAlpha: 1 })
                                    gsap.fromTo(b, { scale: 0.85 }, { scale: 1, duration: 0.25, ease: 'power3.out' })
                                }}
                                onMouseMove={(e) => {
                                    const b = bubbleRefs.current[i]
                                    if (!b) return
                                    const rect = e.currentTarget.getBoundingClientRect()
                                    const x = e.clientX - rect.left
                                    const y = e.clientY - rect.top
                                    const last = bubbleVelocityRefs.current[i] || { x, y }
                                    const dx = x - last.x
                                    const dy = y - last.y
                                    bubbleVelocityRefs.current[i] = { x, y }
                                    const speed = Math.min(Math.hypot(dx, dy) / 120, 0.35)
                                    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
                                    gsap.to(b, {
                                        x: x - 48,
                                        y: y - 48,
                                        duration: 0.3,
                                        ease: 'power2.out',
                                        scaleX: 1 + speed,
                                        scaleY: 1 - speed * 0.7,
                                        rotation: angle * 0.12,
                                        overwrite: 'auto',
                                    })
                                }}
                                onMouseLeave={() => {
                                    const b = bubbleRefs.current[i]
                                    if (!b) return
                                    gsap.killTweensOf(b)
                                    gsap.to(b, { scaleX: 0.8, scaleY: 0.8, rotation: 0, autoAlpha: 0, duration: 0.25, ease: 'power3.in' })
                                }}
                            >
                                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                                <div className="absolute left-4 bottom-4 flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-md bg-black/70 text-white text-xs">{item.minutes} min read</span>
                                    <span className="px-2 py-1 rounded-md bg-black/70 text-white text-xs">{item.date}</span>
                                </div>
                                <div
                                    ref={(el) => { if (el) bubbleRefs.current[i] = el }}
                                    className="pointer-events-none z-[9999] absolute w-24 h-24 rounded-full bg-white/85 text-black flex items-center justify-center text-sm font-medium"
                                    style={{ opacity: 0 }}
                                >
                                    Read article
                                </div>
                            </div>
                            <div className="mt-3 text-2xl font-medium tracking-tight">{item.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
