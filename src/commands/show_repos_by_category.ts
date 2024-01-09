import { TRepoTuple } from "../configs/repositories";
import { standardizeStringArray } from "../utils/utils";
import { parseReposInfo } from "./parse_repos_info";

export async function showReposByCategory(reposFolder: string, repos: TRepoTuple[]){
  const sortedParsedRepos = parseReposInfo(reposFolder, repos)

  const maxCategoryName = Math.max(...sortedParsedRepos.map(repo => repo.category.length))
  const maxRepoName = Math.max(...sortedParsedRepos.map(repo => repo.name.length))

  if (sortedParsedRepos.length > 0){
    console.log(" " + standardizeStringArray(["category", "repository"], [maxCategoryName, maxRepoName]));
  }

  let color: 'red' | 'blue' = 'red'
  let curCategory = sortedParsedRepos[0].category

  for (let item of sortedParsedRepos){
    const commonString = standardizeStringArray([item.category, item.name], [maxCategoryName, maxRepoName])

    if (item.category !== curCategory){
      color = color === 'blue' ? 'red' : 'blue'
      curCategory = item.category
    }

    console.log(color === 'blue' ? '\x1b[34m' : '\x1b[31m', commonString, '\x1b[0m');
  }
}