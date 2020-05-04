const HttpStatus = require('http-status-codes');
// in our environment, we use HTTPS, but here we use HTTP agent
// const {HttpsAgent} = require('agentkeepalive');
const Agent = require('agentkeepalive');

// config for http-proxy-middleware
const PROXY_CONFIG = {
  target: 'http://localhost:3030/target',
  // in our environment, we use createTargetOptions to do mTLS
  // target: createTargetOptions(secret[secretName], api.endpoint),
  changeOrigin: true,
  secure: false,
  agent: new Agent({
    // NOTICE: we deliberately turn keepalive to false
    // in order to reproduce the problem
    // set keepalive to true can mitigate the performance issue
    keepAlive: false,
    // should be smaller than 1024 (ALB limitation)
    maxSockets: 768,
    maxFreeSockets: 128,
    freeSocketTimeout: 30000,
    timeout: 60000,
  }),
  pathRewrite: {'api': ''},
  xfwd: true,
  // logProvider: () => logger,
  onError: (_err, _req, res) => {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  },
  onProxyReq: (_proxyReq, req, _res) => {
    console.log(`${new Date()}\tproxy request to [${req.originalUrl}]`);
  },
  onProxyRes: (_proxyRes, req, _res) => {
    console.log(`${new Date()}\tproxy response from [${req.originalUrl}]`);
  },
};

// this function in our environment is responsible for mTLS certs
function createTargetOptions(secret, endpoint) {
  const url = new URL(endpoint);
  const result = {
    protocol: url.protocol,
    host: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
  };

  if (secret === false) {
    return result;
  } else if (secret.contentType === MIME.PKCS12) {
    result.pfx = new Buffer(secret.value, 'base64');
    result.passphrase = '';
  } else if (secret.contentType === MIME.PEM_FILE) {
    result.cert = splitPem(secret.value, PEM.CERT);
    result.key = splitPem(secret.value, PEM.PRIVATE);
  } else {
    throw new Error(`Unknown certificate type [${secret.contentType}]`);
  }

  return result;
}

module.exports = {
  createTargetOptions,
  PROXY_CONFIG
};
