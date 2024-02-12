import { join } from 'node:path';

export const CONFIGS = {
  user_configs_file: join(__dirname, '../../user_data.json')
} as const;
