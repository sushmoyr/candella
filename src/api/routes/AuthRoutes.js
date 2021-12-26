const express = require('express');

const router = express.Router();

const {AuthController} = require('../controllers');
const {verifyToken} = require("../middlewares");

router.post('/login', AuthController.login);

router.post('/create', AuthController.register);

router.post('/reset', AuthController.reset);

router.put('/update',verifyToken, AuthController.updateAuthInfo)

module.exports = router;