import { NavLink } from 'react-router-dom'

import { Logo } from '@/components/ui/logo'
import { MAIN_NAVIGATION } from '@/constants/navigation'
import { cn } from '@/utils/cn'

export function Sidebar() {
  return (
    <aside className="surface-card sticky top-4 h-[calc(100vh-2rem)] w-72 p-5">
      <div className="mb-6 border-b border-[var(--border-primary)] pb-4">
        <Logo size="md" showText={true} />
      </div>

      <nav className="flex flex-col gap-1">
        {MAIN_NAVIGATION.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                isActive
                  ? 'bg-[var(--bg-accent)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-cyan-500/10 hover:text-[var(--text-primary)]',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
