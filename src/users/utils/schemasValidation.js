const Joi = require('@hapi/joi');

const schemas = {
  signUp: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().required(),
    nameUser: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    age: Joi.number().integer().min(0).required()
  }),
  login: Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  }),
};

module.exports = schemas;
