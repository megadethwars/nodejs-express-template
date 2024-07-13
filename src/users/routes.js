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

// Nuevo endpoint para listar todos los usuarios protegido
//router.get('/api/v1/users', authenticateJWT, listUsers);
router.get('/api/v1/users', controller.listUsers);

//router.get('/users', authenticateJWT, schemas.listUsers);

router.post('/login', controller.login);

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.get('/hello', authenticateJWT, controller.helloWorld);

module.exports = router;
