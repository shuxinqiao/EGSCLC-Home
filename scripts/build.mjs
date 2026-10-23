import { mkdir, copyFile, rm, lstat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteFiles, assetFiles } from './site-files.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
// Only clean this project's generated dist; never follow a junction/symlink.
if (dirname(output) !== resolve(root)) throw new Error('Invalid output directory');
const info = await lstat(output).catch(error => { if (error.code !== 'ENOENT') throw error; });
if (info?.isSymbolicLink()) throw new Error('Refusing to clean a linked dist directory');
await rm(output, { recursive: true, force: true });
for (const file of [...siteFiles, ...assetFiles]) {
  const target = resolve(output, file);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(resolve(root, file), target);
}
console.log(`Built ${siteFiles.length + assetFiles.length} public files in dist/.`);
