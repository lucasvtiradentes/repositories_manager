import fuse from 'fuse.js';
import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';

import { TExtendedRepo } from '../methods/parse_repositories.js';
import { extractRepositoryNameFromSshString, standardizeString } from '../utils/utils.js';

const SELECT_KEY = 'repository' as const;

export function repositorySelect(repositories: TExtendedRepo[], cbFn: (answer: TExtendedRepo['git_ssh']) => Promise<void>) {
  const maxRepositoryNameLength = Math.max(...repositories.map((item) => extractRepositoryNameFromSshString(item.git_ssh)!.length));
  const maxCategoryLength = Math.max(...repositories.map((item) => (item.category ?? '').length));
  const maxDomainLength = Math.max(...repositories.map((item) => item.domain.length));

  const parsedData = repositories.map((item) => {
    const repoInfo = [standardizeString(extractRepositoryNameFromSshString(item.git_ssh)!, maxRepositoryNameLength), standardizeString(item.category ?? '', maxCategoryLength), standardizeString(item.domain, maxDomainLength)].join(' ');

    return {
      name: (item.exists_locally ? '⬇️' : ' ') + repoInfo,
      value: item.git_ssh,
      ...item
    };
  });

  const fuzzy = new fuse(parsedData, {
    includeScore: true,
    keys: ['name', 'domain', 'category'] as (keyof (typeof parsedData)[number])[]
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
