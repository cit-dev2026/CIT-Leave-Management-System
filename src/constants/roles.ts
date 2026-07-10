export const APP_ROLES = [
  'CompanyOwner',
  'HROfficer',
] as const

export type AppRole = (typeof APP_ROLES)[number]
