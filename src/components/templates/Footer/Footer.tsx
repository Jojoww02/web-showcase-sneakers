import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Footer() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const isFooterInView = useInView(wrapRef, { once: true, amount: 0.2 });
    return (
        <div className="relative w-full bg-white z-10">
            <div className="h-full w-full px-[5vw] py-20 flex flex-col justify-between">
                <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:items-start">
                    {/* Logo & Slogan */}
                    <div className="flex flex-col gap-4 max-w-md text-black">
                        <p className="text-xl mt-20 font-medium leading-relaxed text-black/60">
                            Redefining sneaker culture through digital innovation and community-driven drops.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 mt-2 gap-16 md:grid-cols-3 lg:gap-24">
                        <div className="flex flex-col gap-6">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff6b6b]">Explore</h3>
                            <ul className="flex flex-col gap-4 text-sm font-medium text-black/80">
                                {['Events', 'News', 'Gallery'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="relative hover:text-black transition-colors cursor-pointer group inline-block">
                                            {item}
                                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff6b6b]">COMMUNITY</h3>
                            <ul className="flex flex-col gap-4 text-sm font-medium text-black/80">
                                {['Contact', 'Privacy'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="relative hover:text-black transition-colors inline-block group">
                                            {item}
                                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff6b6b]">Socials</h3>
                            <ul className="flex flex-col gap-4 text-sm font-medium text-black/80">
                                {['Instagram', 'Twitter', 'TikTok', 'Discord'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="relative hover:text-black transition-colors inline-block group">
                                            {item}
                                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8 mt-15">
                    <div ref={wrapRef} className="w-[120vw] -mx-[6.5vw] overflow-hidden">
                        <style>
                            {`
                                @font-face {
                                    font-family: 'Compressa VF';
                                    src: url('https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2');
                                    font-style: normal;
                                }
                            `}
                        </style>
                        <motion.h1
                            initial={{ y: '-30vh', opacity: 0 }}
                            animate={isFooterInView ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                            className="block whitespace-nowrap select-none text-black font-black leading-[0.8] tracking-[-0.17em] text-[17.5vw]"
                            style={{
                                fontFamily: '"Compressa VF", sans-serif',
                                fontVariationSettings: '"wght" 900, "wdth" 100, "ital" 0'
                            }}
                        >
                            <span className="inline-flex items-center gap-[1vw]">
                                <span>SNEAKVERS</span>
                                <span className="relative inline-block">
                                    E
                                    <motion.span
                                        className="absolute left-full ml-[4vw] top-[55.7%] -translate-y-1/2 h-[2.2vw] bg-black"
                                        style={{ width: '100vw' }}
                                        initial={{ scaleX: 0, x: 20, transformOrigin: 'right center' }}
                                        animate={isFooterInView ? { scaleX: 1, x: 0 } : {}}
                                        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                                    />
                                </span>
                            </span>
                        </motion.h1>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center border-t border-black/10 pt-8 text-xs font-medium text-black/40 uppercase tracking-widest">
                        <p>© 2026 Sneakverse. All rights reserved.</p>
                        <div className="flex gap-8 mt-4 md:mt-0">
                            <a href="#" className="relative hover:text-black transition-colors inline-block group">
                                Privacy Policy
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
                            </a>
                            <a href="#" className="relative hover:text-black transition-colors inline-block group">
                                Terms of Service
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}