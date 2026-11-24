import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { build } from './build.mjs';

await build();
const types = {html:'text/html; charset=utf-8',css:'text/css',js:'text/javascript',webp:'image/webp',avif:'image/avif',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',svg:'image/svg+xml',xml:'application/xml',txt:'text/plain',woff2:'font/woff2'};
const requestedPort = Number(process.env.MYSORE_PREVIEW_PORT || 4173);
if (!Number.isInteger(requestedPort) || requestedPort < 1 || requestedPort > 65535) {
  throw new Error('MYSORE_PREVIEW_PORT must be an integer from 1 to 65535.');
}
const server = createServer(async (req,res) => {
  const path = new URL(req.url,'http://localhost').pathname;
  const name = path === '/' ? 'index.html' : path.slice(1);
  if (!/^(?:assets\/(?:(?:images|fonts)\/)?)?[a-z0-9.-]+\.(?:html|css|js|webp|avif|png|jpe?g|svg|xml|txt|woff2)$/.test(name)) {
    res.writeHead(404).end();
    return;
  }
  try {
    const body = await readFile(new URL('./dist/'+name,import.meta.url));
    res.writeHead(200,{'Content-Type':types[name.split('.').at(-1)],'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}).end(body);
  } catch {
    res.writeHead(404).end('Page not found');
  }
});

function listenOnAvailablePort(port, attempted = 0) {
  if (attempted >= 20) {
    throw new Error('Could not find an available preview port.');
  }
  server.once('error', error => {
    if (error.code === 'EADDRINUSE') {
      listenOnAvailablePort(port + 1, attempted + 1);
      return;
    }
    throw error;
  });
  server.listen(port,'127.0.0.1',() => {
    server.removeAllListeners('error');
    console.log('Local preview: http://127.0.0.1:'+port);
  });
}

listenOnAvailablePort(requestedPort);
