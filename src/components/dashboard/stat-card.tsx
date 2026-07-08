import { type LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'

type StatCardProps = {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
}

export function StatCard({ title, value, subtitle, icon: Icon }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-cyan-500/10" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">{title}</p>
          <h3 className="mt-1 text-2xl font-bold">{value}</h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-accent)] p-2 text-white">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  )
}
