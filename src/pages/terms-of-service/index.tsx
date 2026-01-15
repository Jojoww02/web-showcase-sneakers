import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import SplitText from '@/anim/SplitText/SplitText'
import { gsap } from 'gsap'

export const Route = createFileRoute('/terms-of-service/')({
  component: TermsOfService,
})

function TermsOfService() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.tos-hero', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      })

      gsap.from('.tos-section', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        delay: 0.15,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black">
      <div className="px-[5vw] mt-10 py-20 max-w-5xl mx-auto">
        <div className="tos-hero max-w-3xl">
          <SplitText
            text="Terms of Service"
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight"
            tag="h1"
            splitType="lines, words"
            delay={40}
          />
          <p className="mt-4 text-sm md:text-base text-black/60 max-w-[52ch]">
            These terms govern your use of the SneakerVerse platform, including events, content, and any services
            we provide.
          </p>
          <p className="mt-2 text-xs md:text-sm text-black/40">
            Last updated: 15 January 2026
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <section className="tos-section rounded-2xl border border-black/5 bg-black/2 px-5 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/40">1. Using SneakerVerse</h2>
            <p className="mt-3 text-sm md:text-base text-black/75 leading-relaxed">
              By accessing or using SneakerVerse, you agree to follow these terms and applicable laws. You are
              responsible for the activity that occurs under your account and for keeping your login credentials
              secure.
            </p>
          </section>

          <section className="tos-section rounded-2xl border border-black/5 bg-black/2 px-5 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/40">2. Content and ownership</h2>
            <p className="mt-3 text-sm md:text-base text-black/75 leading-relaxed">
              You retain ownership of the content you upload, but grant SneakerVerse a limited license to display
              it on the platform. You agree not to post content that is unlawful, harmful, or infringes on
              someone else&apos;s rights.
            </p>
          </section>

          <section className="tos-section rounded-2xl border border-black/5 bg-black/2 px-5 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/40">3. Events and community</h2>
            <p className="mt-3 text-sm md:text-base text-black/75 leading-relaxed">
              When you join SneakerVerse events, you agree to respect other participants and follow the guidelines
              shared by the organizers. We may remove users or content that violates these rules to keep the
              community safe and inclusive.
            </p>
          </section>

          <section className="tos-section rounded-2xl border border-black/5 bg-black/2 px-5 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/40">4. Changes to these terms</h2>
            <p className="mt-3 text-sm md:text-base text-black/75 leading-relaxed">
              We may update these Terms of Service from time to time. If changes are significant, we&apos;ll let you
              know through the platform or by email. Continuing to use SneakerVerse after changes means you accept
              the updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
