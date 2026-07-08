import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/layout/top-nav'

export function AppLayout() {
  const location = useLocation()

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1680px] p-4 lg:p-6">
      <div className="grid gap-4 lg:grid-cols-[18rem_1fr] lg:gap-6">
        <Sidebar />
        <div className="space-y-4">
          <TopNav />
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
