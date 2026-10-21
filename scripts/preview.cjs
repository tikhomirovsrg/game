const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../app/src/main/assets');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
function start(port = Number(process.env.PORT || 4173)) {
  const server = http.createServer((req, res) => {
    let name;
    try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch (_) { res.writeHead(400); res.end(); return; }
    if (name === '/') name = '/index.html';
    const file = path.resolve(root, '.' + name);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}
module.exports = { start };
if (require.main === module) start().then(server => console.log(`Lumen City preview: http://127.0.0.1:${server.address().port}`));
