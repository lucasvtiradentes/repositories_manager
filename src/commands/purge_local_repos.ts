import { confirmationSelect } from '../selects/confirmation_select.js';
import { logger } from '../utils/logger.js';
import { ParsedRepository } from '../utils/parse_repositories.js';
import { asyncExec, standardizeStringArray, successfulMessage } from '../utils/utils.js';

type PurgeLocalReposCommandProps = {
  parsedRepositories: ParsedRepository[];
};

export const purgeLocalReposCommand = async ({ parsedRepositories }: PurgeLocalReposCommandProps) => {
  const reposToDelete = parsedRepositories.filter((repo) => repo.exists_locally && repo.sync !== true);

  const maxCategoryName = Math.max(...reposToDelete.map((repo) => (repo.domain ?? '').length));
  const maxSubcategoryName = Math.max(...reposToDelete.map((repo) => (repo.group ?? '').length));
  const maxRepoName = Math.max(...reposToDelete.map((repo) => repo.repository_name.length));
  const maxColumnsArr = [maxCategoryName, maxSubcategoryName, maxRepoName];

  if (reposToDelete.length === 0) {
    logger.info('there are no repositories to be deleted locally!\n');
    return;
  }

  logger.info('the following repositories are tracked to be deleted: \n');
  logger.info(standardizeStringArray(['domain', 'category', 'repository', 'action'], maxColumnsArr));

  for (const repo of reposToDelete) {
    const commonString = standardizeStringArray([repo.domain ?? '', repo.group ?? '', repo.repository_name, ''], maxColumnsArr);
    logger.info(commonString);
  }

  logger.info('');

  confirmationSelect('are you sure you want to delete them?', async (shouldDeleteRepos) => {
    if (shouldDeleteRepos) {
      for (const repo of reposToDelete) {
        await asyncExec(`rm -rf ${repo.local_path}`);
        logger.info(`deleted ${repo.repository_name}`);
      }

      successfulMessage('all repositories were locally deleted!\n');
    }
  });
};
