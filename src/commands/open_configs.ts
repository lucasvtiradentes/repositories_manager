import { TConfigs } from '../consts/schema';
import { asyncExec } from '../utils/utils';

type TOpenConfigsCommandProps = {
  userConfisFile: TConfigs;
  configsFilePath: string;
};

export const openConfigsCommand = async ({ userConfisFile, configsFilePath }: TOpenConfigsCommandProps) => {
  await asyncExec(`${userConfisFile.open_command.configs} ${configsFilePath}`);
};
