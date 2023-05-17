import fs from 'fs-extra';
import path from 'path';

import { CaseChanger } from './case-changer';
import { CaseType } from './case-type';
import { adjustImportAndExportStatements } from './helpers/adjust-import-and-export-statements';
import { getDirents } from './helpers/get-dirents';

export async function recursiveDirectoryCaseChanger(
  caseType: CaseType,
  dir: string,
  shouldAdjustImportAndExportStatements = true
) {
  for await (const dirent of getDirents(dir)) {
    let currentPath: string;
    let newPath: string;

    if (dirent.isDirectory()) {
      const kebabDirName = CaseChanger.changeCase(caseType, dirent.name);

      currentPath = path.join(dirent.path, dirent.name);
      newPath = path.join(dirent.path, kebabDirName);

      if (currentPath !== newPath) {
        if (fs.existsSync(newPath)) await fs.rm(newPath, { recursive: true });

        await fs.rename(currentPath, newPath);
      }

      await recursiveDirectoryCaseChanger(caseType, newPath);
    } else {
      currentPath = path.join(dirent.path, dirent.name);

      const { name, ext } = path.parse(currentPath);

      const newFilename = CaseChanger.changeCase(caseType, name) + ext;

      newPath = path.join(dirent.path, newFilename);

      if (currentPath !== newPath) await fs.rename(currentPath, newPath);

      if (shouldAdjustImportAndExportStatements)
        await adjustImportAndExportStatements(caseType, newPath);
    }
  }
}
