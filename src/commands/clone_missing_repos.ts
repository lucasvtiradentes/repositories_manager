import { existsSync, mkdirSync } from 'node:fs';

import { TConfigsProps, getAllParsedRepos } from '../utils/get_parsed_repos.js';
import { logger } from '../utils/logger.js';
import { asyncExec, customConsoleLog, standardizeStringArray } from '../utils/utils.js';

export async function cloneMissingRepositories({ allRepos, reposFolder }: TConfigsProps) {
  const sortedParsedRepos = getAllParsedRepos({ allRepos, reposFolder });
  const maxCategoryName = Math.max(...sortedParsedRepos.map((repo) => repo.domain.length));
  const maxSubCategoryName = Math.max(...sortedParsedRepos.map((repo) => repo.category.length));
  const maxRepoName = Math.max(...sortedParsedRepos.map((repo) => repo.repository.length));
  const maxColumnsArr = [maxCategoryName, maxSubCategoryName, maxRepoName];

  if (sortedParsedRepos.length > 0) {
    logger.info(standardizeStringArray(['domain', 'category', 'repository', 'action'], maxColumnsArr));
  }

  for (const item of sortedParsedRepos) {
    let action = '';

    const commonString = standardizeStringArray([item.domain, item.category, item.repository, ''], maxColumnsArr);
    customConsoleLog(commonString);

    if (existsSync(item.repository_path)) {
      action = 'already exists';
    } else {
      if (!existsSync(item.domain)) {
        mkdirSync(item.folder_path, { recursive: true });
      }
      action = 'created';
      await asyncExec(`git clone ${item.git_ssh} ${item.repository_path}`);
    }

    customConsoleLog(commonString + action + '\n', true);
  }
}
