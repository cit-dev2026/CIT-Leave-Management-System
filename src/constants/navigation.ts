import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Gauge,
  Users,
  type LucideIcon,
} from 'lucide-react'

type NavigationItem = {
  label: string
  path: string
  icon: LucideIcon
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: Gauge,
  },
  {
    label: 'Employees',
    path: '/employees',
    icon: Users,
  },
  {
    label: 'Leave Management',
    path: '/leave',
    icon: CalendarDays,
  },
  {
    label: 'Attendance',
    path: '/attendance',
    icon: BadgeCheck,
  },
  {
    label: 'Company',
    path: '/company',
    icon: BriefcaseBusiness,
  },
]
