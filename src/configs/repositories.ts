import { TCategoryInfo, CATEGORIES, TRepositorySSH, UDS_CATEGORIES } from "./categories"

// CONFIGS =====================================================================

const github_ssh="git@github.com:lucasvtiradentes"

export type TRepoTuple = [TCategoryInfo, TRepositorySSH]

// GITHUB ======================================================================

const github_repos = [
  [CATEGORIES.utils, `${github_ssh}/repositories_syncer.git`],
  [CATEGORIES.utils, `${github_ssh}/linux_reminder.git`],
  [CATEGORIES.personal, `${github_ssh}/my_accounts.git`],
  [CATEGORIES.utils, `${github_ssh}/linux_setup.git`],
  [CATEGORIES.utils, `${github_ssh}/repository-utils.git`],
  [CATEGORIES.open_source, `${github_ssh}/ticktick-api-lvt.git`],
  [CATEGORIES.utils, `${github_ssh}/dotfiles.git`],
  [CATEGORIES.open_source, `${github_ssh}/container_scheduler.git`],
  [CATEGORIES.open_source_resource, `${github_ssh}/uds_page_actions.git`],
  // [CATEGORIES.personal, `${github_ssh}/my-tutorials.git`],
  [CATEGORIES.open_source_resource, `${github_ssh}/lvt_page_actions.git`],
  [CATEGORIES.utils, `${github_ssh}/development-utils.git`],
  // [CATEGORIES.open_source, `${github_ssh}/page_actions_attacher.git`],
  [CATEGORIES.personal, `${github_ssh}/lucasvtiradentes.git`],
  [CATEGORIES.open_source, `${github_ssh}/gcal-sync.git`],
  // [CATEGORIES.open_source, `${github_ssh}/twitch-notifier.git`],
  // [CATEGORIES.portfolio, `${github_ssh}/dev-buddy.git`],
  // [CATEGORIES.personal, `${github_ssh}/update-my-stats.git`],
  // [CATEGORIES.open_source, `${github_ssh}/esports-notifier.git`],
  // [CATEGORIES.open_source, `${github_ssh}/boilermanager.git`],
  // [CATEGORIES.open_source_resource, `${github_ssh}/golang-boilerplates.git`],
  // [CATEGORIES.open_source, `${github_ssh}/dyn-markdown.git`],
  // [CATEGORIES.open_source_resource, `${github_ssh}/js-boilerplates.git`],
  // [CATEGORIES.portfolio, `${github_ssh}/job-searcher.git`],
  // [CATEGORIES.open_source_resource, `${github_ssh}/boilermanager-template.git`],
  // [CATEGORIES.company_project, `${github_ssh}/dropspy.git`],
  // [CATEGORIES.company_project, `${github_ssh}/shopify-store-omni-pixel.git`],
  // [CATEGORIES.company_project, `${github_ssh}/supermarket-chatbot.git`],
  // [CATEGORIES.portfolio, `${github_ssh}/waiter-app-server.git`],
  // [CATEGORIES.portfolio, `${github_ssh}/waiter-app-mobile.git`],
  // [CATEGORIES.company_project, `${github_ssh}/ecommerce-stores-api.git`],
  // [CATEGORIES.company_project, `${github_ssh}/biacaminha.com.br.git`],
  // [CATEGORIES.company_project, `${github_ssh}/maritimusengenharia.com.git`],
  // [CATEGORIES.portfolio, `${github_ssh}/github-repo-explorer.git`],
  // [CATEGORIES.portfolio, `${github_ssh}/metaversus-landinpage.git`],
  // [CATEGORIES.open_source, `${github_ssh}/cryptor.git`],
  // [CATEGORIES.portfolio, `${github_ssh}/notifications-microservice.git`],
  // [CATEGORIES.portfolio, `${github_ssh}/covid19-cases-dashboard.git`],
  // [CATEGORIES.portfolio, `${github_ssh}/todo-app.git`],
  // [CATEGORIES.utils, `${github_ssh}/github-assets.git`]
] as const satisfies TRepoTuple[]

const lifetracer_repos=[
  [CATEGORIES.projects, "git@github.com:life-tracer/lifetracer_desktop.git"],
  [CATEGORIES.projects, "git@github.com:life-tracer/lifetracer_backend.git"],
  [CATEGORIES.projects, "git@github.com:life-tracer/lifetracer_frontend.git"],
  [CATEGORIES.projects, "git@github.com:life-tracer/lifetracer_setup.git"]
] as const satisfies TRepoTuple[]

// UDS =========================================================================

const uds_repos = [
  [UDS_CATEGORIES.it_works, "git@gitlab.uds.com.br:itworks/contabilidade/application/backend-node.git"],
  [UDS_CATEGORIES.it_works, "git@gitlab.uds.com.br:itworks/contabilidade/application/frontend-react.git"],
  [UDS_CATEGORIES.it_works, "git@gitlab.uds.com.br:itworks/contabilidade/application/service-data.git"],
  [UDS_CATEGORIES.it_works, "git@gitlab.uds.com.br:itworks/contabilidade/application/service-producer.git"],
  [UDS_CATEGORIES.it_works, "git@gitlab.uds.com.br:itworks/contabilidade/application/service-sat.git"],
  [UDS_CATEGORIES.pdv365, "git@gitlab.uds.com.br:pdv365/pdv365/backoffice/backend-node.git"],
  [UDS_CATEGORIES.pdv365, "git@gitlab.uds.com.br:pdv365/pdv365/backoffice/frontend-react.git"],
  [UDS_CATEGORIES.pdv365, "git@gitlab.uds.com.br:pdv365/pdv365/portal-rh/portal-backend.git"],
  [UDS_CATEGORIES.pdv365, "git@gitlab.uds.com.br:pdv365/pdv365/portal-rh/portal-frontend.git"],
  [UDS_CATEGORIES.pdv365, "git@gitlab.uds.com.br:pdv365/pdv365/terminal/terminal-account.git"]
] as const satisfies TRepoTuple[]

// EXPORT ======================================================================

export const REPOS = {
  github_repos,
  lifetracer_repos,
  uds_repos,
}
