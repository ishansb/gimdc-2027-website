/**
 * Local preview server for the built site (no dependencies).
 *
 *   npm run build && npm run preview
 *   → open http://localhost:4173/
 *
 * Set BASE_PATH to mimic a sub-folder deployment, e.g.
 *   BASE_PATH=/gimdc-2027-website/ npm run preview
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve('dist');
const PORT = Number(process.env.PORT ?? 4173);
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/');
  if (!url.startsWith(BASE)) {
    res.writeHead(302, { Location: BASE });
    res.end();
    return;
  }
  let file = normalize(join(ROOT, url.slice(BASE.length)));
  if (!file.startsWith(ROOT + sep) && file !== ROOT) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  const found = existsSync(file);
  const target = found ? file : join(ROOT, '404.html');
  res.writeHead(found ? 200 : 404, { 'Content-Type': TYPES[extname(target)] ?? 'application/octet-stream' });
  createReadStream(target).pipe(res);
}).listen(PORT, () => console.log(`Previewing dist/ at http://localhost:${PORT}${BASE}`));
