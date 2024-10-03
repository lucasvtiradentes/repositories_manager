import { execSync } from 'node:child_process';

import { CONFIGS, SupportedOS } from '../consts/configs.js';

type TOpenConfigsCommandProps = {
  configsFilePath: string;
};

export const openConfigsCommand = ({ configsFilePath }: TOpenConfigsCommandProps) => {
  openTextFile(configsFilePath);
};

function openTextFile(path: string) {
  const openCommandMapper = {
    linux: 'xdg-open',
    mac: 'open -t',
    windows: 'start notepad',
    wsl: 'notepad.exe'
  } as const satisfies Record<SupportedOS, string>;

  const openFileCommand = openCommandMapper[CONFIGS.user_os];
  execSync(`${openFileCommand} "${path}" > /dev/null 2>&1`);
}
