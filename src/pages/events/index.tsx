import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/events/')({
  component: Events,
})

function Events() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="px-[5vw] py-16">
        <h1 className="text-[clamp(3rem,9vw,12rem)] font-medium leading-[0.9] mt-10 tracking-tight">Meetups</h1>
        <div className="mt-8 h-[1px] bg-black/10" />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <div className="max-w-[60ch]">
              <div className="text-2xl font-semibold">We’re not just an online community…</div>
              <p className="mt-4 text-black/70 leading-relaxed">
                Sometimes we take things offline, meeting up at conferences, events, or spontaneous hangouts around the world.
                Before any trip, we usually drop a message in gmail to see who else will be there.
              </p>
            </div>

            <Link to="/events/detail" className="mt-16 block group cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="inline-block bg-[#ff6b6b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Upcoming</span>
                <span className="inline-block border border-black/20 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Event</span>
              </div>
              <div className="mt-4 text-3xl font-bold tracking-tight group-hover:text-[#ff6b6b] transition-colors duration-300">Tokyo, Japan</div>
              <div className="mt-1 text-black/60">February 2026, date TBA</div>
            </Link>

            <div className="mt-12 space-y-8">
              <div className="h-[1px] bg-black/10" />
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-black/50">
                  <span className="inline-block border border-black/20 px-2 py-0.5 rounded-full">Past</span>
                  <span className="inline-block border border-black/20 px-2 py-0.5 rounded-full">Event</span>
                  <span className="inline-block border border-black/20 px-2 py-0.5 rounded-full">2025</span>
                </div>
                <div className="mt-3 text-2xl text-black/30 font-semibold">New York City, USA</div>
                <div className="text-black/30 mt-1">Wednesday 17 September, 2025</div>
              </div>
              <div className="h-[1px] bg-black/10" />
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-black/50">
                  <span className="inline-block border border-black/20 px-2 py-0.5 rounded-full">Past</span>
                  <span className="inline-block border border-black/20 px-2 py-0.5 rounded-full">Event</span>
                  <span className="inline-block border border-black/20 px-2 py-0.5 rounded-full">2024</span>
                </div>
                <div className="mt-3 text-2xl text-black/30 font-semibold">Jakarta, Indonesia</div>
                <div className="text-black/30 mt-1">Sunday 8 December, 2024</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative h-[520px]">
              <img src="/assets/images/news-2.jpeg" alt="Event" className="absolute left-0 top-14 w-[70%] h-[420px] object-cover rounded-3xl shadow-xl" />
              <img src="/assets/images/sneakverse-community.jpeg" alt="Event" className="absolute right-0 bottom-0 w-[55%] h-[320px] object-cover rounded-3xl shadow-xl rotate-3" />
              <img src="/assets/images/jonatan-images.jpeg" alt="Host" className="absolute right-40 z-10 -top-30 w-[100px] h-[100px] object-cover rounded-full ring-4 ring-white shadow-2xl" />
              <img src="/assets/images/arya_images.jpeg" alt="Host" className="absolute right-20 -top-30 z-9 w-[100px] h-[100px] object-cover rounded-full ring-4 ring-white shadow-2xl" />
              <img src="/assets/images/fadli_images.jpeg" alt="Host" className="absolute right-0 -top-30 w-[100px] h-[100px] object-cover rounded-full ring-4 ring-white shadow-2xl" />
              <span className="absolute left-1/2 -top-5 -translate-x-1/2 text-[#ff6b6b] font-bold" style={{ fontFamily: '"Brisa Pro", "Caveat", cursive' }}>Touch some grass broo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
