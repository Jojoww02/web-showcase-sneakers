import { Outlet, createRootRoute } from '@tanstack/react-router'

import Loader from '../components/templates/Loader/Loader'
import React from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/templates/Header/Header'

export const Route = createRootRoute({
  component: RootComponent,
})

function useWindowSize() {
  const [width, setWidth] = React.useState<number>(window.innerWidth)

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

function RootComponent() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const width = useWindowSize()
  const isMobile = width < 1300

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center p-6">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4">⚠️ Not Supported</h1>
          <p className="text-gray-600">
            Sorry, this website is not optimized for mobile or tablet devices.
            Please access it using a desktop or larger screen.
          </p>
        </div>
      </div>
    )
  }

  return (
    <main>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" />
        ) : (
          <main className=''>
            <Header />
            <Outlet key="app" />
          </main>
        )}
      </AnimatePresence>
    </main>
  )
}