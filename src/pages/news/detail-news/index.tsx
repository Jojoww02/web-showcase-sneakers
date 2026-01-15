import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useGetApiArticles } from '@/gen/sneakverse/hooks/useGetApiArticles'
import SplitText from '@/anim/SplitText/SplitText'
import { gsap } from 'gsap'

export const Route = createFileRoute('/news/detail-news/')({
  component: DetailNews,
})

function DetailNews() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const id = Number(params.get('id') ?? 0) || 0

  const { data, isLoading, isError } = useGetApiArticles({ id }, { query: { enabled: !!id } })
  const article = Array.isArray(data) ? data?.[0] : (data as any) ?? null

  const title = article?.title ?? article?.Title ?? 'Article'
  const imageSrc = (
    article?.thumbnailUrl ??
    article?.ThumbnailUrl ??
    article?.thumbnail ??
    article?.Thumbnail ??
    ''
  )

  const createdBy = (article as any)?.createdBy ?? (article as any)?.CreatedBy ?? null
  const author =
    createdBy?.name ??
    createdBy?.fullName ??
    createdBy?.username ??
    createdBy?.email ??
    'Unknown'
  const publishedSource = article?.publishedAt ?? article?.PublishedAt ?? article?.createdAt ?? article?.CreatedAt ?? article?.date ?? article?.Date
  const published = publishedSource ? new Date(publishedSource).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
  const contentStr = article?.content ?? article?.Content ?? ''

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const shareLinks = [
    { name: 'LinkedIn', href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}` },
    { name: 'X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
  ]

  const allArticlesRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (isLoading) return
    const el = allArticlesRef.current
    if (!el) return
    const arrow = el.querySelector('.arrow') as HTMLElement | null

    const tl = gsap.timeline({ paused: true })
    tl.to(el, { x: 2, duration: 0.2, ease: 'power2.out' }, 0)
    if (arrow) tl.to(arrow, { x: 6, duration: 0.25, ease: 'power2.out' }, 0)

    const onEnter = () => tl.play()
    const onLeave = () => tl.reverse()
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [isLoading])

  if (!id) return <div className="px-[5vw] py-10">No article selected.</div>
  if (isLoading) return <div className="px-[5vw] py-10">Loading article...</div>
  if (isError || !article) return <div className="px-[5vw] py-10">Failed to load article.</div>

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="px-[3vw] py-12">
        <SplitText
          text={title}
          className="text-[clamp(2.5rem,6vw,6rem)] mt-15 font-medium leading-[1.2] tracking-medium"
          tag="h1"
          splitType="lines, words"
          delay={50}
          duration={1.2}
        />

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 lg:sticky lg:top-32 self-start">
            <div className="text-[16px] text-black/60">Published on</div>
            <div className="mt-1 text-[16px] font-medium">{published}</div>

            <div className="mt-6 text-[16px] text-black/60">Author</div>
            <div className="mt-1 text-[16px] font-medium">{author}</div>

            <div className="mt-6 text-[16px] text-black/60">Category</div>
            <div className="mt-1 text-[16px] font-medium">{article?.category ?? article?.category ?? '-'}</div>

            <div className="mt-6 text-[16px] text-black/60">Share article</div>
            <div className="mt-2 flex gap-4">
              {shareLinks.map((l) => (
                <a
                  key={l.name}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-block group text-[16px] font-medium hover:text-black transition-colors"
                >
                  {l.name}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
                </a>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="/news"
                ref={allArticlesRef}
                className="inline-flex items-center gap-2 text-[16px] font-semibold underline underline-offset-4"
              >
                All articles <span className="arrow">→</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="rounded-2xl overflow-hidden bg-[#111] h-[360px]">
              <img src={imageSrc} alt={title} className="w-full h-full object-cover opacity-90" />
            </div>

            <div className="mt-8 text-[18px] leading-relaxed text-black/80 whitespace-pre-wrap">
              {contentStr}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}