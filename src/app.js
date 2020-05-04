const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const app = express(feathers());

// set up a proxy endpoint
const {createProxyMiddleware} = require('http-proxy-middleware');
const {PROXY_CONFIG} = require('./util.js');
app.use('/api', createProxyMiddleware(PROXY_CONFIG));

// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }))
// Add REST API support
app.configure(express.rest());
// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

// a sample post endpoint which simply return the request body
app.post('/target', (req, res) => res.json(req.body));

// Start the server
const PORT = 3030;
app.listen(PORT).on('listening', () =>
  console.log(`Argus testing server listening on localhost:${PORT}`)
);
