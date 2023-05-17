# recursive-directory-case-changer

A simple script to change the case of all files and directories in a directory recursively.

## Example

### npx

```bash
npx recursive-directory-case-changer -c kebab-case -a .private/lib

Changing case of directories: true, .private/lib
```

### npm

```bash
npm i -g recursive-directory-case-changer

rdcc -c kebab-case -a src/

Changing case of directories: true, .private/lib
```

## Usage

```bash
Usage: cli [options] [command]

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  execute [options] <dirs...>
  help [command]               display help for command
```

### Options

**`-c, --case-type <caseType>` (default: `kebab-case`)**

Supported case types:

- `kebab-case`

**`-a, --adjust', 'Adjust import and export statements.` (default: `true`)**
