import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Props = {
  text?: string
  bg?: string
  textColor?: string
  height?: number
  speed?: number
  className?: string
}

export default function CurvedBanner({
  text = 'Sneaker Culture ✦ Community ✦ Future Icons ✦ Join The Movement ✦',
  bg = '#0A0A0A',
  textColor = '#ffffff',
  height = 180,
  speed = 20,
  className = ''
}: Props) {
  const textPathRef = useRef<SVGTextPathElement>(null)

  useEffect(() => {
    if (textPathRef.current) {
      gsap.to(textPathRef.current, {
        attr: { startOffset: '100%' },
        duration: speed,
        repeat: -1,
        ease: 'none'
      })
    }
  }, [speed])

  return (
    <section className={`relative w-full overflow-hidden ${className}`} style={{ height }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 300" preserveAspectRatio="none">
        <path d="M0,300 Q720,50 1440,300 V300 H0 Z" fill={bg} />
        <path id="curveLine" d="M0,300 Q720,50 1440,300" fill="none" stroke="transparent" />
        <text style={{ fill: textColor }} className="text-[2rem] font-black uppercase tracking-widest">
          <textPath ref={textPathRef} href="#curveLine" startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </svg>
    </section>
  )
}