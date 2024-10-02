import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { GithubRepository, Configs } from '../consts/schema.js';
import { extractLinkFromSshString, extractRepositoryNameFromSshString, mergeArraysOfArrays } from './utils.js';

export type ParsedRepository = {
  domain: string;
  group: string;
  sync: boolean;
  link: string;
  git_ssh: string;
  repository_name: string;
  local_path: string;
  exists_locally: boolean;
};

export const getParsedRepositories = (configs: Configs, parsedReposPath: string) => {
  const parsedGithubRepositories = mergeArraysOfArrays(
    Object.entries(configs.github_repositories).map(([github_user, github_repositories]) => {
      const github_user_domain = `github_${github_user}`;
      const parsedGithubUserRepos = Object.entries(github_repositories).map(([repo_name, repo_configs]) => {
        const { link, sync, ...rest } = repo_configs as unknown as GithubRepository;
        const local_path = 'local_path' in rest ? rest?.local_path : join(join(parsedReposPath, rest?.domain ?? github_user_domain, rest.group ?? ''), repo_name);
        const exists_locally = existsSync(local_path);
        const git_ssh = `git@github.com:${github_user}/${repo_name}.git`;

        return {
          sync: sync ?? false,
          git_ssh,
          repository_name: extractRepositoryNameFromSshString(git_ssh)!,
          local_path,
          exists_locally,
          link: link ?? extractLinkFromSshString(git_ssh),
          domain: 'domain' in rest ? rest.domain! : github_user_domain,
          group: 'group' in rest ? rest.group! : ''
        } satisfies ParsedRepository;
      });
      return parsedGithubUserRepos;
    })
  );

  const parsedSshRepositories = configs.ssh_repositories.map((repo) => {
    const repository_name = extractRepositoryNameFromSshString(repo.git_ssh)!;

    const local_path = 'local_path' in repo ? repo.local_path : join(join(parsedReposPath, repo?.domain ?? '', repo.group ?? ''), repository_name);
    const exists_locally = existsSync(local_path);

    return {
      repository_name,
      local_path,
      exists_locally,
      link: repo.link ?? extractLinkFromSshString(repo.git_ssh),
      git_ssh: repo.git_ssh,
      sync: repo.sync ?? false,
      domain: 'domain' in repo ? repo.domain! : '',
      group: 'group' in repo ? repo.group! : ''
    } satisfies ParsedRepository;
  });

  const allRepositories: ParsedRepository[] = [...parsedGithubRepositories, ...parsedSshRepositories];

  const sortedRepositories = allRepositories.sort((a, b) => {
    const categoryComparison = (a?.domain ?? '').localeCompare(b?.domain ?? '');
    if (categoryComparison !== 0) {
      return categoryComparison;
    }
    return (a.group ?? '').localeCompare(b.group ?? '');
  });

  return sortedRepositories;
};
