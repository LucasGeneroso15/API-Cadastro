// dbConfig.js
const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Senha',
  database: 'BancoDeDados',
};


const connection = mysql.createConnection(dbConfig);

module.exports = connection;




