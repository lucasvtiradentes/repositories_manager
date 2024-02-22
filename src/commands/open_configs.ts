import { openTextFile } from '../utils/utils.js';

type TOpenConfigsCommandProps = {
  configsFilePath: string;
};

export const openConfigsCommand = ({ configsFilePath }: TOpenConfigsCommandProps) => {
  openTextFile(configsFilePath);
};
