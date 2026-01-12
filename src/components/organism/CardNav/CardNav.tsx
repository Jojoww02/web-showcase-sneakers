import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { TransitionLink } from '@/components/atoms/TransitionLink/TransitionLink';
import Logo from '@/components/atoms/Icons/Logo';
import AnimatedContent from '@/anim/AnimatedContent/AnimatedContent';
import { Link } from '@tanstack/react-router';

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const NavLogo = ({ visible }: { visible: boolean }) => {
  const el = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    if (!el.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (visible) {
        gsap.set(el.current, { y: 0, opacity: 1, scale: 1, autoAlpha: 1 });
      } else {
        gsap.set(el.current, { opacity: 0, scale: 0.8, autoAlpha: 0 });
      }
      return;
    }

    if (visible) {
      gsap.fromTo(
        el.current,
        { y: 20, opacity: 0, scale: 0.8, autoAlpha: 0 },
        { y: 0, opacity: 1, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      gsap.to(el.current, {
        y: -20,
        opacity: 0,
        scale: 0.8,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power3.in'
      });
    }
  }, [visible]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" ref={el}>
      <div className={`scale-[0.08] origin-center flex items-center justify-center w-[60px] h-[60px] ${visible ? 'pointer-events-auto cursor-pointer' : ''}`}>
        <Link to="/">
          <Logo fill="#ffffff" />
        </Link>
      </div>
    </div>
  );
};

const NavText = ({ visible }: { visible: boolean }) => {
  const el = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    if (!el.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (visible) {
        gsap.set(el.current, { y: 0, opacity: 1, scale: 1, autoAlpha: 1 });
      } else {
        gsap.set(el.current, { opacity: 0, scale: 0.8, autoAlpha: 0 });
      }
      return;
    }

    if (visible) {
      gsap.fromTo(
        el.current,
        { y: 20, opacity: 0, scale: 0.8, autoAlpha: 0 },
        { y: 0, opacity: 1, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      gsap.to(el.current, {
        y: -20,
        opacity: 0,
        scale: 0.8,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power3.in'
      });
    }
  }, [visible]);

  return (
    <div className={`absolute inset-0 flex items-center justify-center ${visible ? 'pointer-events-auto' : 'pointer-events-none'}`} ref={el}>
      <Link to="/">
        <h1
          className="text-[32px] text-white leading-[0.8] tracking-[-5px] cursor-pointer select-none transition-transform whitespace-nowrap"
          style={{
            fontFamily: '"Compressa VF", sans-serif',
            fontVariationSettings: '"wght" 900, "wdth" 100, "ital" 0'
          }}
        >
          SNEAKVERSE
        </h1>
      </Link>
    </div>
  );
};

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'expo.out',
  baseColor = '#141414',
  menuColor,
  buttonBgColor,
  buttonTextColor
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {

    const navEl = navRef.current;
    if (!navEl) return 260;

    const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement | null;
    if (!contentEl) return 260;

    const wasVisible = contentEl.style.visibility;
    const wasPointerEvents = contentEl.style.pointerEvents;
    const wasPosition = contentEl.style.position;
    const wasHeight = contentEl.style.height;

    contentEl.style.visibility = 'visible';
    contentEl.style.pointerEvents = 'auto';
    contentEl.style.position = 'static';
    contentEl.style.height = 'auto';

    contentEl.offsetHeight;

    const styles = window.getComputedStyle(contentEl);
    const padTop = parseFloat(styles.paddingTop || '0');
    const padBottom = parseFloat(styles.paddingBottom || '0');
    const rectHeight = contentEl.getBoundingClientRect().height;
    const cards = Array.from(contentEl.querySelectorAll('.nav-card')) as HTMLElement[];
    const tallestCard = cards.reduce((m, el) => Math.max(m, el.getBoundingClientRect().height), 0);
    const contentHeight = Math.max(rectHeight, tallestCard + padTop + padBottom);
    const topBar = 60;

    contentEl.style.visibility = wasVisible;
    contentEl.style.pointerEvents = wasPointerEvents;
    contentEl.style.position = wasPosition;
    contentEl.style.height = wasHeight;

    const base = Math.ceil(topBar + contentHeight + 32);
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const minExpandedDesktop = 440;
    const minExpandedMobile = 340;
    const minExpanded = isDesktop ? minExpandedDesktop : minExpandedMobile;
    return Math.max(260, isExpanded ? Math.max(minExpanded, base) : base);
  };

  const expandedMaxWidth = () => {
    const vw = window.innerWidth;
    const margin = 32;
    const max = 1200;
    const target = Math.min(vw - margin, max);
    return target;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(containerRef.current, { maxWidth: 700 });
    gsap.set(contentRef.current, { autoAlpha: 0 });
    gsap.set(cardsRef.current, { y: 24, opacity: 0, scale: 0.98 });

    const tl = gsap.timeline({ paused: true });

    tl.to(containerRef.current, { maxWidth: expandedMaxWidth, duration: 0.65, ease }, 0);

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.6,
      ease
    });

    tl.to(contentRef.current, { autoAlpha: 1, duration: 0.3, ease }, '-=0.3');

    tl.to(cardsRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease, stagger: 0.06 }, '-=0.2');

    return tl;
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleLocoScroll = (e: any) => {
      const scrollY = e.detail?.scroll?.y || e.detail?.scrollY || 0;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('loco-scroll', handleLocoScroll as EventListener);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('loco-scroll', handleLocoScroll as EventListener);
    };
  }, []);

  useLayoutEffect(() => {
    const el = buttonTextRef.current;
    if (!el) return;
    const text = el.textContent || 'Login';
    el.innerHTML = '';
    const offsetIncrement = 0.01;
    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;
      span.className = 'inline-block transition-transform duration-[600ms] ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:-translate-y-[1.3em]';
      span.style.textShadow = '0px 1.3em currentColor';
      span.style.transform = 'translateY(0em)';
      if (char === ' ') span.style.whiteSpace = 'pre';
      el.appendChild(span);
    });
  }, []);

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });
        gsap.set(containerRef.current, { maxWidth: expandedMaxWidth() });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        gsap.set(containerRef.current, { maxWidth: 700 });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      requestAnimationFrame(() => tl.play(0));
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      requestAnimationFrame(() => tl.reverse());
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  const buttonFillRef = useRef<HTMLDivElement>(null);
  const buttonTextRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getHoverSide = (e: React.MouseEvent, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const distLeft = x;
    const distRight = rect.width - x;
    const distTop = y;
    const distBottom = rect.height - y;
    const min = Math.min(distLeft, distRight, distTop, distBottom);
    if (min === distLeft) return 'left';
    if (min === distRight) return 'right';
    if (min === distTop) return 'top';
    return 'bottom';
  };

  const handleButtonDirectionalHover = (e: React.MouseEvent, enter: boolean) => {
    if (!buttonFillRef.current || !buttonRef.current) return;
    const fill = buttonFillRef.current;
    const text = buttonTextRef.current;
    const side = getHoverSide(e, buttonRef.current);
    const isHorizontal = side === 'left' || side === 'right';
    const origin = side === 'left' ? 'left center' : side === 'right' ? 'right center' : side === 'top' ? 'center top' : 'center bottom';

    gsap.set(fill, { transformOrigin: origin });

    if (enter) {
      if (isHorizontal) {
        gsap.fromTo(fill, { scaleX: 0, scaleY: 1 }, { scaleX: 1, duration: 0.55, ease: 'power4.out' });
      } else {
        gsap.fromTo(fill, { scaleY: 0, scaleX: 1 }, { scaleY: 1, duration: 0.55, ease: 'power4.out' });
      }
      if (text) gsap.to(text, { color: '#000', duration: 0.3, ease: 'power2.out' });
    } else {
      if (isHorizontal) {
        gsap.to(fill, { scaleX: 0, duration: 0.5, ease: 'power4.in' });
      } else {
        gsap.to(fill, { scaleY: 0, duration: 0.5, ease: 'power4.in' });
      }
      if (text) gsap.to(text, { clearProps: 'color', duration: 0.3, ease: 'power2.in' });
    }
  };

  useLayoutEffect(() => {
    if (buttonFillRef.current) {
      gsap.set(buttonFillRef.current, { scaleX: 0, scaleY: 1, transformOrigin: 'left center' });
    }
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 24, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  return (
      <div
        ref={containerRef}
        className={`card-nav-container fixed inset-x-0 mx-auto top-3 md:top-6 ${isExpanded ? 'z-[999]' : 'z-[99]'} w-[90%] max-w-[700px] ${className}`}
      >
        <nav
          ref={navRef}
          className={`card-nav ${isExpanded ? 'open shadow-lg ring-1 ring-white/10' : 'shadow-md ring-0'} block h-[60px] p-0 rounded-sm relative overflow-hidden will-change-[height] transition-[background,box-shadow] duration-300`}
          style={{ backgroundColor: isExpanded ? baseColor : '#141414' }}
        >
          <div className={`card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2] ${isExpanded ? 'border-b border-white/10' : ''}`}>
            <div
              className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full px-2 rounded-sm flex flex-row items-center justify-center cursor-pointer gap-[8px] order-2 md:order-none hover:bg-white/10 active:scale-95 transition-all duration-300`}
              onClick={toggleMenu}
              role="button"
              aria-label={isExpanded ? 'Close menu' : 'Open menu'}
              tabIndex={0}
              style={{ color: menuColor || '#000' }}
            >
              <div className="hamburger-icon flex flex-col items-center justify-center gap-[6px]">
                <div className={`hamburger-line w-[25px] h-[1.5px] bg-current transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center ${isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''}`} />
                <div className={`hamburger-line w-[25px] h-[1.5px] bg-current transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center ${isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''}`} />
              </div>
              <span className="ml-1 text-[20px] leading-[1] font-normal text-white opacity-90">Menu</span>
            </div>

            <div className="logo-container flex items-center justify-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none h-full overflow-hidden w-[200px]">
              <style>
                {`
                @font-face {
                  font-family: 'Compressa VF';
                  src: url('https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2');
                  font-style: normal;
                }
              `}
              </style>
              <div className="relative w-full h-full flex items-center justify-center">
                <NavLogo visible={isScrolled && !isExpanded} />
                <NavText visible={!isScrolled || isExpanded} />
              </div>
            </div>

            <button
              ref={buttonRef}
              type="button"
              className="card-nav-cta-button relative hidden md:inline-flex border-0 rounded-4xl px-6 items-center h-full font-medium cursor-pointer overflow-hidden group"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              onMouseEnter={(e) => handleButtonDirectionalHover(e, true)}
              onMouseLeave={(e) => handleButtonDirectionalHover(e, false)}
            >
              <span ref={buttonTextRef} data-button-animate-chars="" className="relative z-10 inline-block overflow-hidden whitespace-nowrap leading-[1.3] tracking-[-0.02em]">Login</span>
              <div
                ref={buttonFillRef}
                className="absolute left-0 top-0 w-full h-full bg-white pointer-events-none"
                style={{ borderRadius: '12px' }}
              />
            </button>
          </div>

          <div
            ref={contentRef}
            className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-4 md:p-6 flex flex-col items-stretch gap-4 justify-between z-[1] ${isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
              } md:flex-row md:items-start md:gap-6`}
            aria-hidden={!isExpanded}
          >
            {(items || []).slice(0, 3).map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="nav-card group select-none relative flex flex-col gap-4 p-6 md:p-8 rounded-2xl min-w-0 flex-[1_1_0%] h-auto md:min-h-[340px] ring-1 ring-white/10 bg-neutral-900/80"
                ref={setCardRef(idx)}
                style={undefined}
              >
                <div className={`nav-card-label text-[11px] uppercase tracking-[0.2em] ${idx === 0 ? 'text-white' : 'text-white/60'}`}>
                  {item.label}
                </div>
                <div className="nav-card-links mt-2 md:mt-4 flex flex-col divide-y divide-white/5">
                  {item.links?.map((lnk, i) => (
                    <TransitionLink
                      key={`${lnk.label}-${i}`}
                      className="nav-card-link relative inline-flex items-start py-2 md:py-3 no-underline cursor-pointer text-[22px] font-medium text-white/85 hover:text-white transition-[color] duration-300 after:content-[''] after:pointer-events-none after:absolute after:left-0 after:bottom-0 after:-translate-y-[2px] after:h-[2px] after:w-0 after:bg-white/30 after:rounded after:transition-[width,background-color] after:duration-300 after:ease-[cubic-bezier(0.4,0,0.2,1)] after:z-[1] hover:after:w-full hover:after:bg-white focus-visible:after:w-full"
                      to={lnk.href}
                      aria-label={lnk.ariaLabel}
                    >
                      {lnk.label}
                    </TransitionLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
  );
};

export default CardNav;
