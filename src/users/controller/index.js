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
    age,
    role,
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
      role,
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
        age: savedUser.age,
        role:savedUser.role

      };
      return res.status(201).json(savedUser);

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



module.exports.login = async (req, res) => {
  const { error } = schemas.login.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, password } = req.body;

  try {
    const user = await schemes.User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await Bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username }, config.API_KEY_JWT, { expiresIn: config.TOKEN_EXPIRES_IN });
    return res.json({ token });

    //return res.status(401).json({ message: 'Invalid username or password' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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

module.exports.getUserById = async (req, res) => {
  try {
    const user = await schemes.User.findById(req.params.id, '-password'); // Excluir la contraseña del resultado
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports.getUserByUserName = async (req, res) => {
  try {
    const user = await schemes.User.find({ username: req.params.username }, '-password'); // Excluir la contraseña del resultado
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};


module.exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // ID del usuario a actualizar
    const updates = req.body; // Campos a actualizar (pueden incluir nombre, apellido, teléfono, etc.)

    // Encuentra y actualiza el usuario
    const updatedUser = await schemes.User.findOneAndUpdate(userId, updates, {
      new: true, // Devuelve el usuario actualizado
      runValidators: true, // Ejecuta las validaciones del esquema
    });

    if (!updatedUser) {
      return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};


