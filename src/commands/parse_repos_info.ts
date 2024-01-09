import { join } from 'node:path';
import { TRepoTuple } from '../configs/repositories.js';
import { extractRepositoryNameFromSshString } from '../utils/utils.js';

export function parseReposInfo(baseFolder: string, repos: TRepoTuple[]){
  const parsedRepos = repos.map(([repoInfo, repoSsh]) => {
    const cloneFolderName = extractRepositoryNameFromSshString(repoSsh) ?? ''
    const categoryPath = join(baseFolder, repoInfo.path)
    const repositoryPath = join(categoryPath, cloneFolderName)

    return {
      ssh: repoSsh,
      name: cloneFolderName,
      category: repoInfo.name,
      categoryPath: categoryPath,
      path: repositoryPath
    }
  })

  const sortedParsedRepos = parsedRepos.sort((a, b) => a.category.localeCompare(b.category))
  return sortedParsedRepos
}
