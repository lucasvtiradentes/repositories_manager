import { existsSync } from 'node:fs';
import { TConfigs } from './schema.js';
import { extractRepositoryNameFromSshString, mergeArraysOfArrays } from './utils/utils.js';

export const getParsedRepositories = (configs: TConfigs) => {

  const parsedGithubRepositories = mergeArraysOfArrays(Object.entries(configs.github_repositories).map(([github_user, github_repositories]) => {
    const github_user_domain = `github_${github_user}`
    const parsedGithubUserRepos = Object.entries(github_repositories).map(([repo_name, repo_configs]) => {
      const [category, options] = repo_configs
      const domain = options?.domain ?? github_user_domain
      const local_path = `${configs.path}/${domain}/${category ? `${category}/` : ''}${repo_name}`
      const exists_locally = existsSync(local_path)

      return {
        domain,
        git_ssh: `git@github.com:${github_user}/${repo_name}.git`,
        ...(category && { category }),
        local_path,
        exists_locally,
        ...options
      }
    })
    return parsedGithubUserRepos
  }))

  const parsedSshRepositories = configs.ssh_repositories.map(repo => {

    const local_path = `${configs.path}/${repo.domain}/${repo.category ?? ''}/${extractRepositoryNameFromSshString(repo.git_ssh)}`
    const exists_locally = existsSync(local_path)

    return {
      ...repo,
      local_path,
      exists_locally
    }
  })

  return [...parsedGithubRepositories, ...parsedSshRepositories]
}