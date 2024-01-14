export const CATEGORIES = {
  open_source: {
    name: "open_source",
    path: "/github/open_source"
  },
  open_source_resource: {
    name: "open_source_resource",
    path: "/github/open_source_resource"
  },
  personal: {
    name: "personal",
    path: "/github/personal"
  },
  portfolio: {
    name: "portfolio",
    path: "/github/portfolio"
  },
  utils: {
    name: "utils",
    path: "/github/utils"
  },
  projects: {
    name: "projects",
    path: "/github/projects"
  },
  company_project: {
    name: "company_project",
    path: "/github/company_project"
  }
} as const satisfies Record<string, TCategoryInfo>

export const UDS_CATEGORIES = {
  uds_tools: {
    name: "uds",
    path: "/uds/tools"
  },
  it_works: {
    name: "it_works",
    path: "/uds/it_works"
  },
  pdv365: {
    name: "pdv365",
    path: "/uds/pdv365"
  }
} as const satisfies Record<string, TCategoryInfo>

export type TCategoryInfo = {
  name: string
  path: string
}

export type TRepositorySSH = string
