import { TExtendedRepo } from '../methods/parse_repositories';
import { logger } from '../utils/logger';
import { asyncExec, customConsoleLog, standardizeStringArray } from '../utils/utils';

type TPurgeLocalReposCommandProps = {
  parsedRepositories: TExtendedRepo[];
};

export const purgeLocalReposCommand = async ({ parsedRepositories }: TPurgeLocalReposCommandProps) => {
  const reposToDelete = parsedRepositories.filter((repo) => repo.exists_locally && repo.ignore_sync === true);
  console.log('purge', reposToDelete);

  // OLD ++++++++++++++++++++++++=

  const maxCategoryName = Math.max(...reposToDelete.map((repo) => repo.domain.length));
  const maxSubcategoryName = Math.max(...reposToDelete.map((repo) => (repo.category ?? '').length));
  const maxRepoName = Math.max(...reposToDelete.map((repo) => repo.repository_name.length));
  const maxColumnsArr = [maxCategoryName, maxSubcategoryName, maxRepoName];

  if (reposToDelete.length > 0) {
    logger.info(standardizeStringArray(['domain', 'category', 'repository', 'action'], maxColumnsArr));
  }

  for (const repo of reposToDelete) {
    let action = '';

    const commonString = standardizeStringArray([repo.domain, repo.category ?? '', repo.repository_name, ''], maxColumnsArr);
    customConsoleLog(commonString);

    const curBranch = (await asyncExec(`cd ${repo.local_path} && git rev-parse --abbrev-ref HEAD`)).stdout;
    const originBranch = `origin/${curBranch}`;
    const hasUnpushedChanges = (await asyncExec(`cd ${repo.local_path} && git diff --quiet ${curBranch} ${originBranch} || echo "Differences exist"`)).stdout === 'Differences exist';

    if (hasUnpushedChanges) {
      action = 'should delete but has unpushed changes';
    } else {
      action = 'delete';
      // await asyncExec(`rm -rf ${repo.local_path}`);
    }

    customConsoleLog(commonString + action + '\n', true);
  }
};
