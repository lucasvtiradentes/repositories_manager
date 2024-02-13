import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const CONFIGS = {
  user_configs_file: join(__dirname, '../../user_data.json')
} as const;
