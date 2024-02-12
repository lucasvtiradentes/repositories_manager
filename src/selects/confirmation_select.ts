import fuse from 'fuse.js';
import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';

const SELECT_KEY = 'confirmation' as const;

export function confirmationSelect(message: string, cbFn: (answer: boolean) => Promise<void>) {
  const parsedData = [
    {
      name: 'yes',
      value: true
    },
    {
      name: 'no',
      value: false
    }
  ];

  const fuzzy = new fuse(parsedData, {
    includeScore: true,
    keys: ['name']
  });

  const promptQuestions = [
    {
      type: 'autocomplete',
      name: SELECT_KEY,
      message: `${message}: `,
      source: (_, query) => Promise.resolve(query ? fuzzy.search(query).map((it) => it.item) : [...parsedData])
    }
  ] satisfies inquirerPrompt.AutocompleteQuestionOptions[];

  inquirer.registerPrompt('autocomplete', inquirerPrompt);

  inquirer.prompt(promptQuestions).then(async (answer: { [SELECT_KEY]: boolean }) => cbFn(answer[SELECT_KEY]));
}
