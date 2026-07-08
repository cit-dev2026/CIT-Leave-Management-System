export const APP_ROLES = [
  'Super Administrator',
  'Administrator',
  'HR Manager',
  'HR Officer',
  'Department Manager',
  'Supervisor',
  'Employee',
  'Guest',
] as const

export type AppRole = (typeof APP_ROLES)[number]
