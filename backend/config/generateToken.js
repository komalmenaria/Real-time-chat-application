const crypto = require('crypto');
// Use the generated secret key in your code
const jwt = require('jsonwebtoken');

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

const secretKey = generateSecretKey();
console.log(secretKey); 


const generateToken = (id) => {
  return jwt.sign({ id }, secretKey, {
    expiresIn: '30d'
  });
};

module.exports = generateToken;