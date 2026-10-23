import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { networkInterfaces } from 'node:os';
const root = resolve('.');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const publicFiles=new Set(['index.html','app.js','content.js','archive-content.js','design-content.js','ministry-content.js','sermon-data.js','verses.js','styles.css','design.css','favicon.svg']);
createServer(async(req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file = resolve(root, '.' + (pathname==='/'?'/index.html':pathname));
    const resource=pathname==='/'?'index.html':pathname.slice(1);
    if(!publicFiles.has(resource)&&!/^assets\/[\w.-]+\.(svg|webp|png|jpg|avif)$/.test(resource)){res.writeHead(404).end('Not found');return;}
    if (!file.startsWith(root+sep) || pathname.split('/').some(p=>p.startsWith('.'))) {res.writeHead(403).end();return;}
    const data = await readFile(file);
    res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'}).end(data);
  } catch {res.writeHead(404).end('Not found');}
}).listen(4173,'0.0.0.0',()=>{console.log('Local: http://127.0.0.1:4173');for(const addresses of Object.values(networkInterfaces()))for(const address of addresses||[])if(address.family==='IPv4'&&!address.internal)console.log(`Network: http://${address.address}:4173`);});
