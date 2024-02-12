#! /usr/bin/env node

import { program } from 'commander';
import { existsSync } from 'fs';

import { openConfigsCommand } from './commands/open_configs';
import { openRepositoryCommand } from './commands/open_repository';
import { pullMissingReposCommand } from './commands/pull_missing_repos';
import { purgeLocalReposCommand } from './commands/purge_local_repos';
import { removeConfigsCommand } from './commands/remove_configs';
import { setupConfigsCommand } from './commands/setup_configs';
import { APP_INFO } from './consts/app_consts';
import { CONFIGS } from './consts/configs';
import { ERRORS } from './consts/errors';
import { TConfigs, zConfigs } from './consts/schema';
import { getParsedRepositories } from './methods/parse_repositories';
import { TOptionsValues, optionSelect } from './selects/option_select';
import { readJson } from './utils/read_json';
import { TNullable, gracefulThrowError } from './utils/utils';

type TProgramOptions = {
  setup: string;
  uninstall: boolean;
  pull_repos: boolean;
  purge_repos: boolean;
  open_repo: boolean;
  open_configs: boolean;
};

function setupProgramConfigs() {
  program.name(APP_INFO.name).version(APP_INFO.version).description(APP_INFO.description);

  program
    .option('-s, --setup <file>', 'setup your repositories configs file path')
    .option('-u, --uninstall', 'remove the repositories configs file')
    .option('-p, --pull_repos', 'clone missing repositories locally')
    .option('-pg, --purge_repos', 'purge repositories that should not exist locally')
    .option('-or, --open_repo', 'select repository to open')
    .option('-oc, --open_configs', 'open the configs file');

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

function parseCommanderOption(options: TProgramOptions): TNullable<TOptionsValues> {
  if (options.setup) return 'setup_configs';
  if (options.uninstall) return 'remove_configs';
  if (options.pull_repos) return 'pull_missing_repos';
  if (options.purge_repos) return 'purge_local_repos';
  if (options.open_repo) return 'open_repository';
  if (options.open_configs) return 'open_configs';
  return null;
}

async function main() {
  const program = setupProgramConfigs().parse();
  const options = program.opts() satisfies TProgramOptions;
  const parsedOption = parseCommanderOption(options);

  const configsFileExists = existsSync(CONFIGS.user_configs_file);

  if (parsedOption === 'setup_configs') {
    setupConfigsCommand({ configsFileExists, configs_path: options.setup });
    return;
  }

  if (!configsFileExists) gracefulThrowError(ERRORS.method_requires_configs);
  // every method after this needs configs file

  if (parsedOption === 'remove_configs') {
    removeConfigsCommand();
    return;
  }

  const { configsFilePath, userConfisFile } = getParsedConfigsFileOrThrow();
  const parsedRepositories = getParsedRepositories(userConfisFile);

  if (parsedOption === 'pull_missing_repos') {
    pullMissingReposCommand({ parsedRepositories });
    return;
  }

  if (parsedOption === 'purge_local_repos') {
    purgeLocalReposCommand({ parsedRepositories });
    return;
  }

  if (parsedOption === 'open_repository') {
    openRepositoryCommand({ parsedRepositories, userConfisFile });
    return;
  }

  if (parsedOption === 'open_configs') {
    await openConfigsCommand({ configsFilePath, userConfisFile });
    return;
  }

  optionSelect(async (option) => {
    if (option === 'setup_configs') {
      setupConfigsCommand({ configsFileExists, configs_path: options.setup });
    } else if (option === 'remove_configs') {
      removeConfigsCommand();
    } else if (option === 'pull_missing_repos') {
      pullMissingReposCommand({ parsedRepositories });
    } else if (option === 'purge_local_repos') {
      purgeLocalReposCommand({ parsedRepositories });
    } else if (option === 'open_repository') {
      openRepositoryCommand({ parsedRepositories, userConfisFile });
    } else if (option === 'open_configs') {
      await openConfigsCommand({ configsFilePath, userConfisFile });
    }
  });
}

main();
