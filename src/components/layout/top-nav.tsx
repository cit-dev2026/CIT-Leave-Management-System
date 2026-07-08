import { Bell, Moon, Search, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export function TopNav() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="surface-card sticky top-4 z-20 flex h-16 items-center justify-between gap-4 px-5">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] px-3">
          <Search className="h-4 w-4 text-[var(--text-secondary)]" />
          <input
            className="w-full border-none bg-transparent text-sm outline-none"
            placeholder="Search employees, departments, requests"
            type="search"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" aria-label="Toggle theme" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="outline" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
