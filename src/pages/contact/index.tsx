import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import SplitText from '@/anim/SplitText/SplitText'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { gsap } from 'gsap'

export const Route = createFileRoute('/contact/')({
  component: Contact,
})

function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-hero', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from('.contact-card', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        delay: 0.1,
        ease: 'power3.out',
      })

      gsap.from('.contact-form', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.25,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black">
      <div className="px-[5vw] py-16 max-w-6xl mx-auto">
        <div className="contact-hero mt-12">
          <SplitText
            text="Let's talk about sneakers."
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight"
            tag="h1"
            splitType="lines, words"
            delay={40}
          />
          <p className="mt-4 text-sm md:text-base text-black/60 max-w-[46ch]">
            Got an event, collaboration idea, or a question about SneakerVerse? Drop us a message and our team
            will get back to you.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="contact-card flex items-start gap-4 rounded-2xl border border-black/5 bg-black/2 px-5 py-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <Mail size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40">Email</div>
              <div className="mt-1 text-sm font-medium">support@sneakerverse.app</div>
              <div className="mt-1 text-sm text-black/50">We usually reply within one business day.</div>
            </div>
          </div>

          <div className="contact-card flex items-start gap-4 rounded-2xl border border-black/5 bg-black/2 px-5 py-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <Phone size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40">Phone</div>
              <div className="mt-1 text-sm font-medium">+62 812-3456-7890</div>
              <div className="mt-1 text-sm text-black/50">Mon–Fri, 09:00–18:00 (WIB)</div>
            </div>
          </div>

          <div className="contact-card flex items-start gap-4 rounded-2xl border border-black/5 bg-black/2 px-5 py-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <MapPin size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40">Studio</div>
              <div className="mt-1 text-sm font-medium">Jakarta, Indonesia</div>
              <div className="mt-1 text-sm text-black/50">Open for meetups by appointment.</div>
            </div>
          </div>
        </div>

        <div className="mt-14 contact-form text-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-black/40">Send us a note</div>
          <form className="mt-10 space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-black/50">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-black/10 bg-black/2 px-3 py-2.5 text-sm outline-none focus:border-black/60 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-black/50">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-black/10 bg-black/2 px-3 py-2.5 text-sm outline-none focus:border-black/60 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-black/50">Message</label>
              <textarea
                rows={4}
                placeholder="Tell us what you have in mind..."
                className="mt-2 w-full rounded-xl border border-black/10 bg-black/2 px-3 py-2.5 text-sm outline-none focus:border-black/60 focus:bg-white transition-colors resize-none"
              />
            </div>
            <button
              type="button"
              className="mt-2 cursor-pointer inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-black/80 active:scale-95 transition-all"
            >
              <span>Send message</span>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
