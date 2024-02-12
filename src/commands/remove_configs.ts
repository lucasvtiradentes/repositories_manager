import { unlinkSync } from 'fs';

import { CONFIGS } from '../consts/configs';
import { successfulMessage } from '../utils/utils';

export const removeConfigsCommand = () => {
  unlinkSync(CONFIGS.user_configs_file);
  successfulMessage('your configs file was removed!');
};
