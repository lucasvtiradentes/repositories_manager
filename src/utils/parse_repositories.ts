import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { TConfigs } from '../consts/schema.js';
import { extractRepositoryNameFromSshString, mergeArraysOfArrays } from './utils.js';

export type TExtendedRepo = TConfigs['ssh_repositories'][number] & {
  repository_name: string;
  folder_path: string;
  local_path: string;
  sync?: boolean;
  exists_locally: boolean;
};

export const getParsedRepositories = (configs: TConfigs) => {
  const parsedGithubRepositories: TExtendedRepo[] = mergeArraysOfArrays(
    Object.entries(configs.github_repositories).map(([github_user, github_repositories]) => {
      const github_user_domain = `github_${github_user}`;
      const parsedGithubUserRepos = Object.entries(github_repositories).map(([repo_name, repo_configs]) => {
        const [category, options] = repo_configs;
        const domain = options?.domain ?? github_user_domain;
        const folder_path = join(configs.path, domain, category ?? '');
        const local_path = join(folder_path, repo_name);
        const exists_locally = existsSync(local_path);
        const git_ssh = `git@github.com:${github_user}/${repo_name}.git`;

        return {
          domain,
          git_ssh,
          repository_name: extractRepositoryNameFromSshString(git_ssh)!,
          category,
          folder_path,
          local_path,
          exists_locally,
          ...options
        };
      });
      return parsedGithubUserRepos;
    })
  );

  const parsedSshRepositories: TExtendedRepo[] = configs.ssh_repositories.map((repo) => {
    const repository_name = extractRepositoryNameFromSshString(repo.git_ssh)!;

    const folder_path = join(configs.path, repo.domain, repo.category ?? '');
    const local_path = join(folder_path, repository_name);
    const exists_locally = existsSync(local_path);

    return {
      ...repo,
      repository_name,
      folder_path,
      local_path,
      exists_locally
    };
  });

  const allRepositories = [...parsedGithubRepositories, ...parsedSshRepositories];

  const sortedRepositories = allRepositories.sort((a, b) => {
    const categoryComparison = a.domain.localeCompare(b.domain);
    if (categoryComparison !== 0) {
      return categoryComparison;
    }
    return (a.category ?? '').localeCompare(b.category ?? '');
  });

  return sortedRepositories;
};
