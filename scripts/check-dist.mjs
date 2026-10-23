import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { posix } from 'node:path';
import { siteFiles, assetFiles } from './site-files.mjs';
const root = new URL('../dist/', import.meta.url);
async function list(directory = '') {
  const entries = await readdir(new URL(directory, root), { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? list(`${directory}${entry.name}/`) : `${directory}${entry.name}`))).flat();
}
const expected = [...siteFiles, ...assetFiles].sort();
assert.deepEqual((await list()).sort(), expected, 'Production output must match the public allowlist');
for (const file of expected) {
  const bytes = await readFile(new URL(file, root));
  assert.ok(bytes.length, `${file} is empty`);
  assert.deepEqual(bytes, await readFile(new URL(`../${file}`, import.meta.url)), `${file} is stale`);
  if (!/\.(?:html|css|js)$/.test(file)) continue;
  const source = bytes.toString('utf8');
  const references = [...source.matchAll(/(?:src|href)=["']([^"']+)["']|from\s+["']([^"']+)["']|url\(["']?([^\s)'";]+)["']?\)/g)];
  for (const match of references) {
    const ref = match[1] || match[2] || match[3];
    if (/^(?:[a-z]+:|\/\/|#)/i.test(ref) || ref.includes('${')) continue;
    const pathname = ref.split(/[?#]/)[0];
    if (!pathname || pathname === '/') continue;
    const target = pathname.startsWith('/') ? pathname.slice(1) : posix.join(posix.dirname(file), pathname);
    assert.ok(expected.includes(target), `${file} references missing ${target}`);
  }
}
console.log(`Verified ${expected.length} production files and static resource references.`);
