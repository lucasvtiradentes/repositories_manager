#! /usr/bin/env node

import { program } from 'commander';
import { existsSync, unlinkSync, writeFileSync } from 'fs';

import { APP_INFO } from './consts/app_consts';
import { CONFIGS } from './consts/configs';
import { ERRORS } from './consts/errors';
import { getParsedRepositories } from './parse_repositories';
import { TConfigs, zConfigs } from './schema';
import { optionSelect } from './selects/option_select';
import { repositorySelect } from './selects/repository_select';
import { readJson } from './utils/read_json';
import { asyncExec, gracefulThrowError, successfulMessage } from './utils/utils';

type TProgramOptions = {
  setup: string;
  uninstall: boolean;
  pull: boolean;
  purge: boolean;
  repo: boolean;
  configs: boolean;
};

function setupProgramConfigs() {
  program.name(APP_INFO.name).version(APP_INFO.version).description(APP_INFO.description);

  program
    .option('-s, --setup <file>', 'setup your repositories configs file path')
    .option('-u, --uninstall', 'remove the repositories configs file')
    .option('-p, --pull', 'clone missing repositories locally')
    .option('-pg, --purge', 'purge repositories that should not exist locally')
    .option('-or, --repo', 'select repository to open')
    .option('-oc, --configs', 'open the configs file');

  return program;
}

function getParsedConfigsFileOrThrow() {
  const configsFile = readJson(CONFIGS.user_configs_file) as { configs_path: string };
  if (!existsSync(configsFile.configs_path)) gracefulThrowError(ERRORS.configs_file_does_not_exists);

  const userConfisFile = readJson(configsFile.configs_path) as TConfigs;
  if (!zConfigs.safeParse(userConfisFile).success) {
    gracefulThrowError(ERRORS.configs_file_dont_follow_required_schema);
  }

  return { configsFilePath: configsFile.configs_path, userConfisFile };
}

async function main() {
  const program = setupProgramConfigs().parse();
  const options = program.opts() satisfies TProgramOptions;
  const configsFileExists = existsSync(CONFIGS.user_configs_file);

  if (options.setup) {
    writeFileSync(CONFIGS.user_configs_file, JSON.stringify({ configs_path: options.setup }, null, 2));
    successfulMessage(`you have successfully ${configsFileExists ? 'updated' : 'configured'} ${APP_INFO.name}!`);
    return;
  }

  if (!configsFileExists) gracefulThrowError(ERRORS.method_requires_configs);
  // every method after this needs configs file

  if (options.uninstall) {
    unlinkSync(CONFIGS.user_configs_file);
    successfulMessage('your configs file was removed!');
    return;
  }

  const { configsFilePath, userConfisFile } = getParsedConfigsFileOrThrow();
  const parsedRepositories = getParsedRepositories(userConfisFile);

  if (options.pull) {
    const reposToClone = parsedRepositories.filter((repo) => repo.exists_locally === false && repo.ignore_sync !== true);
    console.log('pull', reposToClone);
    return;
  }

  if (options.purge) {
    const reposToDelete = parsedRepositories.filter((repo) => repo.exists_locally && repo.ignore_sync === true);
    console.log('purge', reposToDelete);
    return;
  }

  if (options.repo) {
    repositorySelect(parsedRepositories, async (repository) => {
      const repoInfo = parsedRepositories.find((repo) => repo.git_ssh === repository)!;
      if (repoInfo.exists_locally) {
        await asyncExec(`${userConfisFile.open_command.repository} ${repoInfo.local_path}`);
      } else {
        console.log('ele nao existe, deseja clonar e abrir em seguida?');
      }
    });

    return;
  }

  if (options.configs) {
    await asyncExec(`${userConfisFile.open_command.configs} ${configsFilePath}`);
    return;
  }

  optionSelect(async (option) => {
    if (option === 'setup_configs') {
      console.log('setup_configs');
    } else if (option === 'remove_configs') {
      console.log('remove_configs');
    } else if (option === 'pull_missing_repos') {
      console.log('pull_missing_repos');
    } else if (option === 'purge_local_repos') {
      console.log('purge_local_repos');
    } else if (option === 'open_repository') {
      console.log('open_repository');
    } else if (option === 'open_configs') {
      console.log('open_configs');
    }
  });
}

main();
