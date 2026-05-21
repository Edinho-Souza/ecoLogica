const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = Number(process.env.FRONTEND_PORT || 3000);
const BACKEND_API_URL = (process.env.BACKEND_API_URL || `http://localhost:${process.env.BACKEND_PORT || 8080}/api`).replace(/\/$/, '');

app.get('/js/api.js', (req, res) => {
  const apiPath = path.join(__dirname, 'js', 'api.js');
  const runtimeConfig = `window.API_BASE_URL = ${JSON.stringify(BACKEND_API_URL)};\n`;

  res.type('application/javascript');
  res.set('Cache-Control', 'no-store');
  res.send(runtimeConfig + fs.readFileSync(apiPath, 'utf8'));
});

app.use(express.static(__dirname, {
  extensions: ['html'],
  maxAge: '1h'
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend ecoLogica rodando em http://localhost:${PORT}`);
});
