/* eslint-disable @typescript-eslint/no-explicit-any */

import assert from 'assert';
import { program } from 'commander';
import fs from 'fs-extra';

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

function validateOptions(
  options: Record<string, any>
): asserts options is Options {
  if (!options.caseType) throw new Error('Case type not specified.');

  assert(
    Object.values(CaseType).includes(options.caseType),
    `Case type {${
      options.caseType
    }} is not supported. The supported case types are: ${Object.values(
      CaseType
    ).join(', ')}.`
  );

  if (options.shouldAdjustImportAndExportStatements)
    assert(
      typeof options.shouldAdjustImportAndExportStatements === 'boolean',
      'Adjust import and export statements must be a boolean.'
    );
}

program
  .version('0.0.0')
  .command(__filename, { isDefault: true })
  .requiredOption('-c, --case-type <caseType>', 'Case type to change to.')
  .option('-a, --adjust', 'Adjust import and export statements.', true)
  .argument('<dirs...>')
  .action(async function (dirs: string[], options: Options) {
    validateDirs(dirs);
    validateOptions(options);

    console.info('Changing case of directories: %s', dirs.join(', '));

    await Promise.all(
      dirs.map((dir) => {
        if (!fs.existsSync(dir))
          return console.error('Directory %s does not exist.', dir);
        else
          return recursiveDirectoryCaseChanger(options.caseType, dir).catch(
            (err) => console.error(err)
          );
      })
    );

    console.info('Done.');
  });

program.parse(process.argv);
