import { getParsedRepositories } from "./parse_repositories";
import { TConfigs, zConfigs } from "./schema";
import { readJson } from "./utils/read_json";


const file = readJson('./examples/configs.json') as TConfigs
zConfigs.parse(file)

const parsedRepositories = getParsedRepositories(file)
console.log(parsedRepositories);

// optionSelect(async (option) => {
//   logger.info('');

//   const configs = {
//     allRepos: [...getParsedGithubRepos(GITHUB_REPOS_CONFIGS), ...SSH_REPOS_CONFIGS],
//     reposFolder: `${homedir()}/repos`
//   }

//   console.log(configs.allRepos);

//   if (option === 'sync_repos'){
//     await cloneMissingRepositories(configs)
//   } else if (option === 'remove_sync_not_listed_repos'){
//     await removeSyncedRepositories(configs)
//   } else if(option === 'shows_repos_by_category'){
//     await showReposByCategory(configs)
//   } else if (option === 'list_repos_to_open'){
//     await openRepository(configs)
//   }
// })