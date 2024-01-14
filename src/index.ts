import select from '@inquirer/select';
import { homedir } from 'node:os';
import { cloneMissingRepositories } from './commands/clone_missing_repos.js';
import { removeSyncedRepositories } from './commands/remove_synced_repos.js';
import { showReposByCategory } from './commands/show_repos_by_category.js';
import { GITHUB_REPOS_CONFIGS, SSH_REPOS_CONFIGS } from './configs/repositories.js';
import { logger } from './utils/logger.js';
import { getParsedGithubRepos } from './utils/parse_github_items.js';

select({
  message: 'Select an option',
  choices: [
    {
      name: 'download missing repositories',
      value: 'sync_repos',
    },
    {
      name: 'delete local repositories that are not on configs',
      value: 'remove_sync_not_listed_repos',
    },
    {
      name: 'list configs repositories',
      value: 'shows_repos_by_category',
    }
  ]
}).then(async (answer) => {
  logger.info('');

  const configs = {
    allRepos: [...getParsedGithubRepos(GITHUB_REPOS_CONFIGS), ...SSH_REPOS_CONFIGS],
    reposFolder: `${homedir()}/repos`
  }

  if (answer === 'sync_repos'){
    await cloneMissingRepositories(configs)
  } else if (answer === 'remove_sync_not_listed_repos'){
    await removeSyncedRepositories(configs)
  } else if(answer === 'shows_repos_by_category'){
    await showReposByCategory(configs)
  }
})
