import { unlinkSync } from 'fs';

import { CONFIGS } from '../consts/configs.js';
import { successfulMessage } from '../utils/utils.js';

export const removeConfigsCommand = () => {
  unlinkSync(CONFIGS.user_configs_file);
  successfulMessage('your configs file was removed!');
};
