import { spawn } from 'node:child_process';

import { TConfigs } from '../consts/schema';

type TOpenConfigsCommandProps = {
  userConfisFile: TConfigs;
  configsFilePath: string;
};

export const openConfigsCommand = ({ userConfisFile, configsFilePath }: TOpenConfigsCommandProps) => {
  // const commandToOpenConfigs = `${userConfisFile.open_command.configs} ${configsFilePath}`;
  const child = spawn(userConfisFile.open_command.configs, [configsFilePath], { detached: true, stdio: 'ignore' });
  child.unref();
};
