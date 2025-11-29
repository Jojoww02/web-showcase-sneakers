import { motion } from "framer-motion";
import TextPressure from "@/components/atoms/TextPressure/TextPressure";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <video
          src="/assets/video/video_hero.mp4"
          muted
          loop
          playsInline
          autoPlay
          className="w-[40vw] h-[70vh] object-cover opacity-80 rounded-lg"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-0" />

      <div className="absolute right-[8vw] top-[20%] z-10 text-right max-w-[360px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[2rem] md:text-[2.5rem] font-light leading-tight text-gray-200"
        >
          Discover your passion <br /> and sneaker community
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-4 text-base text-gray-300 font-normal"
        >
          An interactive platform for sneaker <br /> enthusiasts to share, learn,
          <br /> and connect with a global community.
        </motion.p>
      </div>


      <div className="absolute bottom-0 left-0 w-full z-10 overflow-hidden px-[5vw]">
        <TextPressure
          text="SNEAKVERSE"
          className="text-[20vw] md:text-[18vw] font-extrabold leading-none tracking-tight text-white"
        />
      </div>
    </section>
  );
}
