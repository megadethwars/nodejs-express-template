const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(400).json({ message: 'Access denied. No token provided.' });
    }

  const token = authHeader.split(' ')[1];  // Extrae el token después del prefijo "Bearer"


  try {
    
    const decoded = jwt.verify(token, config.API_KEY_JWT);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateJWT;
