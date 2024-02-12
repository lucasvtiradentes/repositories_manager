import { homedir } from 'node:os';
import { cloneMissingRepositories } from './commands/clone_missing_repos.js';
import { removeSyncedRepositories } from './commands/remove_synced_repos.js';
import { showReposByCategory } from './commands/show_repos_by_category.js';
import { GITHUB_REPOS_CONFIGS, SSH_REPOS_CONFIGS } from './configs/repositories.js';
import { optionSelect } from './selects/option_select';
import { repositorySelect } from './selects/repository_select';
import { logger } from './utils/logger.js';
import { getParsedGithubRepos } from './utils/parse_github_items.js';

optionSelect(async (option) => {
  logger.info('');

  const configs = {
    allRepos: [...getParsedGithubRepos(GITHUB_REPOS_CONFIGS), ...SSH_REPOS_CONFIGS],
    reposFolder: `${homedir()}/repos`
  }

  if (option === 'sync_repos'){
    await cloneMissingRepositories(configs)
  } else if (option === 'remove_sync_not_listed_repos'){
    await removeSyncedRepositories(configs)
  } else if(option === 'shows_repos_by_category'){
    await showReposByCategory(configs)
  } else if (option === 'list_repos_to_open'){
    repositorySelect(configs.allRepos, async (repository) => {
      console.log(repository);
    })
  }
})