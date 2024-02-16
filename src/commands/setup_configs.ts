import { existsSync } from 'fs';

import { APP_INFO } from '../consts/app_consts.js';
import { CONFIGS } from '../consts/configs.js';
import { setUserConfigsKeyValue } from '../utils/configs_hanlder.js';
import { successfulMessage } from '../utils/utils.js';

type TSetupConfigsCommandProps = {
  configs_path: string;
};

export const setupConfigsCommand = ({ configs_path }: TSetupConfigsCommandProps) => {
  const configsFileExists = existsSync(CONFIGS.user_configs_file);

  setUserConfigsKeyValue('configs_path', configs_path);
  successfulMessage(`you have successfully ${configsFileExists ? 'updated' : 'configured'} ${APP_INFO.name}!`);
};
