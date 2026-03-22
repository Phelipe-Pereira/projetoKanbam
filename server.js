const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Servir arquivos estáticos da raiz do projeto
app.use(express.static(path.join(__dirname)));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});