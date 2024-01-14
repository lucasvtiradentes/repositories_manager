import { TConfigsProps, getAllParsedRepos } from "../utils/get_parsed_repos";
import { getParseExistantRepos } from "../utils/list_local_repos";
import { logger } from "../utils/logger";
import { customConsoleLog, standardizeStringArray } from "../utils/utils";

export async function removeSyncedRepositories({allRepos, reposFolder}: TConfigsProps){
  const existantRepos = getParseExistantRepos(reposFolder)
  const sortedParsedRepos = getAllParsedRepos({allRepos, reposFolder})
  const allReposStrArr = sortedParsedRepos.map(item => item.repository_path)

  const maxCategoryName = Math.max(...existantRepos.map(repo => repo.domain.length))
  const maxSubcategoryName = Math.max(...existantRepos.map(repo => repo.category.length))
  const maxRepoName = Math.max(...existantRepos.map(repo => repo.repository.length))
  const maxColumnsArr = [maxCategoryName, maxSubcategoryName, maxRepoName]

  if (existantRepos.length > 0){
    logger.info(standardizeStringArray(["domain", "category", "repository", 'action'], maxColumnsArr));
  }

  for (let repo of existantRepos){

    let action = ''

    const commonString = standardizeStringArray([repo.domain, repo.category, repo.repository, ''], maxColumnsArr)
    customConsoleLog(commonString)

    const shouldDelete = allReposStrArr.includes(repo.repository_path) === false
    if (shouldDelete){
      action = "delete"
    } else {
      action = "-"
    }

    customConsoleLog(commonString + action + "\n", true)

  }
}
