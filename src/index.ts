import { homedir } from 'node:os';
import { cloneMissingRepositories } from './commands/clone_missing_repos.js';
import { REPOS, TRepoTuple } from './configs/repositories.js';

const REPOS_FOLDER = `${homedir()}/repos`

const personalRepos: TRepoTuple[] = [
  ...REPOS.github_repos,
  ...REPOS.lifetracer_repos,
]

const workRepos: TRepoTuple[] = [
  // ...REPOS.uds_repos
]

async function main(){
  await syncMissingRepositories(REPOS_FOLDER)
  // await showReposByCategory(REPOS_FOLDER, personalRepos)
}

main()

// =============================================================================

async function syncMissingRepositories(reposFolder: string){
  console.log(`Cloning PERSONAL repositories [${personalRepos.length}]:\n`);
  await cloneMissingRepositories(reposFolder, personalRepos)

  console.log(`\n\nCloning WORK repositories [${workRepos.length}]:\n`);
  await cloneMissingRepositories(reposFolder, workRepos)
}
