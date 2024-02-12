import fuse from 'fuse.js';
import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';

import { extractRepositoryNameFromSshString } from '../utils/utils';

const SELECT_KEY = 'repository' as const;

type TRepository = {
  domain: string;
  git_ssh: string;
  category?: string;
};

export function repositorySelect(repositories: TRepository[], cbFn: (answer: TRepository['git_ssh']) => Promise<void>) {
  const parsedData = repositories.map((item) => ({
    name: extractRepositoryNameFromSshString(item.git_ssh)!,
    value: item.git_ssh
  }));

  const fuzzy = new fuse(parsedData, {
    includeScore: true,
    keys: ['name']
  });

  const promptQuestions = [
    {
      type: 'autocomplete',
      name: SELECT_KEY,
      message: 'select a repository: ',
      source: (_, query) => Promise.resolve(query ? fuzzy.search(query).map((it) => it.item) : [...parsedData])
    }
  ] satisfies inquirerPrompt.AutocompleteQuestionOptions[];

  inquirer.registerPrompt('autocomplete', inquirerPrompt);

  inquirer.prompt(promptQuestions).then(async (answer: { [SELECT_KEY]: string }) => cbFn(answer[SELECT_KEY]));
}
