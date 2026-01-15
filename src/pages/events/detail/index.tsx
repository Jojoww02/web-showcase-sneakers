import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react'

export const Route = createFileRoute('/events/detail/')({
  component: DetailEvent,
})

function DetailEvent() {
  const schedule = [
    { time: '09:00 AM', title: 'Registration & Coffee', desc: 'Check-in and grab your welcome kit.' },
    { time: '10:00 AM', title: 'Opening Keynote', desc: 'The Future of Sneaker Culture by Jonatan Hermanto.' },
    { time: '11:30 AM', title: 'Panel Discussion', desc: 'Sustainability in Streetwear: Hype vs Reality.' },
    { time: '01:00 PM', title: 'Networking Lunch', desc: 'Connect with fellow enthusiasts and industry leaders.' },
    { time: '02:30 PM', title: 'Workshop: Customization', desc: 'Hands-on session with local artists.' },
    { time: '04:00 PM', title: 'Closing & Giveaway', desc: 'Wrap up and exclusive merch drops.' },
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="px-[5vw] mt-10 py-16">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block bg-[#ff6b6b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Upcoming</span>
          <span className="text-black/50 text-sm font-medium tracking-wide">Tokyo Summit 2026</span>
        </div>
        
        <h1 className="text-[clamp(2.5rem,7vw,8rem)] font-medium leading-[0.95] tracking-tight max-w-[15ch]">
          SneakerVerse Summit: Tokyo
        </h1>

        <div className="mt-12 h-[1px] bg-black/10" />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Details & Description */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff6b6b] mb-6">Event Details</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5 rounded-full">
                    <Calendar className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">February 2026</div>
                    <div className="text-black/60">Date to be announced</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5 rounded-full">
                    <Clock className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">09:00 AM - 05:00 PM</div>
                    <div className="text-black/60">Full day access</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5 rounded-full">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Shibuya Stream Hall</div>
                    <div className="text-black/60">Shibuya City, Tokyo, Japan</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f8f8] p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-4">About this event</h3>
              <p className="text-black/70 leading-relaxed mb-6">
                Join us for the biggest gathering of SneakerVerse in Asia. From exclusive drops to insightful panels with industry giants, the Tokyo Summit is where culture meets innovation.
              </p>
              <button disabled className="w-full bg-black/10 text-black/30 py-4 rounded-xl cursor-not-allowed font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                Register Coming Soon
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group">
               <img src="/assets/images/preview-event.jpeg" alt="Venue" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
               <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold">
                 Venue Preview
               </div>
            </div>
          </div>

          {/* Right Column: Schedule */}
          <div className="lg:col-span-7">
            <div className="sticky top-32">
              <div className="flex items-end justify-between mb-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Rundown</h2>
                <span className="hidden md:block text-black/40 font-medium font-mono text-sm">JST (Japan Standard Time)</span>
              </div>

              <div className="space-y-0 relative">
                {/* Vertical Line */}
                <div className="absolute left-[85px] md:left-[100px] top-4 bottom-4 w-[1px] bg-black/10" />

                {schedule.map((item, i) => (
                  <div key={i} className="relative grid grid-cols-[85px_1fr] md:grid-cols-[100px_1fr] gap-8 py-8 group hover:bg-black/[0.02] rounded-2xl transition-colors px-4 -mx-4">
                    {/* Time */}
                    <div className="text-right pt-1">
                      <span className="font-mono text-sm font-medium text-black/50 group-hover:text-black transition-colors">{item.time}</span>
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-300">{item.title}</h4>
                      <p className="text-black/60 text-sm md:text-base leading-relaxed max-w-md">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 border border-black/10 rounded-2xl flex items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
                 <div className="text-[15px] text-black/60">
                    <span className="font-bold text-black block mb-1">Note:</span>
                    Schedule is subject to change. Final agenda will be sent via email.
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
