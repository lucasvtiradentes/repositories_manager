import { homedir, platform } from 'node:os';
import { join } from 'node:path';

import { APP_INFO } from '../consts/app_consts.js';
import { Configs } from './schema.js';

const isWSL = () => Boolean(process.env.WSL_INTEROP);

const getUserConfigsFile = () => {
  const os = getUserOs();
  let userConfigsFile = '';

  if (os === 'linux' || os === 'wsl') {
    userConfigsFile = join(homedir(), '.config', APP_INFO.name);
  } else if (os === 'mac') {
    userConfigsFile = join(homedir(), 'Library', 'Preferences', APP_INFO.name);
  } else if (os === 'windows') {
    userConfigsFile = join(homedir(), 'AppData', 'Roaming', APP_INFO.name);
  }

  return userConfigsFile;
};

const supported_os = ['linux', 'mac', 'windows', 'wsl'] as const;
export type SupportedOS = keyof Configs['repos_root_path'];

const getUserOs = (): SupportedOS => {
  const os = platform();

  if (isWSL()) {
    return 'wsl';
  } else if (os === 'win32') {
    return 'windows';
  } else if (os === 'darwin') {
    return 'mac';
  } else if (os === 'linux') {
    return 'linux';
  }

  return {} as never;
};

export const CONFIGS = {
  user_os: getUserOs(),
  user_configs_folder: getUserConfigsFile(),
  user_configs_file: join(getUserConfigsFile(), 'user_data.json'),
  supported_os
} as const;
