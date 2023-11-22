// authUtils.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateToken(payload) {
  return jwt.sign(payload, 'Segredo', { expiresIn: '1h' });
}

async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  generateToken,
  comparePassword,
};