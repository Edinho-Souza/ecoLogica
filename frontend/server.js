const express = require('express');
const app = express();
const PORT = 3000;

// Servir arquivos do frontend (HTML, CSS, JS)
app.use(express.static('public'));

// Rota padrão (abre o index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
