import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

import { CONFIGS } from '../consts/configs.js';
import { readJson } from './read_json.js';

export type UserConfigs = {
  configs_path: string;
};

export const createUserConfigsFile = () => {
  if (!existsSync(CONFIGS.user_configs_folder)) {
    mkdirSync(CONFIGS.user_configs_folder, { recursive: true });
  }

  const initialConfigs: UserConfigs = {
    configs_path: ''
  };

  writeFileSync(CONFIGS.user_configs_file, JSON.stringify(initialConfigs, null, 2));
};

export const getUserConfigsKeyValue = (key: keyof UserConfigs) => {
  const configsData = readJson(CONFIGS.user_configs_file) as UserConfigs;
  return configsData[key];
};

export const setUserConfigsKeyValue = <TKey extends keyof UserConfigs>(key: TKey, value: UserConfigs[TKey]) => {
  const configsData = readJson(CONFIGS.user_configs_file) as UserConfigs;
  const newData = {
    ...configsData,
    [key]: value
  };

  writeFileSync(CONFIGS.user_configs_file, JSON.stringify(newData, null, 2));
};
