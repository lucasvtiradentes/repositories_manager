import { TExtendedRepo } from '../methods/parse_repositories';
import { confirmationSelect } from '../selects/confirmation_select';
import { logger } from '../utils/logger';
import { asyncExec, standardizeStringArray, successfulMessage } from '../utils/utils';

type TPurgeLocalReposCommandProps = {
  parsedRepositories: TExtendedRepo[];
};

export const purgeLocalReposCommand = async ({ parsedRepositories }: TPurgeLocalReposCommandProps) => {
  const reposToDelete = parsedRepositories.filter((repo) => repo.exists_locally && repo.ignore_sync === true);

  const maxCategoryName = Math.max(...reposToDelete.map((repo) => repo.domain.length));
  const maxSubcategoryName = Math.max(...reposToDelete.map((repo) => (repo.category ?? '').length));
  const maxRepoName = Math.max(...reposToDelete.map((repo) => repo.repository_name.length));
  const maxColumnsArr = [maxCategoryName, maxSubcategoryName, maxRepoName];

  if (reposToDelete.length === 0) {
    logger.info('there are no repositories to be deleted locally!\n');
    return;
  }

  logger.info('the following repositories are tracked to be deleted: \n');
  logger.info(standardizeStringArray(['domain', 'category', 'repository', 'action'], maxColumnsArr));

  for (const repo of reposToDelete) {
    const commonString = standardizeStringArray([repo.domain, repo.category ?? '', repo.repository_name, ''], maxColumnsArr);
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
