#! /usr/bin/env node

import { program } from 'commander';
import { existsSync } from 'fs';
import { platform } from 'os';

import { openConfigsCommand } from './commands/open_configs.js';
import { openRepositoryCommand } from './commands/open_repository.js';
import { pullMissingReposCommand } from './commands/pull_missing_repos.js';
import { purgeLocalReposCommand } from './commands/purge_local_repos.js';
import { removeConfigsCommand } from './commands/remove_configs.js';
import { setupConfigsCommand } from './commands/setup_configs.js';
import { APP_INFO } from './consts/app_consts.js';
import { CONFIGS } from './consts/configs.js';
import { ERRORS } from './consts/errors.js';
import { TConfigs, configsSchema } from './consts/schema.js';
import { TOptionsValues, optionSelect } from './selects/option_select.js';
import { createUserConfigsFile } from './utils/configs_hanlder.js';
import { getParsedRepositories } from './utils/parse_repositories.js';
import { readJson } from './utils/read_json.js';
import { TNullable, gracefulThrowError } from './utils/utils.js';

type TProgramOptions = {
  setup: string;
  remove: boolean;
  pull_repos: boolean;
  purge_repos: boolean;
  open_repo: boolean;
  open_configs: boolean;
};

function setupProgramConfigs() {
  program.name(APP_INFO.name).version(APP_INFO.version).description(APP_INFO.description);

  program
    .option('-s, --setup <file>', 'setup your repositories configs file path')
    .option('-r, --remove', 'remove the repositories configs file')
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
  if (!configsSchema.safeParse(userConfisFile).success) {
    gracefulThrowError(ERRORS.configs_file_dont_follow_required_schema);
  }

  return { configsFilePath: configsFile.configs_path, userConfisFile };
}

function parseCommanderOption(options: TProgramOptions): TNullable<TOptionsValues> {
  if (options.setup) return 'setup_configs';
  if (options.remove) return 'remove_configs';
  if (options.pull_repos) return 'pull_missing_repos';
  if (options.purge_repos) return 'purge_local_repos';
  if (options.open_repo) return 'open_repository';
  if (options.open_configs) return 'open_configs';
  return null;
}

async function main() {
  if (!CONFIGS.supported_os.includes(platform() as (typeof CONFIGS.supported_os)[number])) {
    gracefulThrowError(ERRORS.system_not_supported);
  }

  if (!existsSync(CONFIGS.user_configs_file)) {
    createUserConfigsFile();
  }

  const program = setupProgramConfigs().parse();
  const options = program.opts() satisfies TProgramOptions;
  const parsedOption = parseCommanderOption(options);

  if (parsedOption === 'setup_configs') {
    setupConfigsCommand({ configs_path: options.setup });
    return;
  }

  // if it does not exists means the user has not configured their repos
  const shouldShowHelpOrThrowError = !existsSync(CONFIGS.user_configs_file);

  if (shouldShowHelpOrThrowError) {
    const hasSpecifiedAnOption = Object.keys(options).length > 0;

    if (hasSpecifiedAnOption) {
      gracefulThrowError(ERRORS.method_requires_configs);
    } else {
      program.help();
      return;
    }
  }

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
    openConfigsCommand({ configsFilePath, userConfisFile });
    return;
  }

  optionSelect(async (option) => {
    if (option === 'remove_configs') {
      removeConfigsCommand();
    } else if (option === 'pull_missing_repos') {
      pullMissingReposCommand({ parsedRepositories });
    } else if (option === 'purge_local_repos') {
      purgeLocalReposCommand({ parsedRepositories });
    } else if (option === 'open_repository') {
      openRepositoryCommand({ parsedRepositories, userConfisFile });
    } else if (option === 'open_configs') {
      openConfigsCommand({ configsFilePath, userConfisFile });
    }
  });
}

main();
