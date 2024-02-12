import { repositorySelect } from '../selects/repository_select';
import { TConfigsProps } from '../utils/get_parsed_repos';

export async function openRepository({ allRepos, reposFolder }: TConfigsProps) {
  repositorySelect(allRepos, async (repository) => {
    console.log({ reposFolder, repository });
  });
}
