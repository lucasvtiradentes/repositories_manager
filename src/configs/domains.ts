export const DOMAIN = {
  personal: 'github_lucasvtiradentes',
  lifetracer: 'github_lifetracer',
  work: 'uds'
} as const

export type TDomain = (typeof DOMAIN)[keyof typeof DOMAIN]
