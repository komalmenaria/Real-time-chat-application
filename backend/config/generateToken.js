const crypto = require('crypto');
// Use the generated secret key in your code
const jwt = require('jsonwebtoken');

require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = generateToken;