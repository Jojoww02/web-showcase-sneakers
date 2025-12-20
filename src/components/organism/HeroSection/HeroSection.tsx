import { motion } from 'framer-motion'
import TextPressure from '@/components/atoms/TextPressure/TextPressure'
import CountText from '@/components/atoms/CountText/CountText'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white px-[5vw] py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black z-0" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-[#080808] shadow-2xl"
          >
            <video
              src="/assets/video/video_hero.mp4"
              muted
              loop
              playsInline
              autoPlay
              className="h-[700px] w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-3xl border border-white/10 bg-black/60 px-6 py-4 backdrop-blur-xl">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">Community</p>
                <p className="text-xl font-semibold text-white">+58 sneaker houses</p>
              </div>
              <span className="text-3xl font-bold text-lime-300">LIVE</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, y: -30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="absolute -right-8 -top-10 w-[180px] rounded-3xl border border-white/15 bg-white text-black shadow-xl"
          >
            <div className="p-5 text-sm font-semibold uppercase leading-tight">
              <p>Next drop</p>
              <p className="text-3xl font-black mt-2">02.26</p>
            </div>
            <div className="border-t border-black/10 px-5 py-3 text-xs font-medium">Tokyo Summit</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="absolute bottom-4 left-8 flex items-center gap-4 rounded-3xl border border-white/15 bg-[#111]/90 px-6 py-4 backdrop-blur-xl"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-400" />
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/50">Members</p>
              <div className="flex items-center">
                <CountText to={128} className="text-2xl font-semibold text-white" />
                <span className="text-2xl font-semibold text-white">K+</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative flex flex-col gap-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex w-fit items-center rounded-full px-5 py-2 text-xs bg-[#ff6b6b] uppercase tracking-[0.35em] text-white"
          >
            Sneaker Culture
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9 }}
            className="text-[clamp(2.8rem,4.2vw,4.8rem)] font-semibold leading-[1.05] tracking-tight"
          >
            Discover your passion and join the new wave of sneaker community.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="max-w-[480px] text-lg text-white/70"
          >
            A living archive of stories, drops, and gatherings crafted for enthusiasts who push culture
            forward. Build your circle, unlock exclusive events, and stay ahead of every release.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <button className="rounded-full cursor-pointer bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white hover:ring-2 hover:ring-white">
              Explore Community
            </button>
            <button className="rounded-full cursor-pointer border border-white/40 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white">
              Latest drops
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.9 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="rounded-3xl border border-white/15 bg-[#0f0f0f] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Residency</p>
              <p className="mt-3 text-3xl font-semibold text-white">NYC · 04—07</p>
              <p className="mt-2 text-sm text-white/60">Immersive labs with industry mentors.</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-[#0f0f0f] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Collabs</p>
              <p className="mt-3 text-3xl font-semibold text-white">23 studios</p>
              <p className="mt-2 text-sm text-white/60">Monthly capsules built with the community.</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[-1vw] z-0 opacity-20">
        <TextPressure text="SNEAKVERSE" className="text-[20vw] font-extrabold leading-none tracking-tight text-white/5" />
      </div>
    </section>
  )
}
