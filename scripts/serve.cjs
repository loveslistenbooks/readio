/* Optional local preview. Core Node only; binds to loopback, not the public network. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const publicFiles = new Set(['index.html', 'privacy.html', 'terms.html', 'membership-agreement.html', 'auto-renewal-agreement.html', 'styles.css', 'legal.css', 'app.js', 'legal.js', 'content.js', 'language.js', 'links.js', 'site.config.js', '.nojekyll']);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png' };
const port = Number(process.env.PORT || 8765);
const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
  let relative;
  try { relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).slice(1) || 'index.html'; }
  catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, relative);
  if ((!publicFiles.has(relative) && !relative.startsWith('assets/')) || !file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); return;
  }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  if (req.method === 'HEAD') res.end();
  else fs.createReadStream(file).pipe(res);
});
server.listen(port, '127.0.0.1', () => console.log(`Readio / 爱听书 preview: http://127.0.0.1:${port}/?lang=zh\nPress Ctrl+C to stop.`));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
