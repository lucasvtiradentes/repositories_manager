#! /usr/bin/env node

import { program } from 'commander';
import { existsSync } from 'fs';

import { openConfigsCommand } from './commands/open_configs.js';
import { openRepositoryLinkCommand } from './commands/open_repository_link.js';
import { openRepositoryCommand } from './commands/open_repository.js';
import { pullMissingReposCommand } from './commands/pull_missing_repos.js';
import { purgeLocalReposCommand } from './commands/purge_local_repos.js';
import { removeConfigsCommand } from './commands/remove_configs.js';
import { setupConfigsCommand } from './commands/setup_configs.js';
import { updateConfigsCommand } from './commands/update_configs.js';
import { APP_INFO } from './consts/app_consts.js';
import { CONFIGS } from './consts/configs.js';
import { ERRORS } from './consts/errors.js';
import { Configs, configsSchema } from './consts/schema.js';
import { SELECT_OPTIONS_ENUM, TOptionsValues, optionSelect } from './selects/option_select.js';
import { UserConfigs, createUserConfigsFile } from './utils/configs_handler.js';
import { getParsedRepositories } from './utils/parse_repositories.js';
import { readJson } from './utils/read_json.js';
import { Nullable, gracefulThrowError } from './utils/utils.js';

type ProgramOptions = {
  setup: string;
  remove: boolean;
  pull_repos: boolean;
  purge_repos: boolean;
  open_repo: boolean;
  open_repo_link: boolean;
  open_configs: boolean;
  update_configs: boolean;
};

function setupProgramConfigs() {
  program.name(APP_INFO.name).version(APP_INFO.version).description(APP_INFO.description);

  program
    .option('-s, --setup <file>', 'setup your repositories configs file path')
    .option('-r, --remove', 'remove the repositories configs file')
    .option('-p, --pull_repos', 'clone missing repositories locally')
    .option('-pg, --purge_repos', 'purge repositories that should not exist locally')
    .option('-or, --open_repo', 'select repository to open on your editor')
    .option('-ol, --open_repo_link', 'select repository to open the link on your browser')
    .option('-oc, --open_configs', 'open the configs file')
    .option('-uc, --update_configs', 'update the configs file based on your local repositories');
  return program;
}

function getParsedConfigsFileOrThrow(configsFile: UserConfigs) {
  const userConfisFile = readJson(configsFile.configs_path) as Configs;

  if (!configsSchema.safeParse(userConfisFile).success) {
    gracefulThrowError(ERRORS.configs_file_dont_follow_required_schema);
  }

  return { configsFilePath: configsFile.configs_path, userConfisFile };
}

function parseCommanderOption(options: ProgramOptions): Nullable<TOptionsValues> {
  if (options.setup) return SELECT_OPTIONS_ENUM.setup_configs;
  if (options.remove) return SELECT_OPTIONS_ENUM.remove_configs;
  if (options.pull_repos) return SELECT_OPTIONS_ENUM.pull_missing_repos;
  if (options.purge_repos) return SELECT_OPTIONS_ENUM.purge_local_repos;
  if (options.open_repo) return SELECT_OPTIONS_ENUM.open_repository;
  if (options.open_repo_link) return SELECT_OPTIONS_ENUM.open_repository_link;
  if (options.open_configs) return SELECT_OPTIONS_ENUM.open_configs;
  if (options.update_configs) return SELECT_OPTIONS_ENUM.update_configs;
  return null;
}

async function main() {
  if (!CONFIGS.supported_os.includes(CONFIGS.user_os)) {
    gracefulThrowError(ERRORS.system_not_supported);
  }

  if (!existsSync(CONFIGS.user_configs_file)) {
    createUserConfigsFile();
  }

  const program = setupProgramConfigs().parse();
  const options = program.opts() satisfies ProgramOptions;
  const parsedOption = parseCommanderOption(options);

  if (parsedOption === SELECT_OPTIONS_ENUM.setup_configs) {
    setupConfigsCommand({ configs_path: options.setup });
    return;
  }

  if (parsedOption === SELECT_OPTIONS_ENUM.remove_configs) {
    removeConfigsCommand();
    return;
  }

  const configsFile = readJson(CONFIGS.user_configs_file) as UserConfigs;
  if (!existsSync(configsFile.configs_path)) {
    const hasSpecifiedAnOption = Object.keys(options).length > 0;
    if (hasSpecifiedAnOption) {
      removeConfigsCommand(true);
      gracefulThrowError(ERRORS.configs_file_does_not_exists);
    } else {
      program.help();
      return;
    }
  }

  const { configsFilePath, userConfisFile } = getParsedConfigsFileOrThrow(configsFile);
  const parsedReposPath = userConfisFile.repos_root_path[CONFIGS.user_os];
  if (!parsedReposPath) {
    gracefulThrowError(ERRORS.missing_os_repos_folder);
    return;
  }

  const parsedRepositories = getParsedRepositories(userConfisFile, parsedReposPath);

  if (parsedOption === SELECT_OPTIONS_ENUM.update_configs) {
    updateConfigsCommand({ configs: userConfisFile, repositories: parsedRepositories, configs_path: configsFilePath, parsedReposPath });
    return;
  }

  if (parsedOption === SELECT_OPTIONS_ENUM.pull_missing_repos) {
    pullMissingReposCommand({ parsedRepositories });
    return;
  }

  if (parsedOption === SELECT_OPTIONS_ENUM.purge_local_repos) {
    purgeLocalReposCommand({ parsedRepositories });
    return;
  }

  if (parsedOption === SELECT_OPTIONS_ENUM.open_repository) {
    openRepositoryCommand({ parsedRepositories, userConfisFile });
    return;
  }

  if (parsedOption === SELECT_OPTIONS_ENUM.open_repository_link) {
    openRepositoryLinkCommand({ parsedRepositories });
    return;
  }

  if (parsedOption === SELECT_OPTIONS_ENUM.open_configs) {
    openConfigsCommand({ configsFilePath });
    return;
  }

  optionSelect(async (option) => {
    if (option === SELECT_OPTIONS_ENUM.remove_configs) {
      removeConfigsCommand();
    } else if (option === SELECT_OPTIONS_ENUM.pull_missing_repos) {
      pullMissingReposCommand({ parsedRepositories });
    } else if (option === SELECT_OPTIONS_ENUM.purge_local_repos) {
      purgeLocalReposCommand({ parsedRepositories });
    } else if (option === SELECT_OPTIONS_ENUM.open_repository) {
      openRepositoryCommand({ parsedRepositories, userConfisFile });
    } else if (option === SELECT_OPTIONS_ENUM.open_repository_link) {
      openRepositoryLinkCommand({ parsedRepositories });
    } else if (option === SELECT_OPTIONS_ENUM.open_configs) {
      openConfigsCommand({ configsFilePath });
    } else if (option === SELECT_OPTIONS_ENUM.update_configs) {
      updateConfigsCommand({ configs: userConfisFile, repositories: parsedRepositories, configs_path: configsFilePath, parsedReposPath });
    }
  });
}

main();
