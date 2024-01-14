import select from '@inquirer/select';
import { homedir } from 'node:os';
import { cloneMissingRepositories } from './commands/clone_missing_repos.js';
import { removeSyncedRepositories } from './commands/remove_synced_repos.js';
import { showReposByCategory } from './commands/show_repos_by_category.js';
import { REPOS, TRepoTuple } from './configs/repositories.js';

const REPOS_FOLDER = `${homedir()}/repos`

const personalRepos: TRepoTuple[] = [
  ...REPOS.github_repos,
  ...REPOS.lifetracer_repos,
]

const workRepos: TRepoTuple[] = [
  ...REPOS.uds_repos
]

// =============================================================================

select({
  message: 'Select an option',
  choices: [
    {
      name: 'sincronizar repositórios',
      value: 'sync_repos',
    },
    {
      name: 'remover repositórios (sincronizados) não listados',
      value: 'remove_sync_not_listed_repos',
    },
    {
      name: 'mostrar repositórios por categorias',
      value: 'shows_repos_by_category',
    }
  ]
}).then(async (answer) => {
  console.log('');

  if (answer === 'sync_repos'){

    console.log(`Cloning PERSONAL repositories [${personalRepos.length}]:\n`);
    await cloneMissingRepositories(REPOS_FOLDER, personalRepos)

    console.log(`\nCloning WORK repositories [${workRepos.length}]:\n`);
    await cloneMissingRepositories(REPOS_FOLDER, workRepos)

  } else if (answer === 'remove_sync_not_listed_repos'){

    await removeSyncedRepositories(REPOS_FOLDER, personalRepos, 'github')
    console.log('');
    await removeSyncedRepositories(REPOS_FOLDER, workRepos, 'uds')

  } else if(answer === 'shows_repos_by_category'){

    await showReposByCategory(REPOS_FOLDER, personalRepos)

  }
})
