import fs from 'fs-extra';

export async function* getDirents(from: string): AsyncGenerator<fs.Dirent> {
  const dirents = await fs.readdir(from, { withFileTypes: true });

  for (const dirent of dirents) yield dirent;
}
