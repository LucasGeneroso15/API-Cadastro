// app.js
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.port || 3000;
const bcrypt = require('bcrypt');
const db = require('./dbConfig');
const { generateToken, comparePassword } = require('./authUtils');
const data = require('./data.json');

const app = express();
app.use(bodyParser.json());

// Rota de Cadastro (Sign Up)

app.get('/api/signup', async (req, res) => { 
    res.json(data);
});

app.post('/api/signup', async (req, res) => {
  const { email, password, name, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const insertQuery = 'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)';
  db.query(insertQuery, [email, hashedPassword, name, phone], (err, results) => {
   if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Email já existente' });
    }else{
    const token = generateToken({ email, name});

    return res.status(201).json(
    { 
      //"id": "ID",
      "data_criacao": new Date(),
      "data_atualizacao": new Date(),
      "ultimo_login": new Date(),
      "token": token  
    }
    );
  }});
});

// Rota de Autenticação (Sign In)
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  const selectQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(selectQuery, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro interno ao autenticar usuário' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: '"Usuário e/ou senha inválidos' });
    }

    const user = results[0];
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: '"Usuário e/ou senha inválidos' });
    }

    // token JWT
    const token = generateToken({ userId: user.id, email: user.email });
    return res.status(200).json(
      { 
        //"id": "ID",
        "data_criacao": new Date(),
        "data_atualizacao": new Date(),
        "ultimo_login": new Date(),
        "token": token  
      }
      );
  });
});

// Rota de Recuperação de Informações
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;

  const selectQuery = 'SELECT email, name, phone FROM users WHERE id = ?';
  db.query(selectQuery, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro interno ao recuperar informações do usuário' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userInfo = results[0];
    return res.status(200).json(userInfo);
  });
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log('Servidor iniciado na porta'+port);
});