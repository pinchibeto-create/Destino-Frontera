import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const requested = process.argv.indexOf('--dir');
const base = path.join(root, requested >= 0 ? process.argv[requested + 1] : 'public');
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.xml':'application/xml' };
const server = createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const location = path.resolve(base, rel);
    if (location !== base && !location.startsWith(base + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
    if (!(await stat(location)).isFile()) throw new Error('Not found');
    const bytes = await readFile(location);
    res.writeHead(200, {'Content-Type':types[path.extname(location)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(bytes);
  } catch { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}).end('No encontrado'); }
});
server.listen(port, '0.0.0.0', () => console.log(`Destino Frontera: http://localhost:${port}`));
