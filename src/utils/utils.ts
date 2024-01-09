import { exec } from 'node:child_process';

type TAsyncExec = {
  stderr: string;
  stdout: string;
};

export function asyncExec(command: string): Promise<TAsyncExec> {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve({
        stderr,
        stdout: stdout.trim()
      });
    });
  });
}

export function extractRepositoryNameFromSshString(url: string) {
  const regex = /\/([^\/]+)\.git$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function standardizeStringArray(strArr: string[], minColArr: number[]){
  const divider = " | "
  const str = strArr.reduce((strArr, columnStr, columnIndex) => {
    const rowMaxLength = minColArr[columnIndex];
    const parsedItem = (() => {
      if (columnStr.length > rowMaxLength) {
        return columnStr.substring(0, rowMaxLength);
      } else if (columnStr.length < rowMaxLength) {
        return columnStr + ' '.repeat(rowMaxLength - columnStr.length);
      }
      return columnStr;
    })();

    const curRow = columnIndex === 0 ? parsedItem : divider + parsedItem;
    return strArr + curRow;
  }, '');

  return str;
}

export function customConsoleLog(message: string, isUpdatingLine?: boolean) {
  if (isUpdatingLine) {
    process.stdout.write(`\r${message}`);
  } else {
    process.stdout.write(message);
  }
}