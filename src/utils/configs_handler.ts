import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

import { CONFIGS } from '../consts/configs.js';
import { readJson } from './read_json.js';

export type TUserConfigs = {
  configs_path: string;
};

export const createUserConfigsFile = () => {
  if (!existsSync(CONFIGS.user_configs_folder)) {
    mkdirSync(CONFIGS.user_configs_folder, { recursive: true });
  }

  const initialConfigs: TUserConfigs = {
    configs_path: ''
  };

  writeFileSync(CONFIGS.user_configs_file, JSON.stringify(initialConfigs, null, 2));
};

export const getUserConfigsKeyValue = (key: keyof TUserConfigs) => {
  const configsData = readJson(CONFIGS.user_configs_file) as TUserConfigs;
  return configsData[key];
};

export const setUserConfigsKeyValue = <TKey extends keyof TUserConfigs>(key: TKey, value: TUserConfigs[TKey]) => {
  const configsData = readJson(CONFIGS.user_configs_file) as TUserConfigs;
  const newData = {
    ...configsData,
    [key]: value
  };

  writeFileSync(CONFIGS.user_configs_file, JSON.stringify(newData, null, 2));
};
