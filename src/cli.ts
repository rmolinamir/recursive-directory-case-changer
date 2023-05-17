/* eslint-disable @typescript-eslint/no-explicit-any */

import { Option, program } from 'commander';
import fs from 'fs-extra';
import path from 'path';

import { CaseType } from './case-type';
import { recursiveDirectoryCaseChanger } from './recursive-directory-case-changer';

interface Options {
  caseType: CaseType;
  shouldAdjustImportAndExportStatements?: boolean;
}

function validateDirs(dirs: unknown): asserts dirs is string[] {
  if (!Array.isArray(dirs)) throw new Error('Dirs is not an array.');
  if (!dirs.length) throw new Error('Dirs is empty.');
}

function processOptions(options: Record<string, string>): Options {
  if (!options.caseType) throw new Error('Case type not specified.');

  return {
    caseType: options.caseType as CaseType,
    shouldAdjustImportAndExportStatements:
      options.shouldAdjustImportAndExportStatements === 'true'
  };
}

program
  .version('0.0.0')
  .command('execute', { isDefault: true })
  .addOption(
    new Option('-c, --case-type <caseType>', 'Case type to change to.')
      .choices(Object.values(CaseType))
      .default(CaseType.KebabCase)
  )
  .addOption(
    new Option('-a, --adjust <boolean>', 'Adjust import and export statements.')
      .choices(['true', 'false'])
      .default('true')
  )
  .argument('<dirs...>')
  .action(async function (dirs: string[], opts: Record<string, string>) {
    validateDirs(dirs);

    const options = processOptions(opts);

    console.info('Changing case of directories: %s', dirs.join(', '));

    await Promise.all(
      dirs.map((dir) => {
        if (!fs.existsSync(dir))
          return console.error('Directory %s does not exist.', dir);
        else
          return recursiveDirectoryCaseChanger(
            options.caseType,
            path.resolve(dir)
          )
            .then(() => console.info('Done.'))
            .catch((err) => console.error('Something went wrong: ', err));
      })
    );
  });

program.parse(process.argv);
