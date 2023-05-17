import fs from 'fs-extra';
import os from 'os';
import path from 'path';

import { CaseType } from '../../case-type';
import { adjustImportAndExportStatements } from '../adjust-import-and-export-statements';

const file = `
import fs from 'fs-extra';
import path from 'path';

import * as Foo from '../Foo';
import { Bar } from '../Bar';
import { Baz, Qux } from '../Baz_Qux';
import { Foo as Bar } from '../Foo';
import { Foo as Bar, Baz } from '../Foo_Bar';
import { Foo as Bar, Baz, Qux } from '../Foo_Bar_Baz';
import Foobar from '../Foobar';`;

const adjustedFile = `
import fs from 'fs-extra';
import path from 'path';

import * as Foo from '../foo';
import { Bar } from '../bar';
import { Baz, Qux } from '../baz-qux';
import { Foo as Bar } from '../foo';
import { Foo as Bar, Baz } from '../foo-bar';
import { Foo as Bar, Baz, Qux } from '../foo-bar-baz';
import Foobar from '../foobar';`;

describe('adjustImportAndExportStatements', () => {
  test('change case of import and export statements', async () => {
    const filepath = path.resolve(os.tmpdir(), `${Date.now()}.js`);

    await fs.writeFile(filepath, file, 'utf8');

    await adjustImportAndExportStatements(CaseType.KebabCase, filepath);

    const res = await fs.readFile(filepath, 'utf8');

    expect(res).toBe(adjustedFile);
  });

  test('files with unsupported extensions are not changed', async () => {
    const filepath = path.resolve(os.tmpdir(), `${Date.now()}.txt`);

    await fs.writeFile(filepath, file, 'utf8');

    await adjustImportAndExportStatements(CaseType.KebabCase, filepath);

    const res = await fs.readFile(filepath, 'utf8');

    expect(res).toBe(file);
  });
});
