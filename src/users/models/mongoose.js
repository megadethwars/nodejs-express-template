const mongoose = require('../../../services/mongoose');

const User = mongoose.model(
  'User',
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    nameUser: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    role: {
      type: Number,
      required: true,
    }

  },
  'users'
);

module.exports = {
  User,
};
