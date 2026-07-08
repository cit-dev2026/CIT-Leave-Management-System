import { Building2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { MAIN_NAVIGATION } from '@/constants/navigation'
import { cn } from '@/utils/cn'

export function Sidebar() {
  return (
    <aside className="surface-card sticky top-4 h-[calc(100vh-2rem)] w-72 p-5">
      <div className="mb-6 flex items-center gap-3 border-b border-[var(--border-primary)] pb-4">
        <div className="rounded-xl bg-[var(--bg-accent)] p-2 text-white">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Enterprise</p>
          <h1 className="text-lg font-bold">CIT HRMS</h1>
        </div>
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
