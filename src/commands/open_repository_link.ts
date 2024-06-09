import { execSync } from 'node:child_process';
import { platform } from 'node:os';

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
    darwin: 'open',
    win32: 'start',
    linux: 'xdg-open'
  } as const;
  type TSupportedOs = keyof typeof openCommandMapper;

  const oppenLinkCommand = openCommandMapper[platform() as TSupportedOs];
  execSync(`${oppenLinkCommand} ${url}`);
}
