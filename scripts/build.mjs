import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html','app.js','content.js','archive-content.js','design-content.js','ministry-content.js','sermon-data.js','verses.js','styles.css','favicon.svg','.nojekyll']) await copyFile(file, `dist/${file}`);
await cp('assets','dist/assets',{recursive:true});
await copyFile('design.css','dist/design.css');
console.log('Static website built in dist/');
