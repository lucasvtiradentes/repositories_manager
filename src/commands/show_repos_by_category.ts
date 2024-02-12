import { TConfigsProps, getAllParsedRepos } from '../utils/get_parsed_repos';
import { logger } from '../utils/logger';
import { standardizeStringArray } from '../utils/utils';

export async function showReposByCategory({ allRepos, reposFolder }: TConfigsProps) {
  const sortedParsedRepos = getAllParsedRepos({ allRepos, reposFolder });
  const maxCategoryName = Math.max(...sortedParsedRepos.map((repo) => repo.domain.length));
  const maxSubCategoryName = Math.max(...sortedParsedRepos.map((repo) => repo.category.length));
  const maxRepoName = Math.max(...sortedParsedRepos.map((repo) => repo.repository.length));
  const maxColumnsArr = [maxCategoryName, maxSubCategoryName, maxRepoName];

  if (sortedParsedRepos.length > 0) {
    logger.info(' ' + standardizeStringArray(['domain', 'category', 'repository', 'state'], maxColumnsArr));
  }

  let color: 'red' | 'blue' = 'red';
  let curCategory = sortedParsedRepos[0].domain;

  for (const item of sortedParsedRepos) {
    const commonString = standardizeStringArray([item.domain, item.category, item.repository, '-'], maxColumnsArr);

    if (item.domain !== curCategory) {
      color = color === 'blue' ? 'red' : 'blue';
      curCategory = item.domain;
    }

    logger.info(color === 'blue' ? '\x1b[34m' : '\x1b[31m', commonString, '\x1b[0m');
  }
}
