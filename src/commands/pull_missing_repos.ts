import { existsSync, mkdirSync } from 'node:fs';

import { confirmationSelect } from '../selects/confirmation_select.js';
import { logger } from '../utils/logger.js';
import { TExtendedRepo } from '../utils/parse_repositories.js';
import { asyncExec, removeLastDirectory, standardizeStringArray, successfulMessage } from '../utils/utils.js';

type TPullMissingReposCommandProps = {
  parsedRepositories: TExtendedRepo[];
};

export const pullMissingReposCommand = async ({ parsedRepositories }: TPullMissingReposCommandProps) => {
  const reposToClone = parsedRepositories.filter((repo) => repo.exists_locally === false && repo.sync === true);

  const maxCategoryName = Math.max(...reposToClone.map((repo) => repo.domain.length));
  const maxSubCategoryName = Math.max(...reposToClone.map((repo) => (repo.category ?? '').length));
  const maxRepoName = Math.max(...reposToClone.map((repo) => repo.repository_name.length));
  const maxColumnsArr = [maxCategoryName, maxSubCategoryName, maxRepoName];

  if (reposToClone.length === 0) {
    logger.info('there are no repositories to be cloned!\n');
    return;
  }

  logger.info('the following repositories are tracked to be clonned: \n');
  logger.info(standardizeStringArray(['domain', 'category', 'repository'], maxColumnsArr));

  for (const item of reposToClone) {
    const commonString = standardizeStringArray([item.domain, item.category ?? '-', item.repository_name, ''], maxColumnsArr);
    logger.info(commonString);
  }

  logger.info('');

  confirmationSelect('are you sure you want to clone them?', async (shouldCloneRepos) => {
    if (shouldCloneRepos) {
      for (const repo of reposToClone) {
        const parentFolder = removeLastDirectory(repo.local_path);
        if (!existsSync(parentFolder)) {
          mkdirSync(parentFolder, { recursive: true });
        }
        await asyncExec(`git clone ${repo.git_ssh} ${repo.local_path}`);
        logger.info(`clonned ${repo.repository_name}`);
      }

      successfulMessage('all repositories were cloned!\n');
    }
  });
};
