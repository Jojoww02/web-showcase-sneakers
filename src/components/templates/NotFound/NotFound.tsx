import { Link } from '@tanstack/react-router'
import FaultyTerminal from '@/components/templates/Background/FaultyTerminal/FaultyTeriminal'
import { useRef } from 'react'
import { gsap } from 'gsap'

export default function NotFound() {
    const buttonFillRef = useRef<HTMLDivElement>(null);
    const buttonTextRef = useRef<HTMLSpanElement>(null);

    const handleButtonHover = (enter: boolean) => {
        if (!buttonFillRef.current) return;
        const fill = buttonFillRef.current;
        const text = buttonTextRef.current;

        if (enter) {
            gsap.to(fill, {
                y: '0%',
                borderRadius: '0% 0% 0% 0%',
                duration: 0.6,
                ease: 'power4.inOut'
            });
            if (text) gsap.to(text, { color: '#000', duration: 0.4, ease: 'power2.out' });
        } else {
            gsap.to(fill, {
                y: '100%',
                borderRadius: '50% 50% 0% 0%',
                duration: 0.6,
                ease: 'power4.inOut'
            });
            if (text) gsap.to(text, { clearProps: 'color', duration: 0.4, ease: 'power2.out' });
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-black">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <FaultyTerminal
                    scale={1.5}
                    gridMul={[2, 1]}
                    digitSize={1.2}
                    timeScale={1}
                    pause={false}
                    scanlineIntensity={0.5}
                    glitchAmount={1}
                    flickerAmount={1}
                    noiseAmp={1}
                    chromaticAberration={0}
                    dither={0}
                    curvature={0.1}
                    tint="#A7EF9E"
                    mouseReact={true}
                    mouseStrength={0.5}
                    pageLoadAnimation={true}
                    brightness={0.6}
                />
            </div>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="pointer-events-auto text-center px-6 flex flex-col items-center">
                    <style>
                        {`
                            @font-face {
                                font-family: 'Compressa VF';
                                src: url('https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2');
                                font-style: normal;
                            }
                        `}
                    </style>
                    <h1 
                        className="text-[30vw] md:text-[20rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-white select-none drop-shadow-2xl"
                        style={{
                            fontFamily: '"Compressa VF", sans-serif',
                            fontVariationSettings: '"wght" 900, "wdth" 100, "ital" 0'
                        }}
                    >
                        404
                    </h1>
                    <p className="text-white text-xl md:text-2xl font-light tracking-wide max-w-md mx-auto mt-2 mb-10">
                        Page not found. The system is down.
                    </p>
                    <Link
                        to="/"
                        className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white transition-colors duration-300 bg-transparent border border-white rounded-full focus:outline-none"
                        onMouseEnter={() => handleButtonHover(true)}
                        onMouseLeave={() => handleButtonHover(false)}
                    >
                        <span ref={buttonTextRef} className="relative z-10">Return to Home</span>
                        <div
                            ref={buttonFillRef}
                            className="absolute left-0 bottom-0 w-full h-[120%] bg-white pointer-events-none"
                            style={{ transform: 'translateY(100%)', borderRadius: '50% 50% 0 0' }}
                        />
                    </Link>
                </div>
            </div>
        </div>
    )
}