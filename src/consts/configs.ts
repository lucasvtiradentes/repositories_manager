import { join } from 'node:path';

export const CONFIGS = {
  repo_sync_name: 'repositories_syncer',
  user_configs_file: join(__dirname, '../../user_data.json')
} as const;
