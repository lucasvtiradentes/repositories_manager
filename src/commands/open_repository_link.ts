import { execSync } from 'node:child_process';

import { CONFIGS, SupportedOS } from '../consts/configs.js';
import { repositorySelect } from '../selects/repository_select.js';
import { ParsedRepository } from '../utils/parse_repositories.js';
import { gracefulThrowError } from '../utils/utils.js';

type TOpenRepositoryCommandProps = {
  parsedRepositories: ParsedRepository[];
};

export const openRepositoryLinkCommand = async ({ parsedRepositories }: TOpenRepositoryCommandProps) => {
  repositorySelect(parsedRepositories, async (repository) => {
    const repoInfo = parsedRepositories.find((repo) => repo.git_ssh === repository)!;

    if (repoInfo.link) {
      openURL(repoInfo.link);
    } else {
      gracefulThrowError('the repo does not have an associated link!');
    }
  });
};

function openURL(url: string) {
  const openCommandMapper = {
    mac: 'open',
    windows: 'start',
    linux: 'xdg-open',
    wsl: 'cmd.exe /c start'
  } as const satisfies Record<SupportedOS, string>;

  const oppenLinkCommand = openCommandMapper[CONFIGS.user_os];
  execSync(`${oppenLinkCommand} "${url}" > /dev/null 2>&1`);
}
