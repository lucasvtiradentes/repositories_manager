import { execSync } from 'node:child_process';
import { platform } from 'node:os';

export function openURL(url: string) {
  const openCommandMapper = {
    darwin: `open`,
    win32: 'start',
    linux: 'xdg-open'
  } as const;
  type TSupportedOs = keyof typeof openCommandMapper;

  const oppenLinkCommand = openCommandMapper[platform() as TSupportedOs];
  execSync(`${oppenLinkCommand} ${url}`);
}
