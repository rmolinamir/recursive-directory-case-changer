# recursive-directory-case-changer

A simple script to change the case of all files and directories in a directory recursively.

## Warning ⚠️

It is recommended to back up your directory before using this script.

## Example

### npx

```bash
npx recursive-directory-case-changer -c kebab-case -a true src/ lib/

Changing case of directories: src, lib
```

### npm

```bash
npm i -g recursive-directory-case-changer

rdcc -c kebab-case -a true src/ lib/

Changing case of directories: src, lib
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
