const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const options = {
  target: 'http://127.0.0.1:8080', 
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: function(proxyReq, req, res) {
    if (!req.headers['accept-language']) {
      proxyReq.setHeader('Accept-Language', 'es-ES,es;q=0.9,en;q=0.8');
    } else {
      proxyReq.setHeader('Accept-Language', req.headers['accept-language']);
    }
  }
};

app.use('/api', createProxyMiddleware(options));

options.target = 'http://localhost:5177';
app.use('/', createProxyMiddleware(options));

app.listen(80, '127.0.0.1', () => {
  console.log('\n===========================================');
  console.log('✅ PROXY CORRIENDO CORRECTAMENTE');
  console.log('===========================================');
  console.log('👉 Accede al chatbot en: http://localhost/');
  console.log('❌ NO uses: http://localhost:5177/');
  console.log('===========================================\n');
});