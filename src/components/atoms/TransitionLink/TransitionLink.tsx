import React from 'react'
import { useRouter } from '@tanstack/react-router'
import { gsap } from 'gsap'

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  children: React.ReactNode
  label?: string
}

export function TransitionLink({ to, children, className, label: customLabel, ...props }: TransitionLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (window.location.pathname === to) return

    const label = customLabel || (typeof children === 'string' ? children : 'Loading...')
    
    const textEl = document.getElementById('page-transition-text')
    if (textEl) {
      textEl.innerHTML = label
        .split('')
        .map((char) => `<span class="inline-block will-change-transform">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('')
      
      textEl.style.letterSpacing = '-0.05em'
    }

    gsap.set('#page-transition', { y: '100%' })
    
    gsap.set('#page-transition-text', { opacity: 1, y: 0 })
    
    gsap.set('#page-transition-text span', { y: '100%', opacity: 0 })

    const tl = gsap.timeline()

    tl.to('#page-transition', {
      y: '0%',
      duration: 0.8,
      ease: 'power4.inOut',
    })
    
    .to('#page-transition-text span', {
      y: '0%',
      opacity: 1,
      duration: 0.8,
      stagger: 0.04,
      ease: 'power4.out',
    }, '-=0.5')

    .call(() => {
      router.navigate({ to })
    })
  }

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  )
}