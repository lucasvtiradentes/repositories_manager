import { getAllSubfolders } from './utils';

type TListedRepository = {
  domain: string;
  category: string;
  repository: string;
  repository_path: string;
}

export function getParseExistantRepos(reposFolder: string){
  const allSubfolders = getAllSubfolders(reposFolder)
  const repositoriesFolders = allSubfolders.filter(item => new RegExp(`.git$`, 'g').test(item)).map(item => item.replace("/.git", '').replace(`${reposFolder}/`, ''))

  const parsedRepositories = repositoriesFolders.map(repo => {
    const folderArr = repo.split('/')

    let domain = ''
    let category = '-'
    let repository = ''

    if (folderArr.length === 2){
      [domain, repository] = folderArr
    } else if (folderArr.length === 3){
      [domain, category, repository] = folderArr
    } else {
      return
    }

    return {
      domain,
      category,
      repository,
      repository_path: `${reposFolder}/${repo}`
    }

  }).filter((item): item is TListedRepository => item !== undefined)

  return parsedRepositories
}
