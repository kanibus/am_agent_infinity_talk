const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDir = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  const safePath = path.normalize(req.url).replace(/^\/+/, '');
  const requestedPath = safePath.length ? safePath : 'index.html';
  const filePath = path.join(publicDir, requestedPath);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        serveNotFound(res);
      } else {
        serveError(res, err);
      }
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      fs.stat(indexPath, (indexErr, indexStats) => {
        if (indexErr || !indexStats.isFile()) {
          serveNotFound(res);
          return;
        }
        streamFile(indexPath, res);
      });
      return;
    }

    streamFile(filePath, res);
  });
});

function streamFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  const stream = fs.createReadStream(filePath);
  stream.on('open', () => {
    res.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(res);
  });

  stream.on('error', (err) => {
    serveError(res, err);
  });
}

function serveNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
  res.end('404 Not Found');
}

function serveError(res, err) {
  res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
  res.end(`500 Internal Server Error\n${err.message}`);
}

server.listen(port, () => {
  console.log(`🚀 Servidor disponível em http://localhost:${port}`);
});
