import fs from 'fs-extra';
import path from 'path';

import { CaseChanger } from '../case-changer';
import { CaseType } from '../case-type';

const jsFileExtensions = ['.js', '.ts', '.jsx', '.tsx'];

/**
 * Regular expression to match JavaScript import and export statements.
 *
 * @example
 * const newFile = file.replace(
 *   jsImportStatementRegExp,
 *   (
 *     match,
 *     default,
 *     destructuredImports,
 *     wildcard,
 *     modulePath,
 *     quotes
 *   ) => ...
 * );
 */
export const jsImportAndExportStatementRegExp =
  /(?<statement>import|export)(?:\s*(?:{\s*(?<named>[\w\s,]+?)\s*}|(?<default>\s*[\w\s{},]+?)\s*|\*)(?:\s*as\s+(?<wildcard>[\w]+))?\s*from)?(?:[(\s'"]*)?(?<quotes>['"])(?<path>[^'"]+)/gm;

export async function adjustImportAndExportStatements(
  caseType: CaseType,
  filepath: string
): Promise<void> {
  const { ext } = path.parse(filepath);

  if (jsFileExtensions.includes(ext)) {
    const file = await fs.readFile(filepath, 'utf8');

    const newFile = file.replace(
      jsImportAndExportStatementRegExp,
      (match, _statement, _default, _named, _wildcard, _quotes, modulePath) => {
        const { base, ext } = path.parse(modulePath);

        const caseChangedPath = modulePath
          .split(path.sep)
          .map((str: string) => {
            if (str === '..' || str === '.') return str;
            else if (str === base)
              return CaseChanger.changeCase(caseType, str) + ext;
            else return CaseChanger.changeCase(caseType, str);
          })
          .join(path.sep);

        if (modulePath !== caseChangedPath)
          return match.replace(modulePath, caseChangedPath);
        else return match;
      }
    );

    jsImportAndExportStatementRegExp.lastIndex = 0;

    if (file !== newFile) await fs.writeFile(filepath, newFile);
  }
}
