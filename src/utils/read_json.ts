import { existsSync, readFileSync } from 'node:fs';
import JSON5 from 'json5';
import { ERRORS } from '../consts/errors.js';
import { gracefulThrowError } from './utils.js';

export function readJson(jsonPath: string): Record<string, unknown> {
  if (!existsSync(jsonPath)) {
    gracefulThrowError(ERRORS.json_not_found(jsonPath));
  }

  try {
    const rawdata = readFileSync(jsonPath);
    const parsedData = JSON5.parse(rawdata.toString());
    return parsedData;
  } catch {
    return {};
  }
}
