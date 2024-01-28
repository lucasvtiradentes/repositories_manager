import { CATEGORY, TCategoryItem } from "./categories"

export const GITHUB_REPOS_CONFIGS = {
  lucasvtiradentes: {
    repositories_syncer: { ...CATEGORY.personal },
    'development-utils': { ...CATEGORY.personal },
    obsidian_vaults: {...CATEGORY.personal },
    'gcal-sync': { ...CATEGORY.open_source },
    uds_page_actions: { ...CATEGORY.work_utils },
    dotfiles: { ...CATEGORY.personal },
    my_devices_setup: { ...CATEGORY.personal },
    'dyn-markdown': { ...CATEGORY.open_source },
    linux_reminder: { ...CATEGORY.open_source },
    my_accounts: { ...CATEGORY.personal },
    uds_utils: { ...CATEGORY.work_utils },
    'repository-utils': { ...CATEGORY.personal },
    'ticktick-api-lvt': { ...CATEGORY.open_source },
    container_scheduler: { ...CATEGORY.open_source },
    // 'my-tutorials': { ...CATEGORY.personal },
    lvt_page_actions: { ...CATEGORY.personal },
    // page_actions_attacher: { ...CATEGORY.open_source },
    lucasvtiradentes: { ...CATEGORY.personal },
    // 'twitch-notifier': { ...CATEGORY.open_source },
    // 'dev-buddy': { ...CATEGORY.portfolio },
    // 'update-my-stats': { ...CATEGORY.personal },
    // 'esports-notifier': { ...CATEGORY.open_source },
    // boilermanager: { ...CATEGORY.open_source },
    // 'golang-boilerplates': { ...CATEGORY.open_source_resource },
    // 'js-boilerplates': { ...CATEGORY.open_source_resource },
    // 'job-searcher': { ...CATEGORY.portfolio },
    // 'boilermanager-template': { ...CATEGORY.open_source_resource },
    // dropspy: { ...CATEGORY.company_project },
    // 'shopify-store-omni-pixel': { ...CATEGORY.company_project },
    // 'supermarket-chatbot': { ...CATEGORY.company_project },
    // 'waiter-app-server': { ...CATEGORY.portfolio },
    // 'waiter-app-mobile': { ...CATEGORY.portfolio },
    // 'ecommerce-stores-api': { ...CATEGORY.company_project },
    // 'biacaminha.com.br': { ...CATEGORY.company_project },
    // 'maritimusengenharia.com': { ...CATEGORY.company_project },
    // 'github-repo-explorer': { ...CATEGORY.portfolio },
    // 'metaversus-landinpage': { ...CATEGORY.portfolio },
    // cryptor: { ...CATEGORY.open_source },
    // 'notifications-microservice': { ...CATEGORY.portfolio },
    // 'covid19-cases-dashboard': { ...CATEGORY.portfolio },
    // 'todo-app': { ...CATEGORY.portfolio },
    // 'github-assets': { ...CATEGORY.personal }
  },
  'life-tracer': {
    lifetracer_desktop: { ...CATEGORY.lifetracer },
    lifetracer_backend: { ...CATEGORY.lifetracer },
    lifetracer_frontend: { ...CATEGORY.lifetracer },
    lifetracer_setup: { ...CATEGORY.lifetracer }
  }
} as const satisfies Record<string, Record<string, TCategoryItem>>

export type TGithubRepos = typeof GITHUB_REPOS_CONFIGS

export const SSH_REPOS_CONFIGS = [
  {
    ...CATEGORY.work_it_works,
    git_ssh: 'git@gitlab.uds.com.br:itworks/contabilidade/application/backend-node.git'
  },
  {
    ...CATEGORY.work_it_works,
    git_ssh: 'git@gitlab.uds.com.br:itworks/contabilidade/application/frontend-react.git'
  },
  {
    ...CATEGORY.work_it_works,
    git_ssh: 'git@gitlab.uds.com.br:itworks/contabilidade/application/service-data.git'
  },
  {
    ...CATEGORY.work_it_works,
    git_ssh: 'git@gitlab.uds.com.br:itworks/contabilidade/application/service-producer.git'
  },
  {
    ...CATEGORY.work_it_works,
    git_ssh: 'git@gitlab.uds.com.br:itworks/contabilidade/application/service-sat.git'
  },
  {
    ...CATEGORY.work_pdv365,
    git_ssh: 'git@gitlab.uds.com.br:pdv365/pdv365/backoffice/backend-node.git'
  },
  {
    ...CATEGORY.work_pdv365,
    git_ssh: 'git@gitlab.uds.com.br:pdv365/pdv365/backoffice/frontend-react.git'
  },
  {
    ...CATEGORY.work_pdv365,
    git_ssh: 'git@gitlab.uds.com.br:pdv365/pdv365/portal-rh/portal-backend.git'
  },
  {
    ...CATEGORY.work_pdv365,
    git_ssh: 'git@gitlab.uds.com.br:pdv365/pdv365/portal-rh/portal-frontend.git'
  },
  {
    ...CATEGORY.work_pdv365,
    git_ssh: 'git@gitlab.uds.com.br:pdv365/pdv365/terminal/terminal-account.git'
  },
  {
    ...CATEGORY.work_pdv365,
    git_ssh: 'git@gitlab.uds.com.br:pdv365/pdv365/portal-franquia/franquia-event.git'
  },
  {
    ...CATEGORY.work_krebs,
    git_ssh: 'git@gitlab.uds.com.br:krebs/krebs-backend.git'
  },
  {
    ...CATEGORY.work_krebs,
    git_ssh: 'git@gitlab.uds.com.br:krebs/krebs-backoffice-react.git'
  }
] as const satisfies (TCategoryItem & { git_ssh: string })[]

export type TSshRepos = typeof SSH_REPOS_CONFIGS
