import { existsSync, mkdirSync } from 'node:fs';
import { TRepoTuple } from '../configs/repositories.js';
import { asyncExec, customConsoleLog, standardizeStringArray } from '../utils/utils.js';
import { parseReposInfo } from './parse_repos_info.js';

export async function cloneMissingRepositories(baseFolder: string, repos: TRepoTuple[]){
  const sortedParsedRepos = parseReposInfo(baseFolder, repos)
  const maxCategoryName = Math.max(...sortedParsedRepos.map(repo => repo.category.length))
  const maxRepoName = Math.max(...sortedParsedRepos.map(repo => repo.name.length))

  if (sortedParsedRepos.length > 0){
    console.log(standardizeStringArray(["category", "repository", 'action'], [maxCategoryName, maxRepoName]));
  }

  for (let item of sortedParsedRepos){
    let action = ''

    const commonString = standardizeStringArray([item.category, item.name, ''], [maxCategoryName, maxRepoName])
    customConsoleLog(commonString)

    if (existsSync(item.path)){
      action = 'already exists'
    } else {
      if (!existsSync(item.category)){
        mkdirSync(item.categoryPath, { recursive: true })
      }
      action = 'created'
      await asyncExec(`git clone ${item.ssh} ${item.path}`)
    }

    customConsoleLog(commonString + action + "\n", true)
  }

}