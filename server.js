// Minimal static file server for Azure App Service (Node), no dependencies.
// Serves the site from this directory: extensionless page routes map to
// <route>/index.html, unknown paths get 404.html.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
};

// Long cache for fingerprint-free assets is safe enough here: images and CSS
// change rarely and a deploy restarts the app; HTML is always revalidated.
function cacheControl(ext) {
  return ext === '.html' ? 'no-cache' : 'public, max-age=86400';
}

function send(res, status, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(status, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': cacheControl(ext),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  // Strip trailing slash (except root) so /how-you-can-help/ and
  // /how-you-can-help both resolve to the same page.
  if (urlPath.length > 1 && urlPath.endsWith('/')) urlPath = urlPath.slice(0, -1);

  const resolved = path.normalize(path.join(ROOT, urlPath));
  if (!resolved.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  const candidates =
    urlPath === '/'
      ? [path.join(ROOT, 'index.html')]
      : [resolved, path.join(resolved, 'index.html')];

  for (const file of candidates) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      send(res, 200, file);
      return;
    }
  }

  send(res, 404, path.join(ROOT, '404.html'));
});

server.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
