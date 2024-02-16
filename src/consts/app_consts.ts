import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readJson } from '../utils/read_json.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = readJson(packageJsonPath);

export const APP_INFO = {
  name: packageJson.name as string,
  version: packageJson.version as string,
  description: packageJson.description as string
} as const;
