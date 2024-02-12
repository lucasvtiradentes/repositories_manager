import fuse from 'fuse.js';
import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';

const SELECT_KEY = 'option' as const

const SELECT_OPTIONS = [
  {
    name: 'download missing repositories',
    value: 'sync_repos',
  },
  {
    name: 'delete local repositories that are not on configs',
    value: 'remove_sync_not_listed_repos',
  },
  {
    name: 'list configs repositories',
    value: 'shows_repos_by_category',
  },
  {
    name: 'list repos to open',
    value: 'list_repos_to_open',
  }
] as const

type ToptionsValues = (typeof SELECT_OPTIONS)[number]['value']

export function optionSelect(cbFn: (answer: ToptionsValues) => Promise<void>){

  const fuzzy = new fuse(SELECT_OPTIONS, {
    includeScore: true,
    keys: ['name']
  });

  const promptQuestions = [
    {
      type: 'autocomplete',
      name: SELECT_KEY,
      message: 'Select an option: ',
      source: (_, query) => Promise.resolve(query ? fuzzy.search(query).map((it) => it.item) : [...SELECT_OPTIONS])
    }
  ] satisfies inquirerPrompt.AutocompleteQuestionOptions[]

  inquirer.registerPrompt('autocomplete', inquirerPrompt);

  inquirer.prompt(promptQuestions).then(async (answer: {[SELECT_KEY]: ToptionsValues}) => cbFn(answer[SELECT_KEY]))

}