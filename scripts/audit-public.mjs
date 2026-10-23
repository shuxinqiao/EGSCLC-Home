import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const forbidden = /(?:^|\/)(?:\.env(?:\..+)?|\.dev\.vars.*|\.wrangler|node_modules|dist|previews)(?:\/|$)|\.(?:pem|key|p12|log|bak)$/i;
const secrets = [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, /\bAKIA[A-Z0-9]{16}\b/, /\bgh[pousr]_[A-Za-z0-9]{36,}\b/, /\bgithub_pat_[A-Za-z0-9_]{40,}\b/];
const findings = new Set();
function inspect(name, content, context = '') {
  if (forbidden.test(name) && !name.endsWith('.env.example')) findings.add(`${context}${name}: excluded/private file`);
  if (secrets.some(pattern => pattern.test(content))) findings.add(`${context}${name}: possible credential`);
}
const files = [...new Set(git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean))];
for (const name of files) {
  try { inspect(name, await readFile(new URL(name, root), 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
if (process.argv.includes('--history')) {
  for (const line of git('rev-list', '--objects', '--all').trim().split('\n').filter(Boolean)) {
    const [oid, ...parts] = line.split(' ');
    const name = parts.join(' ');
    if (!name || git('cat-file', '-t', oid).trim() !== 'blob') continue;
    inspect(name, git('cat-file', '-p', oid), 'history: ');
  }
}
if (findings.size) {
  console.error([...findings].join('\n'));
  process.exitCode = 1;
} else console.log('Public-file audit passed (common credential patterns; not an exhaustive secret scanner).');
