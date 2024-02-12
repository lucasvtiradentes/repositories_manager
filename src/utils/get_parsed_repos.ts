import { join } from 'node:path';

import { extractRepositoryNameFromSshString } from '../utils/utils.js';
import { TRepoParsedItem } from './parse_github_items.js';

type TParsedRepo = {
  repository: string;
  domain: string;
  category: string;
  git_ssh: string;
  folder_path: string;
  repository_path: string;
};

export type TConfigsProps = {
  reposFolder: string;
  allRepos: TRepoParsedItem[];
};

export function getAllParsedRepos({ reposFolder, allRepos }: TConfigsProps): TParsedRepo[] {
  const parsedReposNew = allRepos.map((item) => {
    const repository = extractRepositoryNameFromSshString(item.git_ssh) ?? '';
    const folder_path = join(reposFolder, item.domain, item.category ?? '');
    const repository_path = join(folder_path, repository);
    return {
      repository,
      domain: item.domain,
      category: item.category ?? '-',
      git_ssh: item.git_ssh,
      folder_path,
      repository_path
    };
  });

  const sortedParsedRepos = parsedReposNew.sort((a, b) => {
    const categoryComparison = a.domain.localeCompare(b.domain);
    if (categoryComparison !== 0) {
      return categoryComparison;
    }
    return a.category.localeCompare(b.category);
  });

  return sortedParsedRepos;
}
