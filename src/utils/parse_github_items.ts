import { TGithubRepos } from '../configs/repositories.js';
import { mergeArraysOfArrays } from '../utils/utils.js';

export type TRepoParsedItem = {
  git_ssh: string;
  domain: string;
  category: string;
};

export function getParsedGithubRepos(githubRepos: TGithubRepos) {
  const parsedRepos = Object.entries(githubRepos).map((item) => {
    const [githubUser, categoryReposObj] = item;

    const categoriesReposArr = Object.entries(categoryReposObj).map((it) => {
      const [repoName, repoInfo] = it;
      const git_ssh = `git@github.com:${githubUser}/${repoName}.git`;
      return {
        domain: repoInfo.domain,
        ...(repoInfo.category ? { category: repoInfo.category } : {}),
        git_ssh
      };
    });

    return categoriesReposArr;
  });

  return mergeArraysOfArrays(parsedRepos) as TRepoParsedItem[];
}
