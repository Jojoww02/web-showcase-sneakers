import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import SplitText from '@/anim/SplitText/SplitText'
import { gsap } from 'gsap'

export const Route = createFileRoute('/privacy/')({
  component: PrivacyPolicy,
})

function PrivacyPolicy() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.policy-hero', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      })

      gsap.from('.policy-section', {
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
        <div className="policy-hero max-w-3xl">
          <SplitText
            text="Privacy Policy"
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight"
            tag="h1"
            splitType="lines, words"
            delay={40}
          />
          <p className="mt-4 text-sm md:text-base text-black/60 max-w-[52ch]">
            This page explains how SneakerVerse collects, uses, and protects your personal data when you use our
            platform, attend events, or interact with our services.
          </p>
          <p className="mt-2 text-xs md:text-sm text-black/40">
            Last updated: 15 January 2026
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <section className="policy-section rounded-2xl border border-black/5 bg-black/2 px-5 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/40">1. Data we collect</h2>
            <p className="mt-3 text-sm md:text-base text-black/75 leading-relaxed">
              We collect information you provide directly, such as your name, email, and profile details when you
              create an account or contact us. We also collect usage data like pages viewed, interactions with
              content, and basic device information to help us keep SneakerVerse fast and reliable.
            </p>
          </section>

          <section className="policy-section rounded-2xl border border-black/5 bg-black/2 px-5 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/40">
              2. How we use your information
            </h2>
            <p className="mt-3 text-sm md:text-base text-black/75 leading-relaxed">
              Your data is used to operate and improve the platform, personalize your experience, process
              registrations, and keep you informed about updates related to SneakerVerse. We do not sell your data
              to third parties.
            </p>
          </section>

          <section className="policy-section rounded-2xl border border-black/5 bg-black/2 px-5 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/40">
              3. Cookies and tracking
            </h2>
            <p className="mt-3 text-sm md:text-base text-black/75 leading-relaxed">
              We use cookies and similar technologies to remember your preferences, understand how you use the
              site, and measure performance. You can control cookies through your browser settings, but some
              features may not work correctly if you disable them.
            </p>
          </section>

          <section className="policy-section rounded-2xl border border-black/5 bg-black/2 px-5 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/40">
              4. Your rights
            </h2>
            <p className="mt-3 text-sm md:text-base text-black/75 leading-relaxed">
              You can request access to your data, ask for corrections, or request deletion where applicable. If
              you have questions about how we handle your information, reach out to us via the contact page and we
              will respond as soon as possible.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
