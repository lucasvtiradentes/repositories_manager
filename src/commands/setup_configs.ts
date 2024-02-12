import { existsSync, writeFileSync } from 'fs';

import { APP_INFO } from '../consts/app_consts';
import { CONFIGS } from '../consts/configs';
import { successfulMessage } from '../utils/utils';

type TSetupConfigsCommandProps = {
  configs_path: string;
};

export const setupConfigsCommand = ({ configs_path }: TSetupConfigsCommandProps) => {
  const configsFileExists = existsSync(CONFIGS.user_configs_file);

  writeFileSync(CONFIGS.user_configs_file, JSON.stringify({ configs_path: configs_path }, null, 2));
  successfulMessage(`you have successfully ${configsFileExists ? 'updated' : 'configured'} ${APP_INFO.name}!`);
};
