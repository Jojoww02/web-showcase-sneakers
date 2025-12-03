import { motion, AnimatePresence } from 'framer-motion'
import { Outlet, useRouterState } from '@tanstack/react-router'

export default function AnimatedRoutes() {
  const routerState = useRouterState()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routerState.location.href}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}
