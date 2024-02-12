import { exec } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// SYSTEM UTILS ================================================================

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

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// FS UTILS ====================================================================

export function getAllSubfolders(dir: string, subfolders: string[] = []): string[] {
  const ignoredFolders = ['.git', 'node_modules', 'dist'];

  readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
    if (dirent.isDirectory()) {
      const subDir = resolve(dir, dirent.name);
      subfolders.push(subDir);

      if (!ignoredFolders.some((ignoredFolder) => subDir.includes(ignoredFolder))) {
        getAllSubfolders(subDir, subfolders);
      }
    }
  });

  return subfolders;
}

// STRING UTILS ================================================================

export function extractRepositoryNameFromSshString(url: string) {
  const regex = /\/([^/]+)\.git$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function standardizeStringArray(strArr: string[], minColArr: number[]) {
  const divider = ' | ';
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

export const gracefulThrowError = (message: string) => {
  console.log(`\x1b[31mERROR: ${message}\x1b[0m`);
  process.exit();
};

export const successfulMessage = (message: string) => {
  console.log(`\x1b[32mSUCCESS: ${message}\x1b[0m`);
  process.exit();
};

// ARRAY UTILS =================================================================

export const mergeArraysOfArrays = <T>(arr: T[][]): T[] => arr.reduce((acc, val) => acc.concat(val), []);

export type TNullable<TData> = TData | null;
