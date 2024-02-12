import { existsSync, readFileSync } from 'node:fs';

import { ERRORS } from '../consts/errors';
import { gracefulThrowError } from './utils';

export function readJson(jsonPath: string): Record<string, unknown> {
  if (!existsSync(jsonPath)) {
    gracefulThrowError(ERRORS.json_not_found(jsonPath));
  }

  try {
    const rawdata = readFileSync(jsonPath);
    const parsedData = JSON.parse(rawdata.toString());
    return parsedData;
  } catch {
    return {};
  }
}
