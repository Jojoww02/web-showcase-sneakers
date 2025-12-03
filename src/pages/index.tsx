import HeroSection from '@/components/organism/HeroSection/HeroSection'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div>
      <HeroSection />
    </div>
  )
}
