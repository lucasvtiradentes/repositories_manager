import { readdirSync, existsSync } from 'node:fs';
import { TRepoTuple } from '../configs/repositories.js';
import { asyncExec, customConsoleLog, standardizeStringArray } from '../utils/utils.js';
import { parseReposInfo } from './parse_repos_info.js';
import {resolve} from 'node:path';

function getAllSubfolders(dir: string, subfolders: string[] = []): string[] {
  const ignoredFolders = [".git", "node_modules", "dist"]

    readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isDirectory()) {
        const subDir = resolve(dir, dirent.name);
        subfolders.push(subDir);

        if (!ignoredFolders.some(ignoredFolder => subDir.includes(ignoredFolder))){
          getAllSubfolders(subDir, subfolders);
        }
      }
    });
    return subfolders;
}

function parseExistantRepos(baseFolder: string, domain: string){
  const initialRepos = getAllSubfolders(baseFolder).map(item => item.replace(baseFolder, '')).map(item => {
    const folderArr = item.split('/')
    const [, base, category, project, ...rest] = folderArr

    if (folderArr.length === 4 && domain === base){
      return {
        base,
        category,
        project,
        path: `${baseFolder}/${base}/${category}/${project}`
      }
    }
  }).filter((item) => item !== undefined)

  return initialRepos
}

export async function removeSyncedRepositories(baseFolder: string, repos: TRepoTuple[], base: string){
  const sortedParsedRepos = parseReposInfo(baseFolder, repos)
  const existantRepos = parseExistantRepos(baseFolder, base)
  const allRepos = sortedParsedRepos.map(item => item.path)

  const maxCategoryName = Math.max(...existantRepos.map(repo => repo!.category.length))
  const maxRepoName = Math.max(...existantRepos.map(repo => repo!.project.length))

  if (existantRepos.length > 0){
    console.log(standardizeStringArray(["category", "repository", 'action'], [maxCategoryName, maxRepoName]));
  }

  for (let repo of existantRepos){

    let action = ''

    const commonString = standardizeStringArray([repo!.category, repo!.project, ''], [maxCategoryName, maxRepoName])
    customConsoleLog(commonString)

    const shouldDelete = allRepos.includes(repo!.path) === false
    if (shouldDelete){
      action = "delete"
    } else {
      action = "-"
    }

    customConsoleLog(commonString + action + "\n", true)

  }
}