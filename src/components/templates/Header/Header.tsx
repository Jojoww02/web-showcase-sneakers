import CardNav from '@/components/organism/CardNav/CardNav'

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Events', ariaLabel: 'View events', link: '/events' },
  { label: 'News', ariaLabel: 'View news', link: '/news' },
  { label: 'Gallery', ariaLabel: 'View gallery', link: '/gallery' }
];

const socialItems = [
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'TikTok', link: 'https://tiktok.com' },
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'Discord', link: 'https://discord.com' }
];

const cardItems = [
  {
    label: 'Explore',
    bgColor: '#ff6b6b',
    textColor: '#000',
    links: menuItems.map(m => ({ label: m.label, href: m.link, ariaLabel: m.ariaLabel }))
  },
  {
    label: 'Community',
    bgColor: '#111111',
    textColor: '#ffffff',
    links: [
      { label: 'Contact', href: '/contact', ariaLabel: 'Get in touch' },
      { label: 'Privacy', href: '/privacy', ariaLabel: 'View privacy policy' }
    ]
  },
  {
    label: 'Socials',
    bgColor: '#1a1a1a',
    textColor: '#ffffff',
    links: socialItems.map(s => ({ label: s.label, href: s.link, ariaLabel: s.label }))
  }
];

export default function Header() {
  return (
    <CardNav
      logo="/assets/images/favicon_logo.ico"
      items={cardItems}
      className=""
      ease="power3.out"
      baseColor="#0f0f0f"
      menuColor="#fff"
      buttonBgColor="#ff6b6b"
      buttonTextColor="#000"
    />
  )
}
