const http = require('http');
const httpProxy = require('http-proxy');

const server = http.createServer((req, res) => {
  const proxy = httpProxy.createProxyServer({});

  // Change the URL to match your backend server URL
  const targetUrl = 'http://127.0.0.1:5000';

  proxy.web(req, res, { target: targetUrl });
});

server.listen(3001);