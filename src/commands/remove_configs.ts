import { unlinkSync } from 'fs';

import { CONFIGS } from '../consts/configs.js';
import { successfulMessage } from '../utils/utils.js';

export const removeConfigsCommand = (dontShowMessage?: boolean) => {
  unlinkSync(CONFIGS.user_configs_file);
  if (!dontShowMessage) {
    successfulMessage('your configs file was removed!');
  }
};
