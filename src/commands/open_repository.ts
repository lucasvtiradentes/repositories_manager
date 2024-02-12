import { TConfigs } from '../consts/schema';
import { TExtendedRepo } from '../methods/parse_repositories';
import { repositorySelect } from '../selects/repository_select';
import { asyncExec } from '../utils/utils';

type TOpenRepositoryCommandProps = {
  userConfisFile: TConfigs;
  parsedRepositories: TExtendedRepo[];
};

export const openRepositoryCommand = async ({ parsedRepositories, userConfisFile }: TOpenRepositoryCommandProps) => {
  repositorySelect(parsedRepositories, async (repository) => {
    const repoInfo = parsedRepositories.find((repo) => repo.git_ssh === repository)!;
    if (repoInfo.exists_locally) {
      await asyncExec(`${userConfisFile.open_command.repository} ${repoInfo.local_path}`);
    } else {
      console.log('ele nao existe, deseja clonar e abrir em seguida?');
    }
  });
};
