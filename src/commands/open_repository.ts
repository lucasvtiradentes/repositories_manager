import { Configs } from '../consts/schema.js';
import { confirmationSelect } from '../selects/confirmation_select.js';
import { repositorySelect } from '../selects/repository_select.js';
import { ParsedRepository } from '../utils/parse_repositories.js';
import { asyncExec, successfulMessage } from '../utils/utils.js';

type TOpenRepositoryCommandProps = {
  userConfisFile: Configs;
  parsedRepositories: ParsedRepository[];
};

export const openRepositoryCommand = async ({ parsedRepositories, userConfisFile }: TOpenRepositoryCommandProps) => {
  repositorySelect(parsedRepositories, async (repository) => {
    const repoInfo = parsedRepositories.find((repo) => repo.git_ssh === repository)!;

    const openCurrentRepository = async () => {
      const openRepoCommand = `${userConfisFile.open_repo_on_editor_command} ${repoInfo.local_path}`;
      await asyncExec(openRepoCommand);
    };

    if (repoInfo.exists_locally) {
      await openCurrentRepository();
    } else {
      confirmationSelect('this repository does not exists locally, do you want to clone it?', async (shouldClone) => {
        if (shouldClone) {
          await asyncExec(`git clone ${repoInfo.git_ssh} ${repoInfo.local_path}`);
          await openCurrentRepository();
          successfulMessage('repo cloned, make sure to update your configs file to keep everything sync!\n');
        }
      });
    }
  });
};
