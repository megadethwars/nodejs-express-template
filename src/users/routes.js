const express = require('express');

const controller = require('./controller/index');
const validateSchemas = require('../../middlewares/validateSchemas');
const schemas = require('./utils/schemasValidation');
const authenticateJWT = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/api/v1/signup',
  validateSchemas.inputs(schemas.signUp, 'body'),
  (req, res) => {
    controller.signUp(res, req.body);
  }
);


router.post('/login', controller.login);

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.get('/hello', authenticateJWT, controller.helloWorld);

module.exports = router;
