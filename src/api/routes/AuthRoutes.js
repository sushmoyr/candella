const express = require('express');

const router = express.Router();

const AuthController = require('../controllers/AuthController')


router.post('/login', AuthController.login);

router.post('/create', AuthController.register);

router.post('/reset', AuthController.reset)

module.exports = router;