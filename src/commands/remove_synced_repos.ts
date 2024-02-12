import { CONFIGS } from "../consts/configs";
import { TConfigsProps, getAllParsedRepos } from "../utils/get_parsed_repos";
import { getParseExistantRepos } from "../utils/list_local_repos";
import { logger } from "../utils/logger";
import { asyncExec, customConsoleLog, standardizeStringArray } from "../utils/utils";

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
      const curBranch = (await asyncExec(`cd ${repo.repository_path} && git rev-parse --abbrev-ref HEAD`)).stdout
      const originBranch = `origin/${curBranch}`
      const hasUnpushedChanges = (await asyncExec(`cd ${repo.repository_path} && git diff --quiet ${curBranch} ${originBranch} || echo "Differences exist"`)).stdout === "Differences exist"

      if (repo.repository === CONFIGS.repo_sync_name) {
        action = "should not delete the current repo"
      } else if (hasUnpushedChanges) {
        action = "should delete but has unpushed changes"
      } else {
        action = "delete"
        await asyncExec(`rm -rf ${repo.repository_path}`)
      }

    } else {
      action = "-"
    }

    customConsoleLog(commonString + action + "\n", true)

  }
}
