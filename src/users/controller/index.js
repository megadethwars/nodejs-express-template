const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../../../config');
const schemes = require('../models/mongoose');
const schemas = require('../utils/schemasValidation');
const validUsername = 'user';
const validPassword = 'password';

module.exports.signUp = async (res, parameters) => {
  const {
    password,
    passwordConfirmation,
    email,
    username,
    name,
    lastName,
  } = parameters;

  if (password === passwordConfirmation) {
    const newUser = schemes.User({
      password: Bcrypt.hashSync(password, 10),
      email,
      username,
      name,
      lastName,
    });

    try {
      const savedUser = await newUser.save();

      const token = jwt.sign(
        { email, id: savedUser.id, username },
        config.API_KEY_JWT,
        { expiresIn: config.TOKEN_EXPIRES_IN }
      );

      return res.status(201).json({ token });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error,
      });
    }
  }

  return res.status(400).json({
    status: 400,
    message: 'Passwords are different, try again!!!',
  });
};



module.exports.login = (req, res) => {

  const { error } = schemas.login.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, password } = req.body;

  if (username === validUsername && password === validPassword) {
    const token = jwt.sign({ username }, config.API_KEY_JWT, { expiresIn: config.TOKEN_EXPIRES_IN });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid username or password' });
};

// Nuevo endpoint "Hello World" protegido con JWT
module.exports.helloWorld = (req, res) => {
  res.json({ message: 'Hello World!' });
};
