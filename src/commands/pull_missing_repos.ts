import { existsSync, mkdirSync } from 'node:fs';

import { TExtendedRepo } from '../methods/parse_repositories';
import { logger } from '../utils/logger.js';
import { asyncExec, customConsoleLog, delay, standardizeStringArray } from '../utils/utils.js';

type TPullMissingReposCommandProps = {
  parsedRepositories: TExtendedRepo[];
};

export const pullMissingReposCommand = async ({ parsedRepositories }: TPullMissingReposCommandProps) => {
  const reposToClone = parsedRepositories.filter((repo) => repo.exists_locally === false && repo.ignore_sync !== true);

  const maxCategoryName = Math.max(...reposToClone.map((repo) => repo.domain.length));
  const maxSubCategoryName = Math.max(...reposToClone.map((repo) => (repo.category ?? '').length));
  const maxRepoName = Math.max(...reposToClone.map((repo) => repo.repository_name.length));
  const maxColumnsArr = [maxCategoryName, maxSubCategoryName, maxRepoName];

  if (reposToClone.length > 0) {
    logger.info(standardizeStringArray(['domain', 'category', 'repository', 'action'], maxColumnsArr));
  }

  for (const item of reposToClone) {
    let action = '';

    const commonString = standardizeStringArray([item.domain, item.category ?? '-', item.repository_name, ''], maxColumnsArr);
    customConsoleLog(commonString);

    if (item.exists_locally) {
      action = 'already exists';
    } else {
      if (!existsSync(item.domain)) {
        mkdirSync(item.folder_path, { recursive: true });
      }
      action = 'cloned';
      await delay(1000);
      // await asyncExec(`git clone ${item.git_ssh} ${item.local_path}`);
    }

    customConsoleLog(commonString + action + '\n', true);
  }
};
