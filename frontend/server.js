// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000; // Porta diferente da 8080 (Spring Boot)

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "src")));

// Rota padrão (abre o index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Frontend rodando em http://localhost:${PORT}`);
});
