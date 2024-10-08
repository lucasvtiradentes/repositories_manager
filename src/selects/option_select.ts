import fuse from 'fuse.js';
import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';

import { EnumHelper } from '../utils/enum-helper.js';

const SELECT_KEY = 'option' as const;

const SELECT_OPTIONS = [
  {
    name: 'open repository on editor',
    value: 'open_repository'
  },
  {
    name: 'open repository on browser',
    value: 'open_repository_link'
  },
  {
    name: 'pull missing repositories locally',
    value: 'pull_missing_repos'
  },
  {
    name: 'purge repositories that should not exist locally',
    value: 'purge_local_repos'
  },
  {
    name: 'open configs file',
    value: 'open_configs'
  },
  {
    name: 'remove your repositories sync configs',
    value: 'remove_configs'
  }
] as const;

export const SELECT_OPTIONS_ENUM = {
  ...EnumHelper.createEnumFromObjectArray(SELECT_OPTIONS, 'value'),
  setup_configs: 'setup_configs'
} as const;

export type TOptionsValues = (typeof SELECT_OPTIONS)[number]['value'] | 'setup_configs';

export function optionSelect(cbFn: (answer: TOptionsValues) => Promise<void>) {
  const fuzzy = new fuse(SELECT_OPTIONS, {
    includeScore: true,
    keys: ['name']
  });

  const promptQuestions = [
    {
      type: 'autocomplete',
      name: SELECT_KEY,
      message: 'select an option: ',
      source: (_, query) => Promise.resolve(query ? fuzzy.search(query).map((it) => it.item) : [...SELECT_OPTIONS])
    }
  ] satisfies inquirerPrompt.AutocompleteQuestionOptions[];

  inquirer.registerPrompt('autocomplete', inquirerPrompt);

  inquirer.prompt(promptQuestions).then(async (answer: { [SELECT_KEY]: TOptionsValues }) => cbFn(answer[SELECT_KEY]));
}
