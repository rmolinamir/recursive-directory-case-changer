import assert from 'assert';

import { jsImportAndExportStatementRegExp } from '../adjust-import-and-export-statements';

describe('jsImportAndExportStatementRegExp', () => {
  afterEach(() => {
    jsImportAndExportStatementRegExp.lastIndex = 0;
  });

  describe('exports', () => {
    test("export * from './recursive-directory-case-changer';", () => {
      expect(
        "export * from './recursive-directory-case-changer';".match(
          jsImportAndExportStatementRegExp
        )
      ).toBeTruthy();
    });

    test("export { Foo } from './bar/foo';", () => {
      expect(
        "export { Foo } from './bar/foo';".match(
          jsImportAndExportStatementRegExp
        )
      ).toBeTruthy();
    });

    test("export { Foo as Bar } from './bar/foo';", () => {
      expect(
        "export { Foo as Bar } from './bar/foo';".match(
          jsImportAndExportStatementRegExp
        )
      ).toBeTruthy();
    });

    test("export * from 'index';", () => {
      expect(
        "export * from 'index';".match(jsImportAndExportStatementRegExp)
      ).toBeTruthy();
    });

    test("export { default } from './bar/foo';", () => {
      expect(
        "export { default } from './bar/foo';".match(
          jsImportAndExportStatementRegExp
        )
      ).toBeTruthy();
    });

    test("export { default as Foo } from './bar/foo';", () => {
      expect(
        "export { default as Foo } from './bar/foo';".match(
          jsImportAndExportStatementRegExp
        )
      ).toBeTruthy();
    });

    test("export { default as Foo, Bar } from './bar/foo';", () => {
      expect(
        "export { default as Foo, Bar } from './bar/foo';".match(
          jsImportAndExportStatementRegExp
        )
      ).toBeTruthy();
    });

    test('(newlines) export { default as Foo, Bar } from "./bar/foo";', () => {
      expect(
        `export {
          default as Foo,
          Bar,
        } from './bar/foo';`.match(jsImportAndExportStatementRegExp)
      ).toBeTruthy();
    });
  });

  describe('imports', () => {
    test("import('foo')", () => {
      expect(
        "import('foo')".match(jsImportAndExportStatementRegExp)
      ).toBeTruthy();
    });

    test("import 'foo/bar/baz';", () => {
      expect(
        "import 'foo/bar/baz';".match(jsImportAndExportStatementRegExp)
      ).toBeTruthy();
    });

    test("import { Bar } from '.';", () => {
      expect(
        "import { Bar } from '.';".match(jsImportAndExportStatementRegExp)
      ).toBeTruthy();
    });

    test("import { Bar } from 'foo/bar';", () => {
      expect(
        "import { Bar } from 'foo/bar';".match(jsImportAndExportStatementRegExp)
      ).toBeTruthy();
    });

    test("import Foo from './foo';", () => {
      expect(
        "import Foo from './foo';".match(jsImportAndExportStatementRegExp)
      ).toBeTruthy();
    });

    test("import * as x from 'y'", () => {
      expect(
        "import * as x from 'y'".match(jsImportAndExportStatementRegExp)
      ).toBeTruthy();
    });

    test("import { Foo as Bar } from './bar/foo'; ", () => {
      expect(
        "import { Foo as Bar } from './bar/foo';".match(
          jsImportAndExportStatementRegExp
        )
      ).toBeTruthy();
    });

    test("import { Foo as Bar, Baz } from './bar/foo';", () => {
      expect(
        "import { Foo as Bar, Baz } from './bar/foo';".match(
          jsImportAndExportStatementRegExp
        )
      ).toBeTruthy();
    });

    test("(newlines) import { Foo as Bar, Baz } from './bar/foo';", () => {
      expect(
        `import {
          Foo as Bar,
          Baz,
        } from './bar/foo';`.match(jsImportAndExportStatementRegExp)
      ).toBeTruthy();
    });
  });

  describe('multiple statements', () => {
    test('file with multiple statements', () => {
      const file = `
      import { Foo } from './foo';
      import { Bar } from './bar';
      import { Baz } from './baz';

      export { Foobar } from '.';`;

      const matches = file.match(jsImportAndExportStatementRegExp);

      expect(matches).toBeTruthy();
      expect(matches).toHaveLength(4);
    });
  });

  describe('capture groups', () => {
    test('import { Foo, Bar } from "./foo";', () => {
      const match = jsImportAndExportStatementRegExp.exec(
        'import { Foo, Bar } from "./foo";'
      );

      expect(match).toBeTruthy();
      assert(match);

      expect(match.groups).toBeTruthy();
      assert(match.groups);

      expect(match.groups.default).toBeUndefined();
      expect(match.groups.wildcard).toBeUndefined();
      expect(match.groups.named).toBe('Foo, Bar');
      expect(match.groups.quotes).toBe('"');
      expect(match.groups.path).toBe('./foo');
    });

    test('import Foo from "./foo";', () => {
      const match = jsImportAndExportStatementRegExp.exec(
        'import Foo, Bar from "./foo";'
      );

      expect(match).toBeTruthy();
      assert(match);

      expect(match.groups).toBeTruthy();
      assert(match.groups);

      expect(match.groups.default).toBe('Foo, Bar');
      expect(match.groups.wildcard).toBeUndefined();
      expect(match.groups.named).toBeUndefined();
      expect(match.groups.quotes).toBe('"');
      expect(match.groups.path).toBe('./foo');
    });

    test('import("./foo");', async () => {
      const match = jsImportAndExportStatementRegExp.exec('import("./foo");');

      expect(match).toBeTruthy();
      assert(match);

      expect(match.groups).toBeTruthy();
      assert(match.groups);

      expect(match.groups.default).toBeUndefined();
      expect(match.groups.wildcard).toBeUndefined();
      expect(match.groups.named).toBeUndefined();
      expect(match.groups.quotes).toBe('"');
      expect(match.groups.path).toBe('./foo');
    });

    test("import  *  as  x  from  'y'", async () => {
      const match = jsImportAndExportStatementRegExp.exec(
        "import  *  as  x  from  'y'"
      );

      expect(match).toBeTruthy();
      assert(match);

      expect(match.groups).toBeTruthy();
      assert(match.groups);

      expect(match.groups.default).toBeUndefined();
      expect(match.groups.wildcard).toBe('x');
      expect(match.groups.named).toBeUndefined();
      expect(match.groups.quotes).toBe("'");
      expect(match.groups.path).toBe('y');
    });
  });
});
