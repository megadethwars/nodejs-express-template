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
    lastName,
    nameUser,
    phone, 
    age
  } = parameters;

  if (password === passwordConfirmation) {
    const newUser = schemes.User({
      password: Bcrypt.hashSync(password, 10),
      email,
      username,
      nameUser,
      lastName,
      phone,
      age,
    });

    try {
      const savedUser = await newUser.save();

      const token = jwt.sign(
        { email, id: savedUser.id, username },
        config.API_KEY_JWT,
        { expiresIn: config.TOKEN_EXPIRES_IN }
      );

      const userResponse = {
        username: savedUser.username,
        email: savedUser.email,
        name: savedUser.name,
        lastName: savedUser.lastName,
        phone: savedUser.phone,
        age: savedUser.age
      };
      return res.status(201).json(userResponse);

      //return res.status(201).json({ token });
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


module.exports.listUsers = async (req, res) => {
  try {
    const users = await schemes.User.find({}, '-password'); // Excluir la contraseña de los resultados
    res.json(users);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};