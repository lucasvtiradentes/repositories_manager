import { writeFileSync } from 'fs';

import { TConfigs } from '../consts/schema.js';
import { confirmationSelect } from '../selects/confirmation_select.js';
import { logger } from '../utils/logger.js';
import { ParsedRepository } from '../utils/parse_repositories.js';
import { readJson } from '../utils/read_json.js';
import { asyncExec, getAllSubfolders, successfulMessage } from '../utils/utils.js';

type updateConfigsCommandProps = {
  repositories: ParsedRepository[];
  configs: TConfigs;
  configs_path: string;
};

export const updateConfigsCommand = async (props: updateConfigsCommandProps) => {
  const gitFolders = getAllSubfolders(props.configs.path)
    .filter((folder) => folder.endsWith('.git'))
    .map((folder) => folder.replace('/.git', '').replace('\\.git', ''));

  const newRepos = gitFolders.filter((folder) => !props.repositories.some((repo) => repo.local_path === folder));

  const parsedRepos = [] as Extract<TConfigs['ssh_repositories'][number], { local_path: string }>[];
  for (const repo of newRepos) {
    parsedRepos.push({
      local_path: repo,
      git_ssh: (await asyncExec(`git -C ${repo} config --get remote.origin.url`)).stdout,
      sync: true
    });
  }

  const oldConfigsContent = readJson(props.configs_path) as unknown as TConfigs;
  const oldSshReposContent = oldConfigsContent.ssh_repositories;

  if (parsedRepos.length === 0) {
    logger.info('\nthere are no new repositories to be added!\n');
    return;
  }

  logger.info(`\nthe following repositories will be added to your current configs file:\n\n${parsedRepos.map((item) => item.local_path).join('\n')}\n`);

  confirmationSelect('are you sure you want to add them?', async (shouldAddRepos) => {
    if (shouldAddRepos) {
      writeFileSync(props.configs_path, JSON.stringify({ ...oldConfigsContent, ssh_repositories: [...oldSshReposContent, ...parsedRepos] }, null, 2), 'utf8');
      successfulMessage('configs file was successfully updated!\n');
    }
  });
};
