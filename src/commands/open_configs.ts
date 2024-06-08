import { execSync } from 'node:child_process';
import { platform } from 'node:os';

type TOpenConfigsCommandProps = {
  configsFilePath: string;
};

export const openConfigsCommand = ({ configsFilePath }: TOpenConfigsCommandProps) => {
  openTextFile(configsFilePath);
};

function openTextFile(path: string) {
  const openCommandMapper = {
    darwin: 'open -t',
    win32: 'start notepad',
    linux: 'xdg-open'
  } as const;
  type TSupportedOs = keyof typeof openCommandMapper;

  const openFileCommand = openCommandMapper[platform() as TSupportedOs];
  execSync(`${openFileCommand} ${path}`);
}
