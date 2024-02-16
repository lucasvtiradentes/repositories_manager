import { homedir, platform } from 'node:os';
import { join } from 'node:path';

import { APP_INFO } from '../consts/app_consts.js';

const getUserConfigsFile = () => {
  const os = platform();
  let userConfigsFile = '';

  if (os === 'linux') {
    userConfigsFile = join(homedir(), '.config', APP_INFO.name);
  } else if (os === 'win32') {
    userConfigsFile = join(homedir(), 'AppData', 'Roaming', APP_INFO.name);
  } else if (os === 'darwin') {
    userConfigsFile = join(homedir(), 'Library', 'Preferences', APP_INFO.name);
  }

  return userConfigsFile;
};

export const CONFIGS = {
  user_configs_folder: getUserConfigsFile(),
  user_configs_file: join(getUserConfigsFile(), 'user_data.json'),
  supported_os: ['darwin', 'win32', 'linux'] satisfies NodeJS.Platform[]
} as const;
