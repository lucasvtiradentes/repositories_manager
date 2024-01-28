import { DOMAIN, TDomain } from "./domains"

export type TCategoryItem = {
  domain: TDomain
  category?: string
}

export const CATEGORY = {
  personal: {
    domain: DOMAIN.personal,
    category: 'personal',
  },
  open_source: {
    domain: DOMAIN.personal,
    category: 'open_source',
  },
  open_source_resource: {
    domain: DOMAIN.personal,
    category: 'open_source_resource',
  },
  portfolio: {
    domain: DOMAIN.personal,
    category: 'portfolio',
  },
  company_project: {
    domain: DOMAIN.personal,
    category: 'company_project',
  },
  // lifetracer
  lifetracer: {
    domain: DOMAIN.lifetracer,
  },
  // work
  work_utils: {
    domain: DOMAIN.work,
  },
  work_it_works: {
    domain: DOMAIN.work,
    category: 'it_works'
  },
  work_pdv365: {
    domain: DOMAIN.work,
    category: 'pdv365'
  },
  work_krebs: {
    domain: DOMAIN.work,
    category: 'krebs'
  }
} as const satisfies Record<string, TCategoryItem>


export type TCategory = keyof typeof CATEGORY